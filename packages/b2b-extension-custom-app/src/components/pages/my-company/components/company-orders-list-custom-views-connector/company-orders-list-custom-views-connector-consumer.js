import React from 'react';
import PropTypes from 'prop-types';
import CompanyOrdersListCustomViewsConnectorContext from './company-orders-list-custom-views-connector-context';

export class CompanyOrdersListCustomViewsConnectorConsumer extends React.Component {
  static displayName = 'CompanyOrdersListCustomViewsConnectorConsumer';
  static propTypes = {
    children: PropTypes.func.isRequired,
  };
  render() {
    return (
      <CompanyOrdersListCustomViewsConnectorContext.Consumer>
        {contextProps => this.props.children(contextProps)}
      </CompanyOrdersListCustomViewsConnectorContext.Consumer>
    );
  }
}

export default CompanyOrdersListCustomViewsConnectorConsumer;
