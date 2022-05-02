import React from 'react';
import { shallow } from 'enzyme';
import CustomAttributes from '@commercetools-local/core/components/type-definitions/custom-attributes';
import { EmployeeDetailsCustomFieldsSubForm } from './employee-details-custom-fields-subform';

const createFormikProps = custom => ({
  handleChange: jest.fn().mockName('handleChange'),
  handleBlur: jest.fn().mockName('handleBlur'),
  setFieldTouched: jest.fn().mockName('setFieldTouched'),
  setFieldValue: jest.fn().mockName('setFieldValue'),
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
  errors: {},
  touched: {},
  ...custom,
});

const createTestProps = props => ({
  typeDefinitions: [
    {
      type: { key: 'foo', name: { en: 'Foo' } },
    },
  ],
  projectKey: 'test',
  canManageEmployees: true,
  language: 'en',
  languages: ['en', 'de'],
  currencies: ['EUR'],
  formik: createFormikProps(),
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<EmployeeDetailsCustomFieldsSubForm {...props} />);
  });

  it('should render <CustomAttributes>', () => {
    expect(wrapper).toRender(CustomAttributes);
  });

  describe('when the type is not defined', () => {
    beforeEach(() => {
      props = createTestProps({
        formik: createFormikProps({
          values: {
            custom: {
              type: {
                fieldDefinitions: [],
              },
              fields: {},
            },
          },
        }),
      });
      wrapper = shallow(<EmployeeDetailsCustomFieldsSubForm {...props} />);
    });

    it('should not render a <CustomAttributes>', () => {
      expect(wrapper).not.toRender(CustomAttributes);
    });

    it('should show message with no custom type selected', () => {
      expect(wrapper).toRender({
        id: 'Employees.Details.EmployeeCustomFields.noCustomType',
      });
    });
  });

  describe('when there are no `fieldDefinitions` in the type', () => {
    beforeEach(() => {
      props = createTestProps({
        formik: createFormikProps({
          values: {
            custom: {
              type: {
                key: 'test-key',
                fieldDefinitions: [],
              },
              fields: {},
            },
          },
        }),
      });
      wrapper = shallow(<EmployeeDetailsCustomFieldsSubForm {...props} />);
    });

    it('should not render a <CustomAttributes>', () => {
      expect(wrapper).not.toRender(CustomAttributes);
    });

    it('should show message with no custom fields defined', () => {
      expect(wrapper).toRender({
        id: 'Employees.Details.EmployeeCustomFields.noCustomFields',
      });
    });
  });

  describe('when there are no `typeDefinitions`', () => {
    beforeEach(() => {
      props = createTestProps({ typeDefinitions: [] });
      wrapper = shallow(<EmployeeDetailsCustomFieldsSubForm {...props} />);
    });

    it('should not render a <CustomAttributes>', () => {
      expect(wrapper).not.toRender(CustomAttributes);
    });

    it('should show message with no type definitions defined', () => {
      expect(wrapper).toRender({
        id: 'Employees.Details.EmployeeCustomFields.noTypes',
      });
    });
  });
});

describe('interactions', () => {
  let props;
  let wrapper;

  describe('when changing', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<EmployeeDetailsCustomFieldsSubForm {...props} />);
      wrapper.instance().handleChange('foo', 'bar');
    });

    it('should invoke `setFieldTouched`', () => {
      expect(props.formik.setFieldTouched).toHaveBeenCalled();
    });
    it('should invoke `setFieldValue`', () => {
      expect(props.formik.setFieldValue).toHaveBeenCalled();
    });
  });

  describe('when updating settings', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<EmployeeDetailsCustomFieldsSubForm {...props} />);
      wrapper.instance().handleUpdateExpandSettings(true, {
        name: 'field-name',
      });
    });

    it('should update the state with the expanded attribute', () => {
      expect(wrapper).toHaveState(
        'expandSettings',
        expect.objectContaining({
          'field-name': true,
        })
      );
    });
  });
});
