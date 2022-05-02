import React from 'react';
import { shallow } from 'enzyme';
import { DOMAINS } from '@commercetools-frontend/constants';
import CompanyForm from '../company-form';
import { CompanyCreate } from './company-create';

jest.mock('@commercetools-frontend/application-shell-connectors', () => {
  const actual = jest.requireActual(
    '@commercetools-frontend/application-shell-connectors'
  );
  return {
    ...actual,
    useApplicationContext: () => ({
      environment: { apiUrl: 'url' },
    }),
  };
});

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(() => 'formatted message'),
    })),
  };
});
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: jest.fn(() => ({
      projectKey: 'test-1',
    })),
    useHistory: jest.fn(() => ({ push: jest.fn() })),
  };
});
jest.mock('../../api', () => {
  return {
    // eslint-disable-next-line
    createCompany: jest.fn(({ url, payload }) => {
      if (payload.name === 'ok') {
        return Promise.resolve({
          id: 'id-1',
          name: 'ok',
          logo: '',
          channels: [],
          addresses: [],
          requiredApprovalRoles: [],
        });
      }
      return Promise.reject({ errors: [{ title: 'error1' }] });
    }),
  };
});

const createTestProps = props => ({
  // connected
  showNotification: jest.fn(),
  hideAllPageNotifications: jest.fn(),
  ...props,
});

const createCompany = data => ({
  name: 'ok',
  logo: '',
  channels: [],
  addresses: [],
  requiredApprovalRoles: [],
  ...data,
});

const createFormikBag = custom => ({
  setErrors: jest.fn(),
  setSubmitting: jest.fn(),
  resetForm: jest.fn(),
  ...custom,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CompanyCreate {...props} />);
  });

  describe('rendering base elements', () => {
    it('should render data-track-component', () => {
      expect(wrapper).toRender({
        'data-track-component': 'CompanyCreate',
      });
    });
    it('should render ViewHeader', () => {
      expect(wrapper).toRender('ViewHeader');
    });
    it('should render TabContainer', () => {
      expect(wrapper).toRender('TabContainer');
    });

    describe('CompanyForm', () => {
      it('should render CompanyForm', () => {
        expect(wrapper).toRender(CompanyForm);
      });

      describe('should have configuration props', () => {
        it('should have `initialValues` prop', () => {
          expect(wrapper.find(CompanyForm)).toHaveProp('initialValues', {
            name: '',
            logo: '',
            channels: [],
            addresses: [],
            requiredApprovalRoles: [],
          });
        });
        it('should have `isSaveToolbarAlwaysVisible` prop', () => {
          expect(wrapper.find(CompanyForm)).toHaveProp(
            'isSaveToolbarAlwaysVisible',
            false
          );
        });
        it('should have `onSubmit` prop', () => {
          expect(wrapper.find(CompanyForm)).toHaveProp(
            'onSubmit',
            expect.any(Function)
          );
        });
        it('should have `onCancel` prop', () => {
          expect(wrapper.find(CompanyForm)).toHaveProp(
            'onCancel',
            expect.any(Function)
          );
        });
      });
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;
  let renderedForm;
  let formikBag;

  describe('handleSubmit', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<CompanyCreate {...props} />);
      formikBag = createFormikBag();
      renderedForm = wrapper;

      return renderedForm.find(CompanyForm).prop('onSubmit')(
        createCompany({ payload: { name: 'ok' } }),
        formikBag
      );
    });

    it('should call the hideAllPageNotifications function', () => {
      expect(props.hideAllPageNotifications).toHaveBeenCalledTimes(1);
    });

    describe('when resolving', () => {
      it('should call setSubmitting', () => {
        expect(formikBag.setSubmitting).toHaveBeenCalledWith(false);
      });

      it('should call resetForm', () => {
        expect(formikBag.resetForm).toHaveBeenCalled();
      });

      it('to invoke showNotification', () => {
        expect(props.showNotification).toHaveBeenCalledTimes(1);
      });
      it('to invoke showNotification with notification details', () => {
        expect(props.showNotification).toHaveBeenCalledWith({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: expect.any(String),
        });
      });
    });

    describe('when rejecting', () => {
      beforeEach(async () => {
        props = createTestProps();

        formikBag = createFormikBag();
        wrapper = shallow(<CompanyCreate {...props} />);
        renderedForm = wrapper;
        await renderedForm.find(CompanyForm).prop('onSubmit')(
          createCompany({ name: 'fail' }),
          formikBag
        );
      });

      it('should call setSubmitting', () => {
        expect(formikBag.setSubmitting).toHaveBeenCalledWith(false);
      });

      it('should call showNotification with the errors', () => {
        expect(props.showNotification).toHaveBeenCalledWith({
          domain: 'side',
          kind: 'error',
          text: 'error1',
        });
      });
    });
  });
});
