import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { transformLocalizedFieldsForCartDiscount } from '@commercetools-local/utils/graphql';
import {
  SearchCartDiscount,
  FetchCartDiscountById,
} from './cart-discount.graphql';

export function searchCartDiscounts(apolloClient) {
  return apolloClient
    .query({
      query: SearchCartDiscount,
      variables: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    })
    .then(response =>
      (response.data?.cartDiscounts.results || []).map(cartDiscount =>
        transformLocalizedFieldsForCartDiscount(cartDiscount)
      )
    );
}

export function getCartDiscountById(apolloClient, options) {
  return apolloClient
    .query({
      query: FetchCartDiscountById,
      variables: {
        cartDiscountId: options.cartDiscountId,
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    })
    .then(response =>
      response.data?.cartDiscount
        ? transformLocalizedFieldsForCartDiscount(response.data.cartDiscount)
        : null
    );
}
