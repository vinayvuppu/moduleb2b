import React from 'react';
import { shallow } from 'enzyme';
import {
  DateInput,
  DateTimeInput,
  TimeInput,
} from '@commercetools-frontend/ui-kit';
import { ApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import SingleFilter from '../single-filter';
import RangeFilter from '../range-filter';
import {
  DateSingleFilter,
  DateMultipleFilter,
  DateTimeSingleFilter,
  DateTimeMultipleFilter,
  DateRangeFilter,
  TimeRangeFilter,
  DateTimeRangeFilter,
} from './date-filters';

const createTestProps = custom => ({
  value: undefined,
  error: undefined,
  onUpdateFilter: jest.fn(),
  ...custom,
});

describe('DateSingleFilter', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<DateSingleFilter {...props} />);
  });
  describe('statics', () => {
    describe('defaultProps', () => {
      it('should default disabled to `false`', () => {
        expect(DateSingleFilter.defaultProps.disabled).toBe(false);
      });
    });
  });
  describe('rendering', () => {
    describe('SingleFilter', () => {
      it('should render a single filter', () => {
        expect(wrapper).toRender(SingleFilter);
      });
      it('should render a single filter with a `renderInput` function', () => {
        expect(wrapper).toHaveProp('renderInput', expect.any(Function));
      });
      it('should render a single filter with the given `value`', () => {
        expect(wrapper).toHaveProp('value', props.value);
      });
      it('should render a single filter with the given `error`', () => {
        expect(wrapper).toHaveProp('error', props.error);
      });
      it('should render a single filter with the given `onUpdateValue`', () => {
        expect(wrapper).toHaveProp('onUpdateValue', props.onUpdateFilter);
      });
    });
    describe('DateInput', () => {
      let inputProps;
      let inputWrapper;
      let renderedWrapper;
      beforeEach(() => {
        props = createTestProps({ disabled: false });
        wrapper = shallow(<DateSingleFilter {...props} />);
        inputProps = {
          value: '2017-01-01',
          hasError: false,
          onUpdateValue: jest.fn(),
          onBlur: jest.fn(),
        };
        inputWrapper = wrapper.renderProp('renderInput')(inputProps);
        renderedWrapper = inputWrapper
          .find(ApplicationContext)
          .renderProp('render')({ user: { timeZone: 'Europe/Madrid' } });
      });
      it('should render a DatePicker', () => {
        expect(renderedWrapper).toRender(DateInput);
      });
      it('should render a DateInput with given value', () => {
        expect(renderedWrapper.find(DateInput)).toHaveProp(
          'value',
          inputProps.value
        );
      });
      it('should render a DatePicker with onBlur passed to onBlur', () => {
        expect(renderedWrapper.find(DateInput)).toHaveProp(
          'onBlur',
          inputProps.onBlur
        );
      });
      it('should render a DateInput with disabled passed to isDisabled', () => {
        expect(renderedWrapper.find(DateInput)).toHaveProp(
          'isDisabled',
          props.disabled
        );
      });
      it('should render a DateInput with hasError passed to hasError', () => {
        expect(renderedWrapper.find(DateInput)).toHaveProp(
          'hasError',
          inputProps.hasError
        );
      });
    });
  });
});
describe('DateMultipleFilter', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<DateMultipleFilter {...props} />);
  });
  describe('rendering', () => {
    describe('SingleFilter', () => {
      it('should render a single filter', () => {
        expect(wrapper).toRender(SingleFilter);
      });
      it('should render a single filter with a `renderInput` function', () => {
        expect(wrapper).toHaveProp('renderInput', expect.any(Function));
      });
      it('should render a single filter with the given `value`', () => {
        expect(wrapper).toHaveProp('value', props.value);
      });
      it('should render a single filter with the given `error`', () => {
        expect(wrapper).toHaveProp('error', props.error);
      });
      it('should render a single filter with the given `onUpdateValue`', () => {
        expect(wrapper).toHaveProp('onUpdateValue', props.onUpdateFilter);
      });
    });
    describe('DateInput', () => {
      let inputProps;
      let inputWrapper;
      let renderedWrapper;
      beforeEach(() => {
        props = createTestProps({ disabled: false });
        wrapper = shallow(<DateMultipleFilter {...props} />);
        inputProps = {
          value: '2017-01-01',
          hasError: false,
          onUpdateValue: jest.fn(),
          onBlur: jest.fn(),
        };
        inputWrapper = wrapper.renderProp('renderInput')(inputProps);
        renderedWrapper = inputWrapper
          .find(ApplicationContext)
          .renderProp('render')({ user: { timeZone: 'Europe/Madrid' } });
      });
      it('should render a DateInput', () => {
        expect(renderedWrapper).toRender(DateInput);
      });
      it('should render a DateInput with given value', () => {
        expect(renderedWrapper.find(DateInput)).toHaveProp(
          'value',
          inputProps.value
        );
      });
      it('should render a DateInput with onBlur passed to onBlur', () => {
        expect(renderedWrapper.find(DateInput)).toHaveProp(
          'onBlur',
          inputProps.onBlur
        );
      });
      it('should render a DateInput with disabled passed to isDisabled', () => {
        expect(renderedWrapper.find(DateInput)).toHaveProp(
          'isDisabled',
          props.disabled
        );
      });
      it('should render a DateInput with hasError passed to hasError', () => {
        expect(renderedWrapper.find(DateInput)).toHaveProp(
          'hasError',
          inputProps.hasError
        );
      });
    });
  });
});
describe('DateTimeSingleFilter', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<DateTimeSingleFilter {...props} />);
  });
  describe('rendering', () => {
    describe('SingleFilter', () => {
      it('should render a single filter', () => {
        expect(wrapper).toRender(SingleFilter);
      });
      it('should render a single filter with a `renderInput` function', () => {
        expect(wrapper).toHaveProp('renderInput', expect.any(Function));
      });
      it('should render a single filter with the given `value`', () => {
        expect(wrapper).toHaveProp('value', props.value);
      });
      it('should render a single filter with the given `error`', () => {
        expect(wrapper).toHaveProp('error', props.error);
      });
      it('should render a single filter with the given `onUpdateValue`', () => {
        expect(wrapper).toHaveProp('onUpdateValue', props.onUpdateFilter);
      });
    });
    describe('DateTimeInput', () => {
      let inputProps;
      let inputWrapper;
      let renderedWrapper;
      beforeEach(() => {
        props = createTestProps({ disabled: false });
        wrapper = shallow(<DateTimeSingleFilter {...props} />);
        inputProps = {
          value: '2018-03-06T23:30:00.000Z',
          hasError: false,
          onUpdateValue: jest.fn(),
          onBlur: jest.fn(),
        };
        inputWrapper = wrapper.renderProp('renderInput')(inputProps);
        renderedWrapper = inputWrapper
          .find(ApplicationContext)
          .renderProp('render')({ user: { timeZone: 'Europe/Madrid' } });
      });
      it('should render a DateTimeInput', () => {
        expect(renderedWrapper).toRender(DateTimeInput);
      });
      it('should render a DateTimeInput with given value', () => {
        expect(renderedWrapper.find(DateTimeInput)).toHaveProp(
          'value',
          inputProps.value
        );
      });
      it('should render a DateTimeInput with onBlur passed to onBlur', () => {
        expect(renderedWrapper.find(DateTimeInput)).toHaveProp(
          'onBlur',
          inputProps.onBlur
        );
      });
      it('should render a DateTimeInput with disabled passed to isDisabled', () => {
        expect(renderedWrapper.find(DateTimeInput)).toHaveProp(
          'isDisabled',
          props.disabled
        );
      });
      it('should render a DateTimeInput with hasError passed to hasError', () => {
        expect(renderedWrapper.find(DateTimeInput)).toHaveProp(
          'hasError',
          inputProps.hasError
        );
      });
    });
  });
});
describe('DateTimeMultipleFilter', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<DateTimeMultipleFilter {...props} />);
  });
  describe('rendering', () => {
    describe('SingleFilter', () => {
      it('should render a single filter', () => {
        expect(wrapper).toRender(SingleFilter);
      });
      it('should render a single filter with a `renderInput` function', () => {
        expect(wrapper).toHaveProp('renderInput', expect.any(Function));
      });
      it('should render a single filter with the given `value`', () => {
        expect(wrapper).toHaveProp('value', props.value);
      });
      it('should render a single filter with the given `error`', () => {
        expect(wrapper).toHaveProp('error', props.error);
      });
      it('should render a single filter with the given `onUpdateValue`', () => {
        expect(wrapper).toHaveProp('onUpdateValue', props.onUpdateFilter);
      });
    });
    describe('DateTimeInput', () => {
      let inputProps;
      let inputWrapper;
      let renderedWrapper;
      beforeEach(() => {
        props = createTestProps({ disabled: false });
        wrapper = shallow(<DateTimeMultipleFilter {...props} />);
        inputProps = {
          value: ['2018-03-06T23:30:00.000Z'],
          hasError: false,
          onUpdateValue: jest.fn(),
          onBlur: jest.fn(),
        };
        inputWrapper = wrapper.renderProp('renderInput')(inputProps);
        renderedWrapper = inputWrapper
          .find(ApplicationContext)
          .renderProp('render')({ user: { timeZone: 'Europe/Madrid' } });
      });
      it('should render a DateTimeInput', () => {
        expect(renderedWrapper).toRender(DateTimeInput);
      });
      it('should render a DateTimeInput with given value', () => {
        expect(renderedWrapper.find(DateTimeInput)).toHaveProp(
          'value',
          inputProps.value
        );
      });
      it('should render a DateTimeInput with onBlur passed to onBlur', () => {
        expect(renderedWrapper.find(DateTimeInput)).toHaveProp(
          'onBlur',
          inputProps.onBlur
        );
      });
      it('should render a DateTimeInput with disabled passed to isDisabled', () => {
        expect(renderedWrapper.find(DateTimeInput)).toHaveProp(
          'isDisabled',
          props.disabled
        );
      });
      it('should render a DateTimeInput with hasError passed to hasError', () => {
        expect(renderedWrapper.find(DateTimeInput)).toHaveProp(
          'hasError',
          inputProps.hasError
        );
      });
    });
  });
});
describe('DateRangeFilter', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps({
      value: { from: '0', to: '10' },
      error: { from: 'something' },
    });
    wrapper = shallow(<DateRangeFilter {...props} />);
  });
  describe('rendering', () => {
    describe('RangeFilter', () => {
      it('should render a range filter', () => {
        expect(wrapper).toRender(RangeFilter);
      });
      it('should render a range filter with a `renderInput` function', () => {
        expect(wrapper).toHaveProp('renderInput', expect.any(Function));
      });
      it('should render a range filter with the given `value`', () => {
        expect(wrapper).toHaveProp('value', props.value);
      });
      it('should render a range filter with the given `error`', () => {
        expect(wrapper).toHaveProp('error', props.error);
      });
      it('should render a range filter with the given `onUpdateValue`', () => {
        expect(wrapper).toHaveProp('onUpdateValue', props.onUpdateFilter);
      });
    });
    describe('DateInput', () => {
      let inputProps;
      let inputWrapper;
      let renderedWrapper;
      beforeEach(() => {
        props = createTestProps({ disabled: false });
        wrapper = shallow(<DateRangeFilter {...props} />);
        inputProps = {
          value: '2017-01-01',
          hasError: false,
          onUpdateValue: jest.fn(),
          onBlur: jest.fn(),
        };
        inputWrapper = wrapper.renderProp('renderInput')(inputProps);
        renderedWrapper = inputWrapper
          .find(ApplicationContext)
          .renderProp('render')({ user: { timeZone: 'Europe/Madrid' } });
      });
      it('should render a DateInput', () => {
        expect(renderedWrapper).toRender(DateInput);
      });
      it('should render a DateInput with given value', () => {
        expect(renderedWrapper.find(DateInput)).toHaveProp(
          'value',
          inputProps.value
        );
      });
      it('should render a DateInput with onBlur passed to onBlur', () => {
        expect(renderedWrapper.find(DateInput)).toHaveProp(
          'onBlur',
          inputProps.onBlur
        );
      });
      it('should render a DateInput with disabled passed to isDisabled', () => {
        expect(renderedWrapper.find(DateInput)).toHaveProp(
          'isDisabled',
          props.disabled
        );
      });
      it('should render a DateInput with hasError passed to hasError', () => {
        expect(renderedWrapper.find(DateInput)).toHaveProp(
          'hasError',
          inputProps.hasError
        );
      });
    });
  });
});
describe('TimeRangeFilter', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps({
      value: { from: '10:00:00.000', to: '10:00:00.000' },
      error: { from: 'something' },
    });
    wrapper = shallow(<TimeRangeFilter {...props} />);
  });
  describe('rendering', () => {
    describe('RangeFilter', () => {
      it('should render a range filter', () => {
        expect(wrapper).toRender(RangeFilter);
      });
      it('should render a range filter with a `renderInput` function', () => {
        expect(wrapper).toHaveProp('renderInput', expect.any(Function));
      });
      it('should render a range filter with the given `value`', () => {
        expect(wrapper).toHaveProp('value', props.value);
      });
      it('should render a range filter with the given `error`', () => {
        expect(wrapper).toHaveProp('error', props.error);
      });
      it('should render a range filter with the given `onUpdateValue`', () => {
        expect(wrapper).toHaveProp('onUpdateValue', props.onUpdateFilter);
      });
    });
    describe('TimeInput', () => {
      let inputProps;
      let inputWrapper;
      let renderedWrapper;
      beforeEach(() => {
        props = createTestProps({ disabled: false });
        wrapper = shallow(<TimeRangeFilter {...props} />);
        inputProps = {
          value: '10:00:00.000',
          hasError: false,
          onUpdateValue: jest.fn(),
          onBlur: jest.fn(),
        };
        inputWrapper = wrapper.renderProp('renderInput')(inputProps);
        renderedWrapper = inputWrapper
          .find(ApplicationContext)
          .renderProp('render')({ user: { timeZone: 'Europe/Madrid' } });
      });
      it('should render a TimeInput', () => {
        expect(renderedWrapper).toRender(TimeInput);
      });
      it('should render a TimeInput with given value', () => {
        expect(renderedWrapper.find(TimeInput)).toHaveProp(
          'value',
          inputProps.value
        );
      });
      it('should render a TimeInput with onBlur passed to onBlur', () => {
        expect(renderedWrapper.find(TimeInput)).toHaveProp(
          'onBlur',
          inputProps.onBlur
        );
      });
      it('should render a TimeInput with disabled passed to isDisabled', () => {
        expect(renderedWrapper.find(TimeInput)).toHaveProp(
          'isDisabled',
          props.disabled
        );
      });
      it('should render a TimeInput with hasError passed to hasError', () => {
        expect(renderedWrapper.find(TimeInput)).toHaveProp(
          'hasError',
          inputProps.hasError
        );
      });
    });
  });
});
describe('DateTimeRangeFilter', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps({
      value: { from: '2018-10-25T10:00:00.000', to: '2018-10-25T10:00:00.000' },
      error: { from: 'something' },
    });
    wrapper = shallow(<DateTimeRangeFilter {...props} />);
  });
  describe('rendering', () => {
    describe('RangeFilter', () => {
      it('should render a range filter', () => {
        expect(wrapper).toRender(RangeFilter);
      });
      it('should render a range filter with a `renderInput` function', () => {
        expect(wrapper).toHaveProp('renderInput', expect.any(Function));
      });
      it('should render a range filter with the given `value`', () => {
        expect(wrapper).toHaveProp('value', props.value);
      });
      it('should render a range filter with the given `error`', () => {
        expect(wrapper).toHaveProp('error', props.error);
      });
      it('should render a range filter with the given `onUpdateValue`', () => {
        expect(wrapper).toHaveProp('onUpdateValue', props.onUpdateFilter);
      });
    });
    describe('DateTimeInput', () => {
      let inputProps;
      let inputWrapper;
      let renderedWrapper;
      beforeEach(() => {
        props = createTestProps({ disabled: false });
        wrapper = shallow(<DateTimeRangeFilter {...props} />);
        inputProps = {
          value: '2018-10-25T10:00:00.000',
          hasError: false,
          onUpdateValue: jest.fn(),
          onBlur: jest.fn(),
        };
        inputWrapper = wrapper.renderProp('renderInput')(inputProps);
        renderedWrapper = inputWrapper
          .find(ApplicationContext)
          .renderProp('render')({ user: { timeZone: 'Europe/Madrid' } });
      });
      it('should render a DateTimeInput', () => {
        expect(renderedWrapper).toRender(DateTimeInput);
      });
      it('should render a DateTimeInput with given value', () => {
        expect(renderedWrapper.find(DateTimeInput)).toHaveProp(
          'value',
          inputProps.value
        );
      });
      it('should render a DateTimeInput with onBlur passed to onBlur', () => {
        expect(renderedWrapper.find(DateTimeInput)).toHaveProp(
          'onBlur',
          inputProps.onBlur
        );
      });
      it('should render a DateTimeInput with disabled passed to isDisabled', () => {
        expect(renderedWrapper.find(DateTimeInput)).toHaveProp(
          'isDisabled',
          props.disabled
        );
      });
      it('should render a DateTimeInput with hasError passed to hasError', () => {
        expect(renderedWrapper.find(DateTimeInput)).toHaveProp(
          'hasError',
          inputProps.hasError
        );
      });
    });
  });
});
