import React from 'react';
import PropTypes from 'prop-types';
import AddressesList from '../addresses-list';

const EmployeeDetailsAddressesTab = props => (
  <AddressesList
    employeeFetcher={props.employeeFetcher}
    addressListPath={props.match.url}
    goToAddressDetails={addressId =>
      props.history.push(`${props.match.url}/${addressId}`)
    }
    goToAddressNew={() => props.history.push(`${props.match.url}/new`)}
  >
    {props.children}
  </AddressesList>
);
EmployeeDetailsAddressesTab.displayName = 'EmployeeDetailsAddressesTab';
EmployeeDetailsAddressesTab.propTypes = {
  employeeFetcher: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      addressId: PropTypes.string,
    }).isRequired,
  }),
  children: PropTypes.element,
};
export default EmployeeDetailsAddressesTab;
