import React from 'react';
import { shallow } from 'enzyme';
import WarningSaveToolbar from '@commercetools-local/core/components/warning-save-toolbar';
import { CompanyRulesForm } from './company-rules-form';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(() => 'formatted message'),
    })),
  };
});

jest.mock('@commercetools-frontend/application-shell-connectors', () => ({
  useApplicationContext: () => ({
    currencies: ['USD'],
  }),
}));

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
        name: 'foo-name',
        logo: '',
        budget: [],
        addresses: [],
        requiredApprovalRoles: [],
        approverRoles: [],
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
  showNotification: jest.fn(),
  hideAllPageNotifications: jest.fn(),
  ...props,
});

describe('defaultProps', () => {
  it('should have `isSaveToolbarAlwaysVisible` prop to false', () => {
    expect(CompanyRulesForm.defaultProps.isSaveToolbarAlwaysVisible).toBe(
      false
    );
  });
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CompanyRulesForm {...props} />);
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
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;

  describe('form', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<CompanyRulesForm {...props} />);
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
