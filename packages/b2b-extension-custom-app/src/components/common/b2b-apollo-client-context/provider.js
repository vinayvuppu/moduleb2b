import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

import B2BApolloClientContext from './context';

const B2BApolloClientContextProvider = props => {
  const {
    environment: { graphqlApiUrl },
  } = useApplicationContext();

  const client = useMemo(() => {
    const cache = new InMemoryCache();

    const link = new HttpLink({
      uri: `${graphqlApiUrl}/graphql`,
    });
    return new ApolloClient({
      cache,
      link,
    });
  }, [graphqlApiUrl]);

  return (
    <B2BApolloClientContext.Provider value={{ apolloClient: client }}>
      {props.children}
    </B2BApolloClientContext.Provider>
  );
};

B2BApolloClientContextProvider.displayName = 'B2BApolloClientContextProvider';
B2BApolloClientContextProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
export default B2BApolloClientContextProvider;
