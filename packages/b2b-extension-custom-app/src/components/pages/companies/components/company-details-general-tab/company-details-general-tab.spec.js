import React from 'react';
import { shallow } from 'enzyme';
import { DOMAINS } from '@commercetools-frontend/constants';

import { intlMock } from '@commercetools-local/test-utils';
import { CompanyDetailsGeneralTab } from './company-details-general-tab';
import CompanyForm from '../company-form';

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
  companyDefaultShippingUpdater: {
    execute: jest.fn(() => Promise.resolve(createCompany())),
  },
  companyDefaultBillingUpdater: {
    execute: jest.fn(() => Promise.resolve(createCompany())),
  },

  // injectIntl
  intl: intlMock,
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
      wrapper = shallow(<CompanyDetailsGeneralTab {...props} />);
    });

    it('should render `<CompanyForm>`', () => {
      expect(wrapper).toRender(CompanyForm);
    });
  });

  describe('callbacks', () => {
    describe('when updating a company', () => {
      let formikBag;
      beforeEach(async () => {
        props = createTestProps();
        wrapper = shallow(<CompanyDetailsGeneralTab {...props} />);
        formikBag = {
          setSubmitting: jest.fn(),
          setErrors: jest.fn(),
        };
        await wrapper.find(CompanyForm).prop('onSubmit')(
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
          text: 'Company.Details.GeneralTabl.companyUpdated',
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
          wrapper = shallow(<CompanyDetailsGeneralTab {...props} />);
          formikBag = {
            setSubmitting: jest.fn(),
            setErrors: jest.fn(),
          };
          await wrapper.find(CompanyForm).prop('onSubmit')(
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
    describe('when updating default shipping address', () => {
      beforeEach(async () => {
        props = createTestProps();
        wrapper = shallow(<CompanyDetailsGeneralTab {...props} />);
        await wrapper.find(CompanyForm).prop('onSetDefaultShippingAddress')(
          'address-id-1'
        );
      });
      it('should call the hideAllPageNotifications function', () => {
        expect(props.hideAllPageNotifications).toHaveBeenCalledTimes(1);
      });

      it('should call companyDefaultShippingUpdater', () => {
        expect(
          props.companyDefaultShippingUpdater.execute
        ).toHaveBeenCalledWith('address-id-1');
      });
      it('should show notification', () => {
        expect(props.showNotification).toHaveBeenCalledTimes(1);
        expect(props.showNotification).toHaveBeenLastCalledWith({
          kind: 'success',
          text: 'Company.Details.GeneralTabl.companyUpdated',
          domain: DOMAINS.SIDE,
        });
      });

      describe('when rejecting', () => {
        beforeEach(async () => {
          props = createTestProps({
            companyDefaultShippingUpdater: {
              execute: jest.fn(() =>
                Promise.reject({ errors: [{ title: 'error1' }] })
              ),
            },
          });
          wrapper = shallow(<CompanyDetailsGeneralTab {...props} />);

          await wrapper.find(CompanyForm).prop('onSetDefaultShippingAddress')(
            'address-id-1'
          );
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
    describe('when updating default billing address', () => {
      beforeEach(async () => {
        props = createTestProps();
        wrapper = shallow(<CompanyDetailsGeneralTab {...props} />);
        await wrapper.find(CompanyForm).prop('onSetDefaultBillingAddress')(
          'address-id-1'
        );
      });
      it('should call the hideAllPageNotifications function', () => {
        expect(props.hideAllPageNotifications).toHaveBeenCalledTimes(1);
      });

      it('should call companyDefaultBillingUpdater', () => {
        expect(props.companyDefaultBillingUpdater.execute).toHaveBeenCalledWith(
          'address-id-1'
        );
      });
      it('should show notification', () => {
        expect(props.showNotification).toHaveBeenCalledTimes(1);
        expect(props.showNotification).toHaveBeenLastCalledWith({
          kind: 'success',
          text: 'Company.Details.GeneralTabl.companyUpdated',
          domain: DOMAINS.SIDE,
        });
      });

      describe('when rejecting', () => {
        beforeEach(async () => {
          props = createTestProps({
            companyDefaultBillingUpdater: {
              execute: jest.fn(() =>
                Promise.reject({ errors: [{ title: 'error1' }] })
              ),
            },
          });
          wrapper = shallow(<CompanyDetailsGeneralTab {...props} />);

          await wrapper.find(CompanyForm).prop('onSetDefaultBillingAddress')(
            'address-id-1'
          );
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
