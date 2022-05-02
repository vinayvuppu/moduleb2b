import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';
import { intlMock } from '@commercetools-local/test-utils';
import WarningSaveToolbar from '@commercetools-local/core/components/warning-save-toolbar';
import ReadOnlyMessage from '@commercetools-local/core/components/read-only-message';
import CustomFieldTypeDefinitionsConnector from '@commercetools-local/core/components/custom-field-type-definitions-connector';
import {
  EmployeeDetailsCustomFieldsForm,
  CustomFieldsErrorTextNotification,
} from './employee-details-custom-fields-form';

const createTestProps = props => ({
  projectKey: 'test-project',
  language: 'en',
  employeeFetcher: {
    isLoading: false,
    employee: {
      createdAt: '2016-05-11T15:38:02.023Z',
      lastModifiedAt: '2016-05-11T15:38:02.023Z',
      custom: {
        fields: {
          stark: 'Eddard',
          targaryen: true,
          lannister: {
            centAmount: 1000,
            currencyCode: 'USD',
          },
        },
        type: {
          obj: {
            name: {
              en: 'type name',
            },
            fieldDefinitions: [
              { name: 'stark' },
              { name: 'targaryen' },
              { name: 'lannister' },
            ],
          },
        },
      },
    },
  },
  employeeUpdater: {
    isLoading: false,
    execute: jest.fn(() => Promise.resolve()),
  },

  // Actions
  showNotification: jest.fn(),
  onActionError: jest.fn(),

  // HoC
  intl: intlMock,
  canManageEmployees: true,
  languages: ['de'],
  ...props,
});

const createFormikProps = props => ({
  values: {
    custom: {
      type: {
        key: 'test-key',
        fieldDefinitions: [
          {
            label: { en: 'test' },
            required: false,
            type: { name: 'String' },
          },
        ],
      },
      fields: {},
    },
  },
  dirty: false,
  setFieldValue: jest.fn(),
  setFieldTouched: jest.fn(),
  handleSubmit: jest.fn(),
  handleReset: jest.fn(),
  isValid: true,
  isSubmitting: false,
  touched: {},
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  ...props,
});

const createTypesConnectorRenderProps = custom => ({
  customFieldTypeDefinitionsFetcher: {
    customFieldTypeDefinitions: {},
    isLoading: false,
  },
  ...custom,
});

const createFormikBag = custom => ({
  setSubmitting: jest.fn(),
  ...custom,
});

describe('rendering', () => {
  let props;
  let wrapper;

  describe('TabContentLayout', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<EmployeeDetailsCustomFieldsForm {...props} />);
    });
    it('should render a TabContentLayout', () => {
      expect(wrapper).toRender('TabContentLayout');
    });
    describe('header', () => {
      let metaDatesWrapper;
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<EmployeeDetailsCustomFieldsForm {...props} />);
        metaDatesWrapper = shallow(
          wrapper.find('TabContentLayout').prop('header')
        );
      });
      it('should render MetaDates', () => {
        expect(metaDatesWrapper).toRender('MetaDates');
      });
      it('should have `created` prop', () => {
        expect(metaDatesWrapper).toHaveProp(
          'created',
          props.employeeFetcher.employee.createdAt
        );
      });
      it('should have `modified` prop', () => {
        expect(metaDatesWrapper).toHaveProp(
          'modified',
          props.employeeFetcher.employee.lastModifiedAt
        );
      });
    });
    describe('description', () => {
      let descriptionWrapper;
      describe('without permissions', () => {
        beforeEach(() => {
          props = createTestProps({ canManageEmployees: false });
          wrapper = shallow(<EmployeeDetailsCustomFieldsForm {...props} />);
          descriptionWrapper = shallow(
            <div>{wrapper.find('TabContentLayout').prop('description')}</div>
          );
        });
        it('should render ReadOnlyMessage', () => {
          expect(descriptionWrapper).toRender(ReadOnlyMessage);
        });
      });
    });
    describe('WarningSaveToolbar', () => {
      let formikProps;
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<EmployeeDetailsCustomFieldsForm {...props} />);
        formikProps = createFormikProps();
        wrapper = wrapper
          .find(Formik)
          .renderProp('render')(formikProps)
          .find(CustomFieldTypeDefinitionsConnector)
          .renderProp('children')(createTypesConnectorRenderProps());
      });
      it('should render WarningSaveToolbar', () => {
        expect(wrapper).toRender(WarningSaveToolbar);
      });
      describe('props', () => {
        it('should have `onSave` prop', () => {
          expect(wrapper.find(WarningSaveToolbar)).toHaveProp(
            'onSave',
            formikProps.handleSubmit
          );
        });
        it('should have `onCancel` prop', () => {
          expect(wrapper.find(WarningSaveToolbar)).toHaveProp(
            'onCancel',
            formikProps.handleReset
          );
        });
        it('should have `shouldWarnOnLeave` prop', () => {
          expect(wrapper.find(WarningSaveToolbar)).toHaveProp(
            'shouldWarnOnLeave',
            false
          );
        });
        it('should have `isToolbarVisible` prop', () => {
          expect(wrapper.find(WarningSaveToolbar)).toHaveProp(
            'isToolbarVisible',
            false
          );
        });
        it('should have `isToolbarDisabled` prop', () => {
          expect(wrapper.find(WarningSaveToolbar)).toHaveProp(
            'isToolbarDisabled',
            false
          );
        });
      });
    });
  });
});

