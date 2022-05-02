import React from 'react';
import { shallow } from 'enzyme';
import AttributeInputDateTime, {
  RequiredDatePicker,
  ProxyDatePicker,
} from './attribute-input-datetime';

jest.mock('moment');

const createTestProps = props => ({
  onChangeValue: jest.fn(),
  attribute: { name: 'test', value: '' },
  definition: { type: { name: 'datetime' }, isRequired: false },
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<AttributeInputDateTime {...props} />).renderProp(
      'render'
    )({ user: { timeZone: 'Europe/Madrid' } });
  });
  it('should pass value as prop', () => {
    expect(wrapper).toHaveProp('value', props.attribute.value);
  });
  it('should pass onChange as prop', () => {
    expect(wrapper).toHaveProp('onChange');
  });
  it('should pass onBlur as prop', () => {
    expect(wrapper).toHaveProp('onBlur');
  });
  describe('when attribute is not required', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<AttributeInputDateTime {...props} />).renderProp(
        'render'
      )({ user: { timeZone: 'Europe/Madrid' } });
    });
    it('should render <DatePicker>', () => {
      expect(wrapper).toRender(ProxyDatePicker);
    });
  });
  describe('when attribute is required', () => {
    beforeEach(() => {
      props = createTestProps({
        definition: { type: { name: 'datetime' }, isRequired: true },
      });
      wrapper = shallow(<AttributeInputDateTime {...props} />).renderProp(
        'render'
      )({ user: { timeZone: 'Europe/Madrid' } });
    });
    it('should render <RequiredDatePicker>', () => {
      expect(wrapper).toRender(RequiredDatePicker);
    });
  });
});

describe('interaction', () => {
  let props;
  let wrapper;
  describe('when value changes', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<AttributeInputDateTime {...props} />);
      const changeEvent = {
        target: { value: new Date() },
      };
      wrapper.instance().handleChange(changeEvent);
    });
    it('should call onChangeValue with attribute name', () => {
      expect(props.onChangeValue).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'test' })
      );
    });
    describe('for date type', () => {
      beforeEach(() => {
        props = createTestProps({
          definition: { type: { name: 'date' }, isRequired: false },
        });
        wrapper = shallow(<AttributeInputDateTime {...props} />);
        const changeEvent = {
          target: { value: '2017-01-01' },
        };
        wrapper.instance().handleChange(changeEvent);
      });
      it('should call onChangeValue with parsed datetime value', () => {
        expect(props.onChangeValue).toHaveBeenCalledWith(
          expect.objectContaining({ value: '2017-01-01' })
        );
      });
    });
    describe('for time type', () => {
      beforeEach(() => {
        props = createTestProps({
          definition: { type: { name: 'time' }, isRequired: false },
        });
        wrapper = shallow(<AttributeInputDateTime {...props} />);
        const changeEvent = {
          target: { value: '10:05:00.000' },
        };
        wrapper.instance().handleChange(changeEvent);
      });
      it('should call onChangeValue with parsed datetime value', () => {
        expect(props.onChangeValue).toHaveBeenCalledWith(
          expect.objectContaining({ value: '10:05:00.000' })
        );
      });
    });
    describe('for datetime type', () => {
      beforeEach(() => {
        props = createTestProps({
          definition: { type: { name: 'datetime' }, isRequired: false },
        });
        wrapper = shallow(<AttributeInputDateTime {...props} />);
        const changeEvent = {
          target: { value: '2017-01-01T10:05:00.000Z' },
        };
        wrapper.instance().handleChange(changeEvent);
      });
      it('should call onChangeValue with parsed datetime value', () => {
        expect(props.onChangeValue).toHaveBeenCalledWith(
          expect.objectContaining({ value: '2017-01-01T10:05:00.000Z' })
        );
      });
    });

    describe('when clearing datetime value', () => {
      const clearedValue = '';

      beforeEach(() => {
        props = createTestProps({
          definition: { type: { name: 'datetime' }, isRequired: false },
        });
        wrapper = shallow(<AttributeInputDateTime {...props} />);
        const changeEvent = {
          target: { value: clearedValue },
        };
        wrapper.instance().handleChange(changeEvent);
      });
      it('should set value key to undefined when clearing datetime value', () => {
        expect(props.onChangeValue).toHaveBeenCalledWith(
          expect.not.objectContaining({ value: clearedValue })
        );
      });
    });
  });
});
