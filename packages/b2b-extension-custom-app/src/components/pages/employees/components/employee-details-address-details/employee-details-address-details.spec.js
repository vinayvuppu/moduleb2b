import React from 'react';
import { shallow } from 'enzyme';
import EmployeeDetailsAddressDetails from './employee-details-address-details';

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = {
      employeeUpdater: {},
      employeeFetcher: {},
      employeeDefaultAddressUpdater: {},
      addressId: '123',
      projectKey: 'test-1',
    };
    wrapper = shallow(<EmployeeDetailsAddressDetails {...props} />);
  });
  it('should pass isCreateMode as false', () => {
    expect(wrapper).toHaveProp('isCreateMode', false);
  });
  it('should proxy addressId prop', () => {
    expect(wrapper).toHaveProp('addressId', props.addressId);
  });
});
