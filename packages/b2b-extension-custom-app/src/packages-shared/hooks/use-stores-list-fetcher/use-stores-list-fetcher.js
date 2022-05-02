import { useQuery } from 'react-apollo';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { FetchStoresQuery } from './stores-list-query.graphql';

export const createQueryVariables = ownProps => ({
  target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
  limit: ownProps.limit,
  offset: ownProps.offset,
  sort: ownProps.sort,
  ...(Boolean(ownProps.stores) && {
    where: `key in (${ownProps.stores.map(store => `"${store}"`).join(', ')})`,
  }),
});

const emptyStores = {
  total: 0,
  count: 0,
  results: [],
};

const useStoresListFetcher = props => {
  const { data, refetch, loading } = useQuery(FetchStoresQuery, {
    variables: createQueryVariables(props),
    fetchPolicy: 'cache-and-network',
  });

  return {
    isLoading: loading,
    refetch,
    stores: data?.stores || emptyStores,
  };
};

export default useStoresListFetcher;
