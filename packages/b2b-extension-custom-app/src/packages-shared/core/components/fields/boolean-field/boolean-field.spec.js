import React from 'react';
import { SelectInput } from '@commercetools-frontend/ui-kit';
import { shallow } from 'enzyme';
import { intlMock } from '../../../../test-utils';
import { BooleanField, valueMapping } from './boolean-field';

const createTestProps = props => ({
  name: 'name',
  onChange: jest.fn(),
  intl: intlMock,
  ...props,
});

describe('rendering the component', () => {
  it('renders a boolean field with a SelectInput component', () => {
    const props = createTestProps();
    const wrapper = shallow(<BooleanField {...props} />);

    expect(wrapper.type()).toBe(SelectInput);
  });

  it('is a boolean field with only two options (multi disabled)', () => {
    const props = createTestProps();
    const wrapper = shallow(<BooleanField {...props} />);

    const options = wrapper.find(SelectInput).prop('options');
    expect(options).toHaveLength(2);
  });

  it('is a boolean field three options (multi enabled)', () => {
    const props = createTestProps({ isMulti: true });
    const wrapper = shallow(<BooleanField {...props} />);

    const options = wrapper.find(SelectInput).prop('options');
    expect(options).toHaveLength(3);
  });

  it('renders a non isClearable boolean field when is required', () => {
    const props = createTestProps({ isRequired: true });
    const wrapper = shallow(<BooleanField {...props} />);

    const isClearable = wrapper.find(SelectInput).prop('isClearable');
    expect(isClearable).toBe(false);
  });

  it('renders a isClearable boolean field when is not required', () => {
    const props = createTestProps({ isRequired: false });
    const wrapper = shallow(<BooleanField {...props} />);

    const isClearable = wrapper.find(SelectInput).prop('isClearable');
    expect(isClearable).toBe(true);
  });

  it('shows the "all" option when isMulti and yes/no values are set', () => {
    const props = createTestProps({
      isMulti: true,
      value: ['yes', 'no'],
    });
    const wrapper = shallow(<BooleanField {...props} />);

    const selectedValue = wrapper.find(SelectInput).prop('value');
    expect(selectedValue).toBe('all');
  });
});

describe('callbacks', () => {
  it('calls the onChange function when a change event happens', () => {
    const valueMappingKeys = Object.keys(valueMapping);
    valueMappingKeys.forEach(key => {
      const onChange = jest.fn();
      const props = createTestProps({ onChange });
      const wrapper = shallow(<BooleanField {...props} />);

      wrapper.find(SelectInput).prop('onChange')({
        target: { value: key },
      });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(valueMapping[key]);
    });
  });
});
