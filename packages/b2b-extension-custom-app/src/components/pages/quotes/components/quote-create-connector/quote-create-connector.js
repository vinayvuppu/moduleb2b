import { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';

import UpdateQuote from '../../graphql/UpdateQuote.graphql';
import CreateQuote from '../../graphql/CreateQuote.graphql';

import B2BApolloClientContext from '../../../../common/b2b-apollo-client-context';

import { QUOTE_TYPES } from '../../constants';

export const QuoteCreateConnector = props => {
  const b2bApolloClientContext = useContext(B2BApolloClientContext.Context);
  const location = useLocation();
  const [quote, setQuote] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [updateQuote] = useMutation(UpdateQuote, {
    client: b2bApolloClientContext.apolloClient,
  });

  const [createQuote] = useMutation(CreateQuote, {
    client: b2bApolloClientContext.apolloClient,
  });

  const handleCreateQuote = async ({
    currency,
    employeeId,
    employeeEmail,
    companyId,
    lineItems,
  }) => {
    if (location.state?.quote) return setQuote(location.state.quote);
    try {
      setIsLoading(true);
      const response = await createQuote({
        variables: {
          draft: {
            currency,
            employeeId,
            employeeEmail,
            companyId,
            lineItems,
          },
        },
      });
      setQuote(response.data.createQuote);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const handleUpdateQuote = async (actions, { id, version } = quote) => {
    try {
      setIsLoading(true);
      const response = await updateQuote({
        variables: {
          version,
          id,
          actions,
        },
      });
      setQuote(response.data.updateQuote);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const handleAddLineItem = async ({ quantity, sku }) =>
    handleUpdateQuote([
      {
        addLineItem: {
          sku,
          quantity,
        },
      },
    ]);

  const handleRemoveLineItem = async ({ lineItemId }) =>
    handleUpdateQuote([
      {
        removeLineItem: {
          lineItemId,
        },
      },
    ]);

  const handleChangeLineItemQuantity = async ({ lineItemId, quantity }) =>
    handleUpdateQuote([
      {
        changeLineItemQuantity: {
          lineItemId,
          quantity,
        },
      },
    ]);

  const handleConvertedQuote = ({ id, version }) => {
    handleUpdateQuote([{ changeState: { state: QUOTE_TYPES.PLACED } }], {
      id,
      version,
    });
  };

  return props.children({
    quote,
    isLoading,
    createQuote: handleCreateQuote,
    addLineItem: handleAddLineItem,
    convertedQuote: handleConvertedQuote,
    removeLineItem: handleRemoveLineItem,
    changeLineItemQuantity: handleChangeLineItemQuantity,
  });
};

QuoteCreateConnector.displayName = 'QuoteCreateConnector';
QuoteCreateConnector.propTypes = {
  children: PropTypes.func.isRequired,
};

export default QuoteCreateConnector;
