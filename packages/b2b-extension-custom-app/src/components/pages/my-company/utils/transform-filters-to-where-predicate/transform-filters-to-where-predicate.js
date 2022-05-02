import oneLineTrim from 'common-tags/lib/oneLineTrim';
import customFieldsTransformer from '@commercetools-local/utils/filters/custom-fields';
import { transformAllToProperNounCase } from '@commercetools-local/utils/transform-to-proper-noun-case';
import dateTransformer from '@commercetools-local/utils/filters/date';

export const transformFilterValuesToWherePredicate = value =>
  Array.isArray(value) ? value.map(val => `"${val}"`).join() : `"${value}"`;

export const composeSimplePredicateFromFilter = (filterName, filter) =>
  `${filterName} in (${transformFilterValuesToWherePredicate(
    filter[0].value.value
  )})`;

export const composeLineItemStatePredicateFromFilter = (filterName, filter) => {
  const transformedPredicate = `state(state(id in (${transformFilterValuesToWherePredicate(
    filter[0].value
  )})))`;

  return `lineItems(${transformedPredicate}) or customLineItems(${transformedPredicate})`;
};

export const createBasicPredicate = filter => `${filter[0].value}`;

export const createPaymentPredicate = filter =>
  `paymentInfo(payments(id in (${transformFilterValuesToWherePredicate(
    filter[0].value.value
  )})))`;

export const createPaymentCustomFieldPredicate = filter =>
  `custom(fields(${createPaymentPredicate(filter)}))`;

export const composeReferencePredicateFromFilter = (filterName, filter) =>
  `${filterName.split('.')[0]}(${
    filterName.split('.')[1]
  } in (${transformFilterValuesToWherePredicate(filter[0].value)}))`;

export const getAllCasesList = value =>
  `("${value}", "${value.toLowerCase()}", "${transformAllToProperNounCase(
    value
  )}")`;

// NOTE: We are filtering by billingAddress and shippingAddress name in order to
// allow users to also find anonymous orders which do not have any customer set
export const composeNamePredicateFromFilter = (filterName, filter) =>
  filter[0].value
    ? oneLineTrim`(
      billingAddress(${filterName} in ${getAllCasesList(filter[0].value)})
      or shippingAddress(${filterName} in ${getAllCasesList(filter[0].value)})
      )`
    : '';

export const composeSkuPredicateFromFilter = filter =>
  filter[0].value ? `lineItems(variant(sku="${filter[0].value}"))` : '';

export const composeAddressPostalCodePredicateFromFilter = (
  addressType,
  filter
) =>
  filter[0].value ? `${addressType}(postalCode = "${filter[0].value}")` : '';

export const composeAddressCityPredicateFromFilter = (addressType, filter) =>
  filter[0].value
    ? `${addressType}(city in ${getAllCasesList(filter[0].value)})`
    : '';

export const composeBasicPredicateFromFilter = (filterName, filter) =>
  `${filterName} in (${transformFilterValuesToWherePredicate(
    filter[0].value.map(val => val.value)
  )})`;

export default function transformFiltersToWherePredicate(
  { target, value },
  locale
) {
  switch (target) {
    case 'orderNumber':
      return composeBasicPredicateFromFilter(target, value);
    case 'orderState':
    case 'shipmentState':
    case 'paymentState':
      return composeSimplePredicateFromFilter(target, value);
    case 'state.id':
    case 'store.key':
      return composeReferencePredicateFromFilter(target, value);
    case 'createdAt':
      return dateTransformer(target, value);
    case 'lineItemState':
      return composeLineItemStatePredicateFromFilter(target, value);
    case 'orderPredicate':
      return createBasicPredicate(value);
    case 'paymentPredicate':
    case 'paymentTransactionId':
    case 'paymentInteractionId':
    case 'paymentCustomField':
      return createPaymentPredicate(value);
    case 'firstName':
    case 'lastName':
      return composeNamePredicateFromFilter(target, value);
    case 'skuFilter':
      return composeSkuPredicateFromFilter(value);
    case 'billingAddressCityFilter':
      return composeAddressCityPredicateFromFilter('billingAddress', value);
    case 'billingAddressPostalCodeFilter':
      return composeAddressPostalCodePredicateFromFilter(
        'billingAddress',
        value
      );
    case 'shippingAddressCityFilter':
      return composeAddressCityPredicateFromFilter('shippingAddress', value);
    case 'shippingAddressPostalCodeFilter':
      return composeAddressPostalCodePredicateFromFilter(
        'shippingAddress',
        value
      );
    case 'orderCustomField':
      return customFieldsTransformer(value, locale);
    case 'customerGroup.id':
      return composeReferencePredicateFromFilter(target, value);
    default:
      throw new Error('Invalid filter name requested');
  }
}
