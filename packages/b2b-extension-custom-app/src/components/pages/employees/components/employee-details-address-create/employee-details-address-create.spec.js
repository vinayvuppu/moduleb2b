import React from 'react';
import { shallow } from 'enzyme';
import EmployeeDetailsAddressCreate from './employee-details-address-create';

const createTestProps = props => ({
  projectKey: 'test-1',
  employeeUpdater: {},
  employeeFetcher: {},
  ...props,
});

describe('rendering', () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<EmployeeDetailsAddressCreate {...props} />);
  });
  it('should pass isCreateMode as true', () => {
    expect(wrapper).toHaveProp('isCreateMode', true);
  });
});
