import React from 'react';
import PropTypes from 'prop-types';
import EmployeesListCustomViewsConnectorContext from './employees-list-custom-views-connector-context';

export class EmployeesListCustomViewsConnectorConsumer extends React.Component {
  static displayName = 'EmployeesListCustomViewsConnectorConsumer';
  static propTypes = {
    children: PropTypes.func.isRequired,
  };
  render() {
    return (
      <EmployeesListCustomViewsConnectorContext.Consumer>
        {contextProps => this.props.children(contextProps)}
      </EmployeesListCustomViewsConnectorContext.Consumer>
    );
  }
}

export default EmployeesListCustomViewsConnectorConsumer;
