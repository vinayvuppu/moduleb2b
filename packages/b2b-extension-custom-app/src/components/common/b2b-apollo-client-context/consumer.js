import React from 'react';
import PropTypes from 'prop-types';
import B2BApolloClientContext from './context';

const B2BApolloClientContextConsumer = props => {
  return (
    <B2BApolloClientContext.Consumer>
      {contextProps => props.children(contextProps)}
    </B2BApolloClientContext.Consumer>
  );
};

B2BApolloClientContextConsumer.displayName = 'B2BApolloClientContextConsumer';
B2BApolloClientContextConsumer.propTypes = {
  children: PropTypes.func.isRequired,
};
export default B2BApolloClientContextConsumer;
