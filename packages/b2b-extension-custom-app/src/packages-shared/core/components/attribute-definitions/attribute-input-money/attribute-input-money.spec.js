import React from 'react';
import { shallow } from 'enzyme';
import { SelectInput } from '@commercetools-frontend/ui-kit';
import { createMountOptions, intlMock } from '../../../../test-utils';
import { AttributeInputMoney, ValidatedNumericFormatInput } from '.';

const createTestProps = value => ({
  numberFormat: 'en',
  currencies: ['eur', 'usd'],
  attribute: {
    name: 'foo',
    value,
  },
  onChangeValue: jest.fn(),
  intl: intlMock,
});

describe('rendering', () => {
  it('should render element with no value', () => {
    const props = createTestProps();
    const wrapper = shallow(
      <AttributeInputMoney {...props} />,
      createMountOptions()
    );

    expect(wrapper.type()).toBe('div');
    expect(wrapper.props().className).toBe('attribute-currencies');
    expect(wrapper.props().children).toHaveLength(2);

    expect(wrapper.find(SelectInput)).toHaveProp('value', 'eur');
    expect(wrapper.find(SelectInput)).toHaveProp('name', 'currencies');
    expect(
      wrapper
        .childAt(1)
        .childAt(0)
        .is(ValidatedNumericFormatInput)
    ).toBe(true);
    expect(
      wrapper
        .childAt(1)
        .childAt(0)
        .props().numberFormatType
    ).toBe('money');
    expect(
      wrapper
        .childAt(1)
        .childAt(0)
        .props().value
    ).toBe(undefined);
  });

  it('should render element with initial value', () => {
    const props = createTestProps({
      centAmount: 11122233,
      currencyCode: 'usd',
    });
    const wrapper = shallow(
      <AttributeInputMoney {...props} />,
      createMountOptions()
    );

    expect(wrapper.find(SelectInput)).toHaveProp('value', 'usd');

    expect(
      wrapper
        .childAt(1)
        .childAt(0)
        .is(ValidatedNumericFormatInput)
    ).toBe(true);
    expect(
      wrapper
        .childAt(1)
        .childAt(0)
        .props().value
    ).toBe(11122233);
  });
});

describe('callbacks', () => {
  it('should handle changes', () => {
    const props = createTestProps({
      centAmount: 1000,
      currencyCode: 'usd',
    });
    const wrapper = shallow(
      <AttributeInputMoney {...props} />,
      createMountOptions()
    );

    // Currency
    wrapper
      .find(SelectInput)
      .at(0)
      .props()
      .onChange({ target: { value: 'eur' } });

    expect(props.onChangeValue).toHaveBeenCalledWith({
      name: props.attribute.name,
      value: {
        centAmount: 1000,
        currencyCode: 'eur',
      },
    });

    // Amount
    wrapper
      .childAt(1)
      .childAt(0)
      .props()
      .onChangeValue(11122233);

    expect(props.onChangeValue).toHaveBeenCalledWith({
      name: props.attribute.name,
      value: {
        centAmount: 11122233,
        currencyCode: 'usd',
      },
    });
  });

  it('should set currency code if only centAmount is set', () => {
    const props = createTestProps(null);
    const wrapper = shallow(
      <AttributeInputMoney {...props} />,
      createMountOptions()
    );

    wrapper
      .childAt(1)
      .childAt(0)
      .props()
      .onChangeValue(11122233);

    expect(props.onChangeValue).toHaveBeenCalledWith({
      name: props.attribute.name,
      value: {
        centAmount: 11122233,
        currencyCode: 'eur',
      },
    });
  });

  it('should keep currency code if centAmount is unset', () => {
    const props = createTestProps('something');
    const wrapper = shallow(
      <AttributeInputMoney {...props} />,
      createMountOptions()
    );

    wrapper.find(ValidatedNumericFormatInput).prop('onChangeValue')('');

    expect(props.onChangeValue).toHaveBeenCalledWith({
      name: 'foo',
      value: {
        centAmount: undefined,
        currencyCode: 'eur',
      },
    });
  });

  describe('set 0 as a value', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps(null);
      wrapper = shallow(
        <AttributeInputMoney {...props} />,
        createMountOptions()
      );
      wrapper.find(ValidatedNumericFormatInput).prop('onChangeValue')(0);
    });

    it('should accept 0 as a value', () => {
      expect(props.onChangeValue).toHaveBeenCalledWith({
        name: props.attribute.name,
        value: {
          centAmount: 0,
          currencyCode: 'eur',
        },
      });
    });
  });
});
