import React from 'react';
import PropTypes from 'prop-types';

const OrderCreateOwner = props => (
  <React.Fragment>
    {props.children}
    {props.renderSaveToolbarStep()}
  </React.Fragment>
);

OrderCreateOwner.displayName = 'OrderCreateOwner';
OrderCreateOwner.propTypes = {
  children: PropTypes.node.isRequired,
  renderSaveToolbarStep: PropTypes.func.isRequired,
};

export default OrderCreateOwner;
