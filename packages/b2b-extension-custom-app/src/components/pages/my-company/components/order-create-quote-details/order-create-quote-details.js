import React from 'react';
import PropTypes from 'prop-types';
import { Spacings, Text } from '@commercetools-frontend/ui-kit';
import OrderCreateItemsTable from '../order-create-items-table/order-create-items-table';
import messages from './messages';

const OrderCreateQuoteDetails = ({ renderSaveToolbarStep }) => {
  return (
    <Spacings.Stack>
      <Text.Headline as="h2" intlMessage={messages.title} />
      <OrderCreateItemsTable omitColumns={['taxRate']} />
      {renderSaveToolbarStep()}
    </Spacings.Stack>
  );
};

OrderCreateQuoteDetails.propTypes = {
  renderSaveToolbarStep: PropTypes.func.isRequired,
};

OrderCreateQuoteDetails.displayName = 'OrderCreateQuoteDetails';

export default OrderCreateQuoteDetails;
