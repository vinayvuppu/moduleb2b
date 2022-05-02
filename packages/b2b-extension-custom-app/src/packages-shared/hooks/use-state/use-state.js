import { useQuery } from 'react-apollo';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { FetchStatesQuery } from './state-connector.graphql';

export const createStateFetcherQueryVariables = ownProps => ({
  target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
  where: `key="${ownProps.stateKey}"`,
});

export const useStateFetcher = props => {
  const { data, refetch, loading } = useQuery(FetchStatesQuery, {
    variables: createStateFetcherQueryVariables(props),
    fetchPolicy: 'cache-and-network',
  });

  return {
    isLoading: loading,
    refetch,
    state:
      data && data.states && data.states.total
        ? data.states.results[0]
        : undefined,
  };
};
