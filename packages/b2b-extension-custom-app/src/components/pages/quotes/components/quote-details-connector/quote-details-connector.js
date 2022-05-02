import { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import PropTypes from 'prop-types';

import FetchQuote from '../../graphql/FetchQuote.graphql';
import UpdateQuote from '../../graphql/UpdateQuote.graphql';
import AddComment from '../../graphql/AddComment.graphql';

import B2BApolloClientContext from '../../../../common/b2b-apollo-client-context';

export const QuoteDetailsConnector = props => {
  const b2bApolloClientContext = useContext(B2BApolloClientContext.Context);
  const [quote, setQuote] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const { data, loading } = useQuery(FetchQuote, {
    variables: {
      id: props.quoteId,
    },
    fetchPolicy: 'cache-and-network',
    client: b2bApolloClientContext.apolloClient,
  });

  useEffect(() => {
    if (data) {
      setQuote(data.quote);
    }
    setIsLoading(loading);
  }, [data, loading]);

  const [updateQuote] = useMutation(UpdateQuote, {
    client: b2bApolloClientContext.apolloClient,
  });
  const [addComment] = useMutation(AddComment, {
    client: b2bApolloClientContext.apolloClient,
  });

  const handleQuoteState = async state => {
    await updateQuote({
      variables: {
        version: data.quote.version,
        id: data.quote.id,
        actions: [
          {
            changeState: {
              state,
            },
          },
        ],
      },
    });
  };

  const handleUpdateQuoteItems = async lineItems => {
    const response = await updateQuote({
      variables: {
        version: data.quote.version,
        id: data.quote.id,
        actions: lineItems.map(lineItem => ({
          setLineItemPrice: {
            lineItemId: lineItem.id,
            externalPrice: {
              centPrecision: {
                currencyCode: lineItem.price.value.currencyCode,
                centAmount: lineItem.price.value.centAmount,
              },
            },
          },
        })),
      },
    });
    setQuote(response.data.updateQuote);
  };

  const handleAddAmountDiscount = async ({ currencyCode, centAmount }) => {
    const response = await updateQuote({
      variables: {
        version: data.quote.version,
        id: data.quote.id,
        actions: [
          {
            setAmountDiscount: {
              amountDiscount: { currencyCode, centAmount },
            },
          },
        ],
      },
    });
    setQuote(response.data.updateQuote);
  };

  const handleAddPercentageDiscount = async percentage => {
    const response = await updateQuote({
      variables: {
        version: data.quote.version,
        id: data.quote.id,
        actions: [
          {
            setPercentageDiscount: {
              percentage,
            },
          },
        ],
      },
    });
    setQuote(response.data.updateQuote);
  };

  const handleAddComment = async ({ text, email }) => {
    const response = await addComment({
      variables: { text, email, quoteId: quote.id },
    });
    setQuote(response.data.addComment);
  };

  return props.children({
    quote,
    isLoading,
    updateQuoteState: handleQuoteState,
    updateQuoteItems: handleUpdateQuoteItems,
    addAmountDiscount: handleAddAmountDiscount,
    addPercentageDiscount: handleAddPercentageDiscount,
    addComment: handleAddComment,
  });
};

QuoteDetailsConnector.displayName = 'QuoteDetailsConnector';
QuoteDetailsConnector.propTypes = {
  children: PropTypes.func.isRequired,
  projectKey: PropTypes.string.isRequired,
  quoteId: PropTypes.string.isRequired,
};

export default QuoteDetailsConnector;
