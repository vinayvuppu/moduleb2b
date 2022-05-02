import React from 'react';
import { shallow } from 'enzyme';
import localize from '@commercetools-local/utils/localize';
import LabelField from '@commercetools-local/core/components/fields/label-field';
import { AttributeInput } from './attribute-input';

jest.mock('@commercetools-local/utils/localize', () =>
  jest.fn(() => 'localized value')
);

const createTestProps = custom => ({
  definition: {
    type: {
      name: 'text',
    },
    label: {
      en: 'english label',
      de: 'german label',
    },
    inputTip: {
      en: 'english tip',
      de: 'german tip',
    },
    isRequired: false,
    name: 'attribute-input',
  },
  selectedLanguage: 'en',
  languages: ['de', 'en'],
  ...custom,
});

describe('rendering', () => {
  const props = createTestProps();
  const wrapper = shallow(<AttributeInput {...props} />);

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('LabelField', () => {
    it('should be rendered', () => {
      expect(wrapper).toRender(LabelField);
    });
    it('should localize `title`', () => {
      expect(localize).toHaveBeenCalledWith({
        obj: props.definition,
        key: 'label',
        language: props.selectedLanguage,
        fallbackOrder: props.languages,
      });
    });
    it('should use localized value for `title`', () => {
      expect(wrapper.find(LabelField)).toHaveProp('title', 'localized value');
    });
    it('should propagate `isRequired`', () => {
      expect(wrapper.find(LabelField)).toHaveProp(
        'isRequired',
        props.definition.isRequired
      );
    });
  });

  it('should render AttributeReferenceLabel', () => {
    expect(wrapper.find('AttributeReferenceLabel')).toHaveLength(1);
    expect(wrapper.find('AttributeReferenceLabel').props()).toEqual({
      definition: props.definition,
    });
  });

  it('should render AttributeInputByType', () => {
    expect(wrapper.find('AttributeInputByType')).toHaveLength(1);
    expect(wrapper.find('AttributeInputByType').props()).toEqual(
      expect.objectContaining(props)
    );
  });
});
