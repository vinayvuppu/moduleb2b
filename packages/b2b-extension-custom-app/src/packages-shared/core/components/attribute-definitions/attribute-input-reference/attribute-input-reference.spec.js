import React from 'react';
import { shallow } from 'enzyme';
import { CategoryReferenceSearch } from '../reference-search';
import AttributeInputReference, {
  RequiredThrottledField,
} from './attribute-input-reference';

const createTestProps = custom => ({
  definition: {
    type: {},
    isRequired: false,
  },
  selectedLanguage: 'en',
  attribute: {
    name: 'some attribute',
  },
  onChangeValue: jest.fn(),
  onBlurValue: jest.fn(),
  ...custom,
});

describe('rendering', () => {
  it('should render basic input', () => {
    const props = createTestProps();
    const wrapper = shallow(<AttributeInputReference {...props} />);

    expect(wrapper.find('ThrottledField')).toHaveLength(1);
  });

  it('should render required input', () => {
    const props = createTestProps({
      definition: {
        type: {},
        isRequired: true,
      },
    });
    const wrapper = shallow(<AttributeInputReference {...props} />);

    expect(wrapper.find(RequiredThrottledField)).toHaveLength(1);
  });

  it('should render reference search component input', () => {
    const props = createTestProps({
      definition: {
        type: {
          referenceTypeId: 'category',
        },
      },
    });
    const wrapper = shallow(<AttributeInputReference {...props} />);
    expect(wrapper).toRender(CategoryReferenceSearch);
  });
});

describe('callbacks', () => {
  it('should called change callback', () => {
    const props = createTestProps();
    const wrapper = shallow(<AttributeInputReference {...props} />);

    wrapper.instance().handleChange({ target: { value: null } });
    expect(props.onChangeValue).toHaveBeenCalledTimes(1);
  });

  it('should called blur callback', () => {
    const props = createTestProps();
    const wrapper = shallow(<AttributeInputReference {...props} />);

    wrapper.instance().handleBlur();
    expect(props.onBlurValue).toHaveBeenCalledTimes(1);
  });
});