describe('interactions', () => {
  let props;
  let wrapper;
  let formikBag;

  describe('handleSubmit', () => {
    describe('when resolving', () => {
      beforeEach(async () => {
        const values = createFormikProps().values;
        props = createTestProps();
        wrapper = shallow(<EmployeeDetailsCustomFieldsForm {...props} />);
        formikBag = createFormikBag();
        await wrapper.instance().handleSubmit(values, formikBag);
      });

      it('should call `execute` from `employeeUpdater`', () => {
        expect(props.employeeUpdater.execute).toHaveBeenCalledTimes(1);
      });
      it('should call setSubmitting', () => {
        expect(formikBag.setSubmitting).toHaveBeenCalledTimes(1);
      });
      it('should call showNotification', () => {
        expect(props.showNotification).toHaveBeenCalledTimes(1);
      });
    });
    describe('when rejecting', () => {
      let errors;
      describe('when there are formErrors', () => {
        beforeEach(async () => {
          const values = createFormikProps().values;
          errors = [
            {
              code: 'RequiredField',
              field: 'custom-field-1',
              action: { action: 'setCustomType' },
            },
          ];
          props = createTestProps({
            employeeUpdater: {
              isLoading: false,
              execute: jest.fn(() => Promise.reject(errors)),
            },
          });
          wrapper = shallow(<EmployeeDetailsCustomFieldsForm {...props} />);
          formikBag = createFormikBag();
          await wrapper.instance().handleSubmit(values, formikBag);
        });

        it('should call showNotification with error', () => {
          expect(props.showNotification).toHaveBeenCalledWith(
            expect.objectContaining({
              kind: 'error',
            })
          );
        });
        it('should call showNotification with error text component', () => {
          expect(props.showNotification).toHaveBeenCalledWith(
            expect.objectContaining({
              text: <CustomFieldsErrorTextNotification formErrors={errors} />,
            })
          );
        });
      });
      describe('when there are unmappedApiErrors', () => {
        beforeEach(async () => {
          const values = createFormikProps().values;
          errors = [
            {
              code: 'DuplicatedField',
              action: { action: 'setCustomType' },
            },
          ];
          props = createTestProps({
            employeeUpdater: {
              isLoading: false,
              execute: jest.fn(() => Promise.reject(errors)),
            },
          });
          wrapper = shallow(<EmployeeDetailsCustomFieldsForm {...props} />);
          formikBag = createFormikBag();
          await wrapper.instance().handleSubmit(values, formikBag);
        });

        it('should call showNotification with error', () => {
          expect(props.onActionError).toHaveBeenCalled();
        });
      });
    });
  });
});
