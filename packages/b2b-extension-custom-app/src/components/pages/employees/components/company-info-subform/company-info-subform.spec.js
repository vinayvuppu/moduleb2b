import React from 'react';
import { shallow } from 'enzyme';
import { CollapsiblePanel } from '@commercetools-frontend/ui-kit';
import { CompanyInfoSubform } from './company-info-subform';

const createTestProps = props => ({
  formik: {
    values: {
      companyName: '',
      vatId: '',
    },
    handleChange: jest.fn(),
  },
  canManageEmployees: true,
  canManageCustomers: true,

  ...props,
});

describe('rendering base elements', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CompanyInfoSubform {...props} />);
  });

  it('should have a <CollapsiblePanel>', () => {
    expect(wrapper).toRender(CollapsiblePanel);
  });

  it('should render the company name', () => {
    expect(wrapper).toRender({ name: 'companyName' });
  });

  it('should render the VAT Id', () => {
    expect(wrapper).toRender({ name: 'vatId' });
  });
});

describe('when changing', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CompanyInfoSubform {...props} />);
    wrapper.find({ name: 'companyName' }).prop('onChange')({
      target: { name: 'companyName', value: '12345' },
    });
  });

  it('should invoke `handleChange`', () => {
    expect(props.formik.handleChange).toHaveBeenCalled();
  });
});
