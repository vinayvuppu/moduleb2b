import React from 'react';
import { shallow } from 'enzyme';
import { createMountOptions } from '../../../../test-utils';
import { createReferenceSearch, ItemCache } from './reference-search';

const createComponentProps = custom => ({
  type: 'category',
  loadItems: jest.fn(() => Promise.resolve(null)),
  getItemById: jest.fn(() => Promise.resolve(null)),
  mapItemToOption: jest.fn(),
  renderItem: jest.fn(),
  labels: {
    noResults: { id: 'no results' },
    searchPrompt: { id: 'type something' },
    placeholder: { id: 'placeholder' },
    isMissing: { id: 'is missing' },
  },
  ...custom,
});

const createComponent = props => createReferenceSearch(props);

const createTestProps = custom => ({
  definition: {
    name: 'someField',
  },
  selectedLanguage: 'en',
  languages: ['en', 'de'],
  onChangeValue: jest.fn(),
  client: {},
  intl: {
    formatMessage: jest.fn(msg => msg.id),
  },
  ...custom,
});

describe('creatingComponent', () => {
  const componentProps = createComponentProps();
  const ReferenceSearch = createComponent(componentProps);

  it('should create a component', () => {
    expect(ReferenceSearch).toBeComponentWithName('CategoryReferenceSearch');
  });
});

describe('rendering', () => {
  const componentProps = createComponentProps();
  const ReferenceSearch = createComponent(componentProps);
  const props = createTestProps();
  const wrapper = shallow(<ReferenceSearch {...props} />, createMountOptions());
  wrapper.setState({ hasLoadedValue: true, value: { id: 'something' } });

  it('should render an autocomplete', () => {
    expect(wrapper.find('Autocomplete')).toHaveLength(1);
    expect(wrapper.find('Autocomplete').props()).toEqual(
      expect.objectContaining({
        onChange: wrapper.instance().handleChange,
        onFocus: expect.any(Function),
        loadItems: wrapper.instance().handleLoadItems,
        placeholderLabel: componentProps.labels.placeholder.id,
        noResultsLabel: componentProps.labels.noResults.id,
        searchPromptLabel: componentProps.labels.searchPrompt.id,
        mapItemToOption: expect.any(Function),
        mapValueToItem: wrapper.instance().mapValueToItem,
        renderItem: wrapper.instance().renderOption,
        value: { id: 'something' },
      })
    );
  });

  it('should render a "missing reference" messsage if reference is not found', () => {
    wrapper.setProps({ value: { id: 'some_reference' } });
    wrapper.setState({ value: null, hasLoadedValue: true });

    expect(wrapper.find('div.missing-label')).toHaveLength(1);
    expect(wrapper.find('div.missing-label').text()).toBe('is missing');
  });
});

describe('callbacks', () => {
  describe('renderOption', () => {
    let componentProps;
    let ReferenceSearch;
    let props;
    let wrapper;
    beforeEach(() => {
      componentProps = createComponentProps();
      ReferenceSearch = createComponent(componentProps);
      props = createTestProps();
      wrapper = shallow(<ReferenceSearch {...props} />, createMountOptions());
    });
    it('should call renderItem', () => {
      wrapper.instance().renderOption({ id: 'someId' });
      expect(componentProps.renderItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('handling changes', () => {
    describe('changing to a new reference', () => {
      let componentProps;
      let ReferenceSearch;
      let props;
      let wrapper;
      beforeEach(() => {
        componentProps = createComponentProps();
        ReferenceSearch = createComponent(componentProps);
        props = createTestProps();
        wrapper = shallow(<ReferenceSearch {...props} />, createMountOptions());
        wrapper.instance().handleChange('ref1');
      });

      it('should call the handle change function', () => {
        expect(props.onChangeValue).toHaveBeenCalledTimes(1);
      });

      it('should call the handle change function with the proper args', () => {
        expect(props.onChangeValue).toHaveBeenCalledWith({
          name: props.definition.name,
          value: {
            id: 'ref1',
            typeId: componentProps.type,
          },
        });
      });
    });

    describe('changing to a null reference (removal)', () => {
      let componentProps;
      let ReferenceSearch;
      let props;
      let wrapper;
      beforeEach(() => {
        componentProps = createComponentProps();
        ReferenceSearch = createComponent(componentProps);
        props = createTestProps();
        wrapper = shallow(<ReferenceSearch {...props} />, createMountOptions());
        wrapper.instance().handleChange(null);
      });

      it('should call the handle change function', () => {
        expect(props.onChangeValue).toHaveBeenCalledTimes(1);
      });

      it('should call the handle change function with the proper args', () => {
        expect(props.onChangeValue).toHaveBeenCalledWith({
          name: props.definition.name,
          value: null,
        });
      });
    });
  });
});

describe('lifecycle', () => {
  describe('will mount', () => {
    let realValue;
    let getItemByIdMock;
    let componentProps;
    let ReferenceSearch;
    beforeEach(async () => {
      realValue = { id: 'someId', name: { en: 'Some English Name' } };
      const getItemByIdResult = Promise.resolve(realValue);
      getItemByIdMock = jest.fn(() => getItemByIdResult);
      componentProps = createComponentProps({
        getItemById: getItemByIdMock,
      });
      ReferenceSearch = createComponent(componentProps);
      await getItemByIdResult;
    });

    describe('when mounting with undefined value', () => {
      let ReferenceSearchWithCache;
      let props;
      let wrapper;
      beforeEach(() => {
        ReferenceSearchWithCache = createComponent({
          ...componentProps,
          itemCache: new ItemCache({ someItem: { id: 'someItem' } }),
        });
        props = createTestProps({ value: { id: 'someItem' } });
        wrapper = shallow(
          <ReferenceSearchWithCache {...props} />,
          createMountOptions()
        );
      });
      it('should not load item', () => {
        expect(getItemByIdMock).toHaveBeenCalledTimes(0);
      });
      it('should use value in cache', () => {
        expect(wrapper.state().value).toEqual({ id: 'someItem' });
      });
    });

    describe('when mounting with defined value', () => {
      let props;
      let wrapper;
      beforeEach(() => {
        props = createTestProps({
          value: { id: 'someId' },
        });
        wrapper = shallow(<ReferenceSearch {...props} />, createMountOptions());
      });
      it('should load item by id', () => {
        expect(getItemByIdMock).toHaveBeenCalledTimes(1);
        expect(getItemByIdMock).toHaveBeenCalledWith('someId', props.client);
      });

      it('should store fetched value in state', () => {
        wrapper.update();
        expect(wrapper.state()).toMatchObject({
          value: realValue,
          hasLoadedValue: true,
          hasBeenFocused: false,
        });
      });
    });

    describe('when mounting witha value to load', () => {
      let props;
      let wrapper;
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<ReferenceSearch {...props} />, createMountOptions());
      });
      it('should set state', () => {
        expect(wrapper.state()).toMatchObject({
          value: null,
          hasLoadedValue: true,
        });
      });
    });
  });

  describe('will receive props', () => {
    const cachedValue = { id: 'someNewValue', name: { en: 'some new value' } };
    const ReferenceSearch = createComponent(
      createComponentProps({
        itemCache: new ItemCache({ someNewValue: cachedValue }),
      })
    );
    const props = createTestProps({ value: { id: 'someId' } });
    const wrapper = shallow(
      <ReferenceSearch {...props} />,
      createMountOptions()
    );

    it('should map a value to an item if the value changes', () => {
      wrapper.setProps({ value: { id: 'someNewValue' } });
      expect(wrapper.state().value).toEqual(cachedValue);
    });
  });
});
