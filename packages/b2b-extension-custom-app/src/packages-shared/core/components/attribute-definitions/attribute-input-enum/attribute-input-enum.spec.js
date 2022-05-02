import React from 'react';
import { shallow } from 'enzyme';
import { SelectInput } from '@commercetools-frontend/ui-kit';
import { createMountOptions, intlMock } from '../../../../test-utils';
import { AttributeInputEnum } from './attribute-input-enum';

const createTestProps = custom => ({
  definition: {
    type: {
      elementType: {
        values: [
          { key: 'one', value: 'One' },
          { key: 'two', value: 'Two' },
        ],
      },
    },
  },
  selectedLanguage: 'en',
  attribute: {
    name: 'some attribute',
  },
  onChangeValue: jest.fn(),
  onBlurValue: jest.fn(),
  intl: intlMock,
  ...custom,
});

describe('rendering', () => {
  it('should render select', () => {
    const wrapper = shallow(
      <AttributeInputEnum {...createTestProps()} />,
      createMountOptions()
    );

    expect(wrapper.find(SelectInput)).toHaveLength(1);
  });
});

describe('callbacks', () => {
  it('should call the change callback when value is changed', () => {
    const props = createTestProps();
    const wrapper = shallow(
      <AttributeInputEnum {...props} />,
      createMountOptions()
    );
    wrapper.find(SelectInput).prop('onChange')({ target: {} });
    expect(props.onChangeValue).toHaveBeenCalledTimes(1);
  });
  it('should call the blur callback when value is blurred', () => {
    const props = createTestProps();
    const wrapper = shallow(
      <AttributeInputEnum {...props} />,
      createMountOptions()
    );
    wrapper.find(SelectInput).simulate('blur');
    expect(props.onBlurValue).toHaveBeenCalledTimes(1);
  });
});
