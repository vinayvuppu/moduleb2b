import React from 'react';
import { shallow } from 'enzyme';
import WarningSaveToolbar from '@commercetools-local/core/components/warning-save-toolbar';
import { CompanyForm } from './company-form';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(() => 'formatted message'),
    })),
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
        name: 'foo-name',
        logo: '',
        addresses: [],
        requiredApprovalRoles: [],
      },
    })),
  };
});

const createTestProps = props => ({
  onSubmit: jest.fn(() => Promise.resolve('test')),
  onCancel: jest.fn(),
  initialValues: {},
  handleSubmit: jest.fn(),
  isAuthorized: true,
  locale: 'en',
  currencies: [],
  ...props,
});

describe('defaultProps', () => {
  it('should have `isSaveToolbarAlwaysVisible` prop to false', () => {
    expect(CompanyForm.defaultProps.isSaveToolbarAlwaysVisible).toBe(false);
  });
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CompanyForm {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('WarningSaveToolbar', () => {
    it('should render WarningSaveToolbar', () => {
      expect(wrapper).toRender(WarningSaveToolbar);
    });

    it('should receive `onSave`', () => {
      expect(wrapper.find(WarningSaveToolbar).props()).toEqual(
        expect.objectContaining({
          onSave: expect.any(Function),
        })
      );
    });

    it('should receive `onCancel`', () => {
      expect(wrapper.find(WarningSaveToolbar).props()).toEqual(
        expect.objectContaining({
          onCancel: expect.any(Function),
        })
      );
    });

    describe('when not authorized', () => {
      beforeEach(() => {
        props = createTestProps({
          isAuthorized: false,
        });
        wrapper = shallow(<CompanyForm {...props} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;

  describe('form', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<CompanyForm {...props} />);
    });

    describe('`onSubmit`', () => {
      beforeEach(async () => {
        await wrapper.find('form').prop('onSubmit')();
      });

      it('should invoke `onSubmit`', () => {
        expect(props.onSubmit).toHaveBeenCalled();
      });
    });

    describe('<WarningSaveToolbar', () => {
      beforeEach(() => {
        wrapper.find(WarningSaveToolbar).prop('onCancel')();
      });

      it('should invoke `onCancel`', () => {
        expect(props.onCancel).toHaveBeenCalled();
      });
    });
  });
});
