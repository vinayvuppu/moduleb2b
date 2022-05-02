import React from 'react';
import { shallow } from 'enzyme';
import { DOMAINS } from '@commercetools-frontend/constants';

import { CompanyDetailsRulesTab } from './company-details-rules-tab';
import CompanyRulesForm from '../company-rules-form';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(() => 'formatted message'),
      locale: 'en',
    })),
  };
});
const createCompany = custom => ({
  id: 'cg-id-1',
  name: 'ok',
  logo: 'logo-1',
  channels: [],
  defaultShippingAddress: 'address-id-1',
  defaultBillingAddress: 'address-id-1',
  addresses: [{ id: 'address-id-1' }],
  requiredApprovalRoles: ['role1'],
  ...custom,
});

const createCompanyFetcher = custom => ({
  isLoading: false,
  company: createCompany(),
  ...custom,
});

const createTestProps = customProps => ({
  companyFetcher: createCompanyFetcher(),
  companyUpdater: {
    isLoading: false,
    execute: jest.fn(() => Promise.resolve(createCompany())),
  },
  // connect
  showNotification: jest.fn(),
  hideAllPageNotifications: jest.fn(),
  ...customProps,
});

describe('rendering', () => {
  let props;
  let wrapper;

  describe('rendering base elements', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<CompanyDetailsRulesTab {...props} />);
    });

    it('should render `<CompanyRulesForm>`', () => {
      expect(wrapper).toRender(CompanyRulesForm);
    });
  });

  describe('callbacks', () => {
    describe('when updating a company', () => {
      let formikBag;
      beforeEach(async () => {
        props = createTestProps();
        wrapper = shallow(<CompanyDetailsRulesTab {...props} />);
        formikBag = {
          setSubmitting: jest.fn(),
          setErrors: jest.fn(),
        };
        await wrapper.find(CompanyRulesForm).prop('onSubmit')(
          createCompany(),
          formikBag
        );
      });
      it('should call the hideAllPageNotifications function', () => {
        expect(props.hideAllPageNotifications).toHaveBeenCalledTimes(1);
      });

      it('should call updateCompany', () => {
        expect(props.companyUpdater.execute).toHaveBeenCalledWith({
          addresses: [{ id: 'address-id-1' }],
          channels: [],
          id: 'cg-id-1',
          logo: 'logo-1',
          name: 'ok',
          defaultShippingAddress: 'address-id-1',
          defaultBillingAddress: 'address-id-1',
          requiredApprovalRoles: ['role1'],
        });
      });
      it('should show notification', () => {
        expect(props.showNotification).toHaveBeenCalledTimes(1);
        expect(props.showNotification).toHaveBeenLastCalledWith({
          kind: 'success',
          text: expect.any(String),
          domain: DOMAINS.SIDE,
        });
      });
      it('should unset submission status', () => {
        expect(formikBag.setSubmitting).toHaveBeenCalledWith(false);
      });

      describe('when rejecting', () => {
        beforeEach(async () => {
          props = createTestProps({
            companyUpdater: {
              isLoading: false,
              execute: jest.fn(() =>
                Promise.reject({ errors: [{ title: 'error1' }] })
              ),
            },
          });
          wrapper = shallow(<CompanyDetailsRulesTab {...props} />);
          formikBag = {
            setSubmitting: jest.fn(),
            setErrors: jest.fn(),
          };
          await wrapper.find(CompanyRulesForm).prop('onSubmit')(
            createCompany(),
            formikBag
          );
        });
        it('should unset submission status', () => {
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
});
