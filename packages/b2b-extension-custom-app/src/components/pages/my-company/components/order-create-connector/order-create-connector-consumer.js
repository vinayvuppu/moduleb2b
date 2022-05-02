import React from 'react';
import PropTypes from 'prop-types';
import OrderCreateConnectorContext from './order-create-connector-context';

export class OrderCreateConnectorConsumer extends React.Component {
  static displayName = 'OrderCreateConnectorConsumer';
  static propTypes = {
    children: PropTypes.func.isRequired,
  };
  render() {
    return (
      <OrderCreateConnectorContext.Consumer>
        {contextProps => this.props.children(contextProps)}
      </OrderCreateConnectorContext.Consumer>
    );
  }
}

export default OrderCreateConnectorConsumer;
