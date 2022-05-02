// Network status adapted from
// https://www.okgrow.com/posts/loading-patterns-in-apollo-client
// https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-networkStatus
// networkStatus 1: loading
// networkStatus 2: setVariables
// networkStatus 3: fetchMore
// networkStatus 4: refetch
// networkStatus 5: unused
// networkStatus 6: poll
// networkStatus 7: ready
// networkStatus 8: error
export const convertApolloNetworkStatusToLoadingState = networkStatus => ({
  initialLoading: networkStatus === 1,
  activelyRefetching: networkStatus === 4,
  passivelyRefetching: networkStatus === 2 || networkStatus === 6,
  fetchingMore: networkStatus === 3,
});

export const convertApolloQueryDataToConnectorData = (
  queryData,
  dataKey,
  { mapData } = {}
) => ({
  isLoading: queryData.loading,
  loadingState: convertApolloNetworkStatusToLoadingState(
    queryData.networkStatus
  ),
  error: queryData.error,
  [dataKey]: mapData ? mapData(queryData[dataKey]) : queryData[dataKey],
});
