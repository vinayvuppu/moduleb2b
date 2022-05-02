import React from 'react';
import PropTypes from 'prop-types';
import AddressDetailsModal from '../address-details-modal';

const EmployeeDetailsAddressDetails = props => (
  <AddressDetailsModal
    isCreateMode={false}
    addressId={props.addressId}
    projectKey={props.projectKey}
    employeeUpdater={props.employeeUpdater}
    employeeFetcher={props.employeeFetcher}
    employeeDefaultAddressUpdater={props.employeeDefaultAddressUpdater}
  />
);
EmployeeDetailsAddressDetails.displayName = 'EmployeeDetailsAddressDetails';
EmployeeDetailsAddressDetails.propTypes = {
  employeeUpdater: PropTypes.object.isRequired,
  employeeFetcher: PropTypes.object.isRequired,
  employeeDefaultAddressUpdater: PropTypes.object.isRequired,
  addressId: PropTypes.string.isRequired,
  projectKey: PropTypes.string.isRequired,
};
export default EmployeeDetailsAddressDetails;
