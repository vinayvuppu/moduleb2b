import React from 'react';
import PropTypes from 'prop-types';
import EmployeeDetailsCustomFieldsForm from '../employee-details-custom-fields-form';

const EmployeeDetailsCustomFieldsTab = props => (
  <EmployeeDetailsCustomFieldsForm
    projectKey={props.projectKey}
    employeeId={props.employeeId}
    employeeFetcher={props.employeeFetcher}
    employeeUpdater={props.employeeUpdater}
  />
);
EmployeeDetailsCustomFieldsTab.displayName = 'EmployeeDetailsCustomFieldsTab';
EmployeeDetailsCustomFieldsTab.propTypes = {
  employeeFetcher: PropTypes.object.isRequired,
  employeeUpdater: PropTypes.object.isRequired,
  projectKey: PropTypes.string.isRequired,
  employeeId: PropTypes.string.isRequired,
  children: PropTypes.element,
};
export default EmployeeDetailsCustomFieldsTab;
