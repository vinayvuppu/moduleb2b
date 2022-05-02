import React from 'react';
import { shallow } from 'enzyme';
import AttributeInputText from '../attribute-input-text';
import AttributeInputDateTime from '../attribute-input-datetime';
import AttributeInputEnum from '../attribute-input-enum';
import AttributeInputBoolean from '../attribute-input-boolean';
import AttributeInputNumber from '../attribute-input-number';
import AttributeInputMoney from '../attribute-input-money';
import AttributeInputReference from '../attribute-input-reference';
import AttributeInputSet from '../attribute-input-set';
import AttributeInputByType from './attribute-input-by-type';

const createTestProps = (name, custom) => ({
  definition: {
    type: { name },
    label: { en: 'some label' },
    isRequired: false,
    name: 'any-attribute',
  },
  attribute: {
    name: 'some attribute',
    value: '',
  },
  selectedLanguage: 'en',
  onChangeValue: jest.fn(),
  ...custom,
});

const createTextProps = custom => ({
  selectedLanguage: 'en',
  languages: ['en', 'de'],
  onChangeValue: jest.fn(),
  expandSettings: {},
  updateSettings: jest.fn(),
  ...custom,
});

describe('rendering', () => {
  it('should render a text attribute for a text type field', () => {
    const props = createTestProps('text', createTextProps());
    const wrapper = shallow(<AttributeInputByType {...props} />);
    expect(wrapper).toRender(AttributeInputText);
  });
  it('should render a text attribute for a ltext type field', () => {
    const props = createTestProps('text', createTextProps());
    const wrapper = shallow(<AttributeInputByType {...props} />);
    expect(wrapper).toRender(AttributeInputText);
  });
  it('should render a enum attribute for a enum type field', () => {
    const props = createTestProps('enum');
    const wrapper = shallow(<AttributeInputByType {...props} />);
    expect(wrapper).toRender(AttributeInputEnum);
  });
  it('should render a enum attribute for a lenum type field', () => {
    const props = createTestProps('lenum');
    const wrapper = shallow(<AttributeInputByType {...props} />);
    expect(wrapper).toRender(AttributeInputEnum);
  });
  it('should render a boolean attribute for a boolean type field', () => {
    const props = createTestProps('boolean', {
      attribute: { name: 'boolean-attribute', value: false },
    });
    const wrapper = shallow(<AttributeInputByType {...props} />);
    expect(wrapper).toRender(AttributeInputBoolean);
  });
  it('should render a number attribute for a number type field', () => {
    const props = createTestProps('number', { numberFormat: 'number' });
    const wrapper = shallow(<AttributeInputByType {...props} />);
    expect(wrapper).toRender(AttributeInputNumber);
  });
  it('should render a money attribute for a money type field', () => {
    const props = createTestProps('money', {
      numberFormat: 'money',
      currencies: ['EUR'],
    });
    const wrapper = shallow(<AttributeInputByType {...props} />);
    expect(wrapper).toRender(AttributeInputMoney);
  });
  it('should render a AttributeInputDateTime for a date type field', () => {
    const props = createTestProps('date');
    const wrapper = shallow(<AttributeInputByType {...props} />);
    expect(wrapper).toRender(AttributeInputDateTime);
  });
  it('should render a AttributeInputDateTime for a time type field', () => {
    const props = createTestProps('time');
    const wrapper = shallow(<AttributeInputByType {...props} />);
    expect(wrapper).toRender(AttributeInputDateTime);
  });
  it('should render a AttributeInputDateTime for a datetime type field', () => {
    const props = createTestProps('datetime');
    const wrapper = shallow(<AttributeInputByType {...props} />);
    expect(wrapper).toRender(AttributeInputDateTime);
  });
  it('should render a reference attribute for a reference type field', () => {
    const props = createTestProps('reference');
    const wrapper = shallow(<AttributeInputByType {...props} />);
    expect(wrapper).toRender(AttributeInputReference);
  });
  it('should render a set attribute for a set type field', () => {
    const props = createTestProps('set');
    const wrapper = shallow(<AttributeInputByType {...props} />);
    expect(wrapper).toRender(AttributeInputSet);
  });
});
