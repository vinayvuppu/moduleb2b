import React from 'react';
import { shallow } from 'enzyme';
import { CreatableSelectInput } from '@commercetools-frontend/ui-kit';
import TagCreatorInput from './tag-creator-input';

const createTestProps = custom => ({
  value: [],
  onChange: jest.fn(),
  placeholder: 'Enter UUID',
  disabled: false,
  ...custom,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<TagCreatorInput {...props} />);
  });
  it('should render <CreatableSelectinput>', () => {
    expect(wrapper).toRender(CreatableSelectInput);
  });
  it('should proxy value prop', () => {
    expect(wrapper).toHaveProp('value', props.value);
  });
  it('should proxy onChange prop', () => {
    expect(wrapper).toHaveProp('onChange', expect.any(Function));
  });
  it('should proxy placeholder prop', () => {
    expect(wrapper).toHaveProp('placeholder', props.placeholder);
  });
  it('should proxy isDisabled prop', () => {
    expect(wrapper).toHaveProp('isDisabled', props.disabled);
  });
  describe('props for reducing react-select "dropdown" functionality', () => {
    it('should define component as multi', () => {
      expect(wrapper).toHaveProp('isMulti', true);
    });
    it('should pass empty list of options', () => {
      expect(wrapper).toHaveProp('options', []);
    });
  });
});
