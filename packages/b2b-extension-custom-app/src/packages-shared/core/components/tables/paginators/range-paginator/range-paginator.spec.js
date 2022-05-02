import React from 'react';
import { shallow } from 'enzyme';
import {
  NumberInput,
  SecondaryIconButton,
} from '@commercetools-frontend/ui-kit';
import { intlMock } from '../../../../../test-utils';
import { RangePaginator } from './range-paginator';

const createFormValues = props => ({
  totalPages: 3,
  totalItems: 100,
  perPage: 20,
  page: 1,

  ...props,
});

const createTestProps = props => ({
  onPageChange: jest.fn(),
  totalItems: 100,
  perPage: 20,
  page: 1,

  // Formik
  values: createFormValues(),
  errors: {},
  setFieldValue: jest.fn(),
  handleSubmit: jest.fn(),
  handleChange: jest.fn(),
  resetForm: jest.fn(),

  intl: intlMock,
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<RangePaginator {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('page input', () => {
    let numericInputWrapper;

    beforeEach(() => {
      numericInputWrapper = wrapper.find(NumberInput);
    });

    it('contains one NumberInput component', () => {
      expect(numericInputWrapper).toHaveLength(1);
    });

    it('should receive `handleChange`', () => {
      expect(numericInputWrapper).toHaveProp(
        'onBlur',
        wrapper.instance().handleBlur
      );
    });

    describe('when next page exceeds total pages', () => {
      beforeEach(() => {
        props = createTestProps({
          totalPages: 2,
          values: createFormValues({ page: 20 }),
          errors: {
            invalidPage: true,
          },
        });
        wrapper = shallow(<RangePaginator {...props} />);
        numericInputWrapper = wrapper.find(NumberInput);
      });

      it('should receive `hasWarning`', () => {
        expect(numericInputWrapper).toHaveProp('hasWarning', true);
      });
    });
  });

  describe('range paginators', () => {
    let backwardsPaginator;
    let forwardsPaginator;

    it('contains two SecondaryIconButton components', () => {
      expect(wrapper).toRenderElementTimes(SecondaryIconButton, 2);
    });

    describe('when on first page', () => {
      beforeEach(() => {
        backwardsPaginator = wrapper.find(SecondaryIconButton).at(0);
        forwardsPaginator = wrapper.find(SecondaryIconButton).at(1);
      });

      it('has the previous page paginator disabled', () => {
        expect(backwardsPaginator).toHaveProp('isDisabled', true);
      });

      it('has the next page paginator enabled', () => {
        expect(forwardsPaginator).toHaveProp('isDisabled', false);
      });
    });

    describe('when on last page', () => {
      beforeEach(() => {
        const paginationValues = {
          page: 2,
          perPage: 20,
          totalItems: 40,
        };
        props = createTestProps({
          ...paginationValues,
          values: createFormValues({ ...paginationValues, totalPages: 2 }),
        });
        wrapper = shallow(<RangePaginator {...props} />);

        backwardsPaginator = wrapper.find(SecondaryIconButton).at(0);
        forwardsPaginator = wrapper.find(SecondaryIconButton).at(1);
      });

      it('has the next page selector disabled', () => {
        expect(forwardsPaginator).toHaveProp('isDisabled', true);
      });

      it('has the previous page selector enabled', () => {
        expect(backwardsPaginator).toHaveProp('isDisabled', false);
      });
    });
  });

  describe('<form>', () => {
    let formWrapper;

    beforeEach(() => {
      formWrapper = wrapper.find('form');
    });

    it('should render a `<form>', () => {
      expect(wrapper).toRender('form');
    });

    it('should receive a `handleSubmit', () => {
      expect(formWrapper).toHaveProp('onSubmit', props.handleSubmit);
    });

    it('should receive a `onKeyDown', () => {
      expect(formWrapper).toHaveProp(
        'onKeyDown',
        wrapper.instance().handleKeyDown
      );
    });
  });
});

describe('interactions', () => {
  let wrapper;
  let props;
  describe('handleKeyDown', () => {
    const createEvent = custom => ({
      preventDefault: jest.fn(),
      keyCode: 13,
      shiftKey: false,

      ...custom,
    });
    let event;

    describe('when key is enter', () => {
      beforeEach(() => {
        event = createEvent();

        props = createTestProps();
        wrapper = shallow(<RangePaginator {...props} />);

        wrapper.instance().handleKeyDown(event);
      });

      it('should invoke `handleSubmit`', () => {
        expect(props.handleSubmit).toHaveBeenCalledWith(event);
      });
    });

    describe('when key is not enter', () => {
      beforeEach(() => {
        event = createEvent({
          keyCode: 14,
        });

        props = createTestProps();
        wrapper = shallow(<RangePaginator {...props} />);

        wrapper.instance().handleKeyDown(event);
      });

      it('should not invoke `handleSubmit`', () => {
        expect(props.handleSubmit).not.toHaveBeenCalled();
      });
    });

    describe('when key is tab', () => {
      beforeEach(() => {
        event = createEvent({
          keyCode: 9,
        });

        props = createTestProps();
        wrapper = shallow(<RangePaginator {...props} />);

        wrapper.instance().handleKeyDown(event);
      });

      it('should not invoke `handleSubmit`', () => {
        expect(props.handleSubmit).toHaveBeenCalledWith(event);
      });
    });
  });

  describe('handleBlur', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<RangePaginator {...props} />);

      wrapper.instance().handleBlur();
    });

    it('should invoke `resetForm`', () => {
      expect(props.resetForm).toHaveBeenCalled();
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;
  let event;

  describe('when clicking the prev page arrow', () => {
    beforeEach(() => {
      const paginationValues = { page: 2, totalItems: 40, perPage: 20 };
      event = { preventDefault: jest.fn() };
      props = createTestProps({
        ...paginationValues,
        values: createFormValues(paginationValues),
      });
      wrapper = shallow(<RangePaginator {...props} />);
      wrapper
        .find(SecondaryIconButton)
        .at(0)
        .prop('onClick')(event);
    });

    it('should call onPageChange with the previous page', () => {
      expect(props.onPageChange).toHaveBeenCalledTimes(1);
      expect(props.onPageChange).toHaveBeenLastCalledWith(1);
    });

    it('should prevent the default event', () => {
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
  });

  describe('when clicking on the next page arrow', () => {
    beforeEach(() => {
      event = { preventDefault: jest.fn() };
      props = createTestProps();
      wrapper = shallow(<RangePaginator {...props} />);
      wrapper
        .find(SecondaryIconButton)
        .at(1)
        .prop('onClick')(event);
    });

    it('should call onPageChange with the next page', () => {
      expect(props.onPageChange).toHaveBeenCalledTimes(1);
      expect(props.onPageChange).toHaveBeenLastCalledWith(2);
    });
  });

  describe('changing the page number in the text field component', () => {
    beforeEach(() => {
      const paginationValues = { page: 1, perPage: 20, totalItems: 40 };
      event = { target: { value: '2' } };
      props = createTestProps({
        ...paginationValues,
        values: createFormValues(paginationValues),
      });
      wrapper = shallow(<RangePaginator {...props} />);
      wrapper.find(NumberInput).simulate('change', event);
    });

    it('should invoke `handleChange`', () => {
      expect(props.handleChange).toHaveBeenCalled();
    });
  });
});
