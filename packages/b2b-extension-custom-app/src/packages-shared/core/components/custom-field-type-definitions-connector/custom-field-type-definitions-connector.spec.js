import React from 'react';
import { shallow } from 'enzyme';
import invariant from 'tiny-invariant';
import { CustomFieldTypeDefinitionsConnector } from './custom-field-type-definitions-connector';

jest.mock('tiny-invariant');

const createTestProps = custom => ({
  children: jest.fn(() => <div className="child" />),
  resources: ['channel'],
  typeKey: 'type-key-1',
  locale: 'en',
  projectKey: 'test-project-1',
  isDisabled: false,
  fetchTypeDefinitionsQuery: {
    loading: false,
    typeDefinitions: {
      total: 1,
      count: 1,
      results: [
        {
          fieldDefinitions: [],
          id: 'test-1',
          key: 'key-1',
          nameAllLocales: [{ value: 'Foo', locale: 'en' }],
        },
      ],
    },
  },
  ...custom,
});

describe('render', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CustomFieldTypeDefinitionsConnector {...props} />);
  });
  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should call `children`', () => {
    expect(props.children).toHaveBeenCalledTimes(1);
  });
  it('should call `children` with `customFieldDefinitionsFetcher`', () => {
    expect(props.children).toHaveBeenCalledWith(
      expect.objectContaining({
        customFieldTypeDefinitionsFetcher: {
          isLoading: props.fetchTypeDefinitionsQuery.loading,
          customFieldTypeDefinitions:
            props.fetchTypeDefinitionsQuery.typeDefinitions,
        },
      })
    );
  });
});

describe('lifecycle', () => {
  let props;
  let wrapper;
  describe('componentDidMount', () => {
    describe('when all the resource are not valid', () => {
      beforeEach(() => {
        props = createTestProps({ resources: ['Foo', 'Bar'] });
        wrapper = shallow(<CustomFieldTypeDefinitionsConnector {...props} />);
        wrapper.instance().componentDidMount();
      });
      it('should invoke `invariant`', () => {
        expect(invariant).toHaveBeenCalled();
      });
    });
    describe('when some of the resource are not valid', () => {
      beforeEach(() => {
        props = createTestProps({ resources: ['customer', 'Bar'] });
        wrapper = shallow(<CustomFieldTypeDefinitionsConnector {...props} />);
        wrapper.instance().componentDidMount();
      });
      it('should invoke `invariant`', () => {
        expect(invariant).toHaveBeenCalled();
      });
    });
  });
});
