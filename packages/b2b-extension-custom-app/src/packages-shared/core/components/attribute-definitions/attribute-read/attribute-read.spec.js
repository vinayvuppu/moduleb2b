import PropTypes from 'prop-types';
import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import { createMountOptions, intlMock } from '../../../../test-utils';
import { AttributeRead } from './attribute-read';

const createTestProps = props => ({
  attributeValue: {
    name: 'text',
    value: 'text',
  },
  languages: ['en', 'de'],
  language: 'en',
  intl: intlMock,
  ...props,
});

const TestItem = ({ children }) => <div>{children}</div>;
TestItem.propTypes = {
  children: PropTypes.any.isRequired,
};

describe('base rendering', () => {
  const props = createTestProps();
  const wrapper = shallow(
    <AttributeRead {...props} />,
    createMountOptions({
      intl: intlMock,
    })
  );

  it('should render text value', () => {
    const valueWrapper = shallow(
      <TestItem>
        {wrapper.instance().renderValue(props.attributeValue.value)}
      </TestItem>,
      createMountOptions()
    );

    expect(valueWrapper.text()).toBe(props.attributeValue.value);
  });

  it('should render money element value', () => {
    wrapper.setProps({
      attributeValue: {
        name: 'money',
        value: {
          centAmount: 123456,
          currencyCode: 'EUR',
        },
      },
    });

    const valueWrapper = shallow(
      wrapper
        .instance()
        .renderValue({ centAmount: 123456, currencyCode: 'EUR' }),
      createMountOptions()
    );

    expect(valueWrapper.find({ className: 'money-currencyCode' }).text()).toBe(
      'EUR'
    );
    expect(valueWrapper.find({ className: 'money-centAmount' }).text()).toBe(
      '1234.56'
    );
  });

  it('should render ltext element value', () => {
    const value = { en: 'ltext-value' };
    wrapper.setProps({
      attributeValue: {
        name: 'ltext',
        value,
      },
    });
    const valueWrapper = shallow(
      wrapper.instance().renderValue(value),
      createMountOptions()
    );

    expect(valueWrapper.find({ className: 'ltext-lang' }).text()).toBe('EN');
    expect(valueWrapper.find({ className: 'ltext-value' }).text()).toBe(
      'ltext-value'
    );
  });

  it('should render enum', () => {
    wrapper.setProps({
      attributeValue: {
        name: 'enum',
        value: {
          key: 'enum',
          label: 'enum label value',
        },
      },
    });

    const valueWrapper = shallow(
      <TestItem>
        {wrapper.instance().renderValue({
          key: 'enum',
          label: 'enum label value',
        })}
      </TestItem>,
      createMountOptions()
    );

    expect(valueWrapper.text()).toBe('enum label value');
  });

  it('should render date-time', () => {
    const value = '2017-01-17T15:04:22.774Z';
    wrapper.setProps({
      attributeValue: {
        name: 'date-time',
        value,
      },
    });

    const valueWrapper = shallow(
      <TestItem>{wrapper.instance().renderValue(value)}</TestItem>,
      createMountOptions()
    );

    expect(valueWrapper.text()).toBe(
      moment(value).format('YYYY-MM-DD, HH:mm:ss')
    );
  });

  it('should render date', () => {
    const value = '2017-01-17';
    wrapper.setProps({
      attributeValue: {
        name: 'date',
        value,
      },
    });

    const valueWrapper = shallow(
      <TestItem>{wrapper.instance().renderValue(value)}</TestItem>,
      createMountOptions()
    );

    expect(valueWrapper.text()).toBe(value);
  });

  it('should render time', () => {
    const value = '15:04:22';
    wrapper.setProps({
      attributeValue: {
        name: 'time',
        value,
      },
    });

    const valueWrapper = shallow(
      <TestItem>{wrapper.instance().renderValue(value)}</TestItem>,
      createMountOptions()
    );

    expect(valueWrapper.text()).toBe(value);
  });

  it('should render boolean', () => {
    const value = true;
    wrapper.setProps({
      attributeValue: {
        name: 'boolean',
        value,
      },
    });

    const valueWrapper = shallow(
      <TestItem>{wrapper.instance().renderValue(value)}</TestItem>,
      createMountOptions()
    );

    expect(valueWrapper.text()).toBe('AttributeRead.yes');
  });
});
