import React from 'react';
import { shallow } from 'enzyme';
import PredicateModalForm from './predicate-modal-form';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(() => 'formatted message'),
    })),
  };
});

jest.mock('@commercetools-frontend/permissions', () => {
  const actual = jest.requireActual('@commercetools-frontend/permissions');
  return {
    ...actual,
    useIsAuthorized: jest.fn(() => true),
  };
});

jest.mock('formik', () => {
  const actual = jest.requireActual('formik');
  return {
    ...actual,
    useFormik: jest.fn(data => ({
      setFieldValue: jest.fn(),
      handleSubmit: data.onSubmit,
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      handleReset: jest.fn(),
      isSubmitting: false,
      touched: {},
      errors: {},
      values: {
        name: '',
        value: '',
      },
    })),
  };
});

const createTestProps = props => ({
  isOpen: true,
  close: jest.fn(),
  handleRemove: jest.fn(),
  handleSubmit: jest.fn(),
  initialValues: {
    name: '',
    value: '',
  },
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<PredicateModalForm {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
