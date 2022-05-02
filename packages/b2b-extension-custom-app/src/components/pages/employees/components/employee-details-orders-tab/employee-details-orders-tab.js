import React from 'react';
import PropTypes from 'prop-types';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import OrdersList from '../orders-list';

const EmployeeDetailsOrdersTab = props => (
  <OrdersList
    employeeId={props.match.params.id}
    projectKey={props.match.params.projectKey}
    goToOrderDetails={orderId =>
      props.history.push(oneLineTrim`
        /${props.match.params.projectKey}
        /orders
        /${orderId}
      `)
    }
  />
);
EmployeeDetailsOrdersTab.displayName = 'EmployeeDetailsOrdersTab';
EmployeeDetailsOrdersTab.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      projectKey: PropTypes.string.isRequired,
    }).isRequired,
  }),
};
export default EmployeeDetailsOrdersTab;
