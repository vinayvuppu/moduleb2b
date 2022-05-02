import { useQuery } from 'react-apollo';
import { oneLine } from 'common-tags';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { transformLocalizedFieldToString } from '@commercetools-local/utils/graphql';
import {
  FetchVariantQuery,
  FetchChannelsQuery,
} from './order-create-variant-search-connector.graphql';

const createVariantFetcherQueryVariables = options => ({
  where: oneLine`
    masterData(current(variants(key = "${options.searchTerm}")))
    or masterData(current(variants(sku = "${options.searchTerm}")))
    or masterData(current(masterVariant(sku = "${options.searchTerm}")))
    or masterData(current(masterVariant(key = "${options.searchTerm}")))
  `,
  target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
  projectKey: options.projectKey,
  // Price selection
  currency: options.currency,
  country: options.country || undefined,
  customerGroupId: options.customerGroupId || undefined,
  channelId: options.channelId || undefined,
  locale: options.locale,
});
const extractVariantFromGraphQlResponse = (data, searchTerm) =>
  data?.products.results.map(product => ({
    name: product.masterData.current.name,
    quantity: '1',
    ...[
      ...product.masterData.current.variants,
      product.masterData.current.masterVariant,
    ].find(variant => [variant.sku, variant.key].includes(searchTerm)),
  }));

export const useVariantFetcher = options => {
  const { projectKey, locale } = useApplicationContext(applicationContext => ({
    projectKey: applicationContext.project.key,
    locale: applicationContext.dataLocale,
  }));
  const queryVariables = createVariantFetcherQueryVariables({
    ...options,
    projectKey,
    locale,
  });

  const { data, refetch, loading } = useQuery(FetchVariantQuery, {
    variables: queryVariables,
    fetchPolicy: 'cache-and-network',
    /* We need to use this property in order to see the LoadingSpinner when
     * the user changes the page and the "fetchMore" function gets called if
     * not the "loading" property always is false
     * https://github.com/apollographql/react-apollo/issues/727
     */
    notifyOnNetworkStatusChange: true,
    skip: !options.searchTerm,
    onCompleted: () =>
      options.onCompleted(
        extractVariantFromGraphQlResponse(data, options.searchTerm)
      ),
  });

  return {
    isLoading: loading,
    refetch,
    variant: extractVariantFromGraphQlResponse(data, options.searchTerm) || [],
  };
};

const channelIdsToQueryVariable = channelIds =>
  channelIds.map(channelId => `"${channelId}"`);
export const createChannelsFetcherQueryVariables = options => ({
  target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
  // Only Channels with Role "ProductDistribution" are allowed to set in
  // a cart lineItem
  where: oneLine`
    id in (
      ${channelIdsToQueryVariable(options.channelIds).join(',')}
    )
    and roles contains any (
      "ProductDistribution"
    )`,
});
const extractChannelsFromGraphQlResposne = data =>
  data?.channels.results.map(graphQlChannelResponse => ({
    id: graphQlChannelResponse.id,
    name: transformLocalizedFieldToString(
      graphQlChannelResponse.nameAllLocales
    ),
    key: graphQlChannelResponse.key,
  }));

export const useChannelsFetcher = options => {
  const { data, refetch, loading } = useQuery(FetchChannelsQuery, {
    variables: createChannelsFetcherQueryVariables(options),
    skip: !options.channelIds || options.channelIds.length === 0,
  });

  return {
    isLoading: loading,
    refetch,
    channels: extractChannelsFromGraphQlResposne(data) || [],
  };
};
