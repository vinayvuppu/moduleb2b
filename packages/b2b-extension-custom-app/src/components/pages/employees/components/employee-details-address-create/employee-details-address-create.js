import React from 'react';
import PropTypes from 'prop-types';
import AddressDetailsModal from '../address-details-modal';

const EmployeeDetailsAddressCreate = props => (
  <AddressDetailsModal
    isCreateMode={true}
    projectKey={props.projectKey}
    employeeUpdater={props.employeeUpdater}
    employeeFetcher={props.employeeFetcher}
  />
);
EmployeeDetailsAddressCreate.displayName = 'EmployeeDetailsAddressCreate';
EmployeeDetailsAddressCreate.propTypes = {
  employeeUpdater: PropTypes.object.isRequired,
  employeeFetcher: PropTypes.object.isRequired,
  projectKey: PropTypes.string.isRequired,
};
export default EmployeeDetailsAddressCreate;
