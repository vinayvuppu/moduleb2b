import { getIn } from 'formik';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { sanitize } from '@commercetools-local/utils/query-string';
import { EMAIL_REGEX } from '@commercetools-local/core/components/validated-input';
import customFieldsTransformer from '@commercetools-local/utils/filters/custom-fields';
import { transformAllToProperNounCase } from '@commercetools-local/utils/transform-to-proper-noun-case';
import transformFiltersToWherePredicate from '../../utils/transform-filters-to-where-predicate';

export const mapFiltersToPredicate = (filters, locale) =>
  Object.entries(filters).map(
    ([key, value]) =>
      `${transformFiltersToWherePredicate(
        {
          target: key,
          value,
        },
        locale
      )}`
  );

const getAllCasesList = value =>
  `("${value}", "${value.toLowerCase()}", "${transformAllToProperNounCase(
    value
  )}")`;

const getLowerCaseList = value => {
  if (value.toLowerCase() !== value) {
    return `("${value}", "${value.toLowerCase()}")`;
  }
  return `("${value}")`;
};

export const buildSearchQuery = (searchQuery, projectKey) => {
  if (!searchQuery) return '';

  const trimmedSearchQuery = oneLineTrim(searchQuery);

  if (EMAIL_REGEX.test(searchQuery)) {
    return oneLineTrim`((customerEmail in ${getLowerCaseList(
      trimmedSearchQuery
    )})
      or shippingAddress(email in ${getLowerCaseList(trimmedSearchQuery)})
      or billingAddress(email in ${getLowerCaseList(trimmedSearchQuery)}))`;
  }

  // short circuit for the Wizards, as all order numbers start with MTGArena
  if (projectKey && projectKey === 'mtga') {
    if (trimmedSearchQuery.startsWith('MTGArena')) {
      return `orderNumber = "${trimmedSearchQuery}"`;
    }
  }

  return oneLineTrim`((customerEmail = "${trimmedSearchQuery}"
    or orderNumber = "${trimmedSearchQuery}"
    or shippingAddress(lastName in ${getAllCasesList(trimmedSearchQuery)})
    or billingAddress(lastName in ${getAllCasesList(trimmedSearchQuery)})
    or shippingAddress(email in ${getAllCasesList(trimmedSearchQuery)})
    or billingAddress(email in ${getAllCasesList(trimmedSearchQuery)})
    or shippingAddress(city in ${getAllCasesList(trimmedSearchQuery)})
    or billingAddress(city in ${getAllCasesList(trimmedSearchQuery)})
    or shippingAddress(postalCode="${trimmedSearchQuery}")
    or billingAddress(postalCode="${trimmedSearchQuery}")
    or lineItems(variant(sku="${trimmedSearchQuery}"))))`;
};

export const createQueryVariables = (searchOptions, { projectKey, locale }) => {
  const sanitizedSearchText = sanitize(searchOptions.searchText);
  const searchQuery =
    searchOptions.searchText &&
    buildSearchQuery(sanitizedSearchText, projectKey);

  const filtersQueries = mapFiltersToPredicate(searchOptions.filters, locale);
  const sortParams = searchOptions.sorting
    ? `${searchOptions.sorting.key} ${searchOptions.sorting.order}`
    : 'createdAt desc';
  const whereQueries = [searchQuery, filtersQueries.join(' and ')].filter(
    Boolean
  );
  const whereQuery =
    whereQueries.length > 0 ? whereQueries.join(' and ') : undefined;

  return {
    where: whereQuery,
    limit: searchOptions.perPage,
    offset: (searchOptions.page - 1) * searchOptions.perPage,
    sort: [sortParams],
    target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    projectKey,
    // hasDataFenceStores: dataFenceStores.length > 0,
    // storeKeys: dataFenceStores,
  };
};

/* PAYMENTS QUERY */
const transformPaymentCustomFieldsFilters = (paymentCustomFields, locale) =>
  paymentCustomFields && customFieldsTransformer(paymentCustomFields, locale);

export const getPaymentValuesFromFilters = (filters, locale) => ({
  payment: getIn(filters, 'paymentPredicate.0.value'),
  transactionId: getIn(filters, 'paymentTransactionId.0.value'),
  interactionId: getIn(filters, 'paymentInteractionId.0.value'),
  customFields: transformPaymentCustomFieldsFilters(
    filters?.paymentCustomField,
    locale
  ),
});

export const createPaymentQueryVariables = (options, projectKey, locale) => {
  const filterPaymentsValues = getPaymentValuesFromFilters(
    options.filters,
    locale
  );

  // Note: All clauses are combined while we filter out the empty values.
  const paymentWhereClauses = [
    filterPaymentsValues.payment,
    filterPaymentsValues.transactionId &&
      `transactions(id = "${filterPaymentsValues.transactionId}")`,
    filterPaymentsValues.interactionId &&
      `transactions(interactionId = "${filterPaymentsValues.interactionId}")`,
    filterPaymentsValues.customFields,
  ].filter(Boolean);

  const whereQuery =
    paymentWhereClauses.length > 0
      ? paymentWhereClauses.join(' and ')
      : undefined;

  return {
    limit: 500, // The max API limit for one request
    where: whereQuery,
    target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    projectKey,
  };
};

const combineFiltersWithPayments = (filters, payments, locale) => {
  const paymentIds = payments.map(payment => payment.id);
  const filterPaymentsValues = getPaymentValuesFromFilters(filters, locale);
  return {
    ...(filterPaymentsValues.payment && {
      paymentPredicate: [
        {
          target: 'paymentPredicate',
          value: { value: paymentIds },
        },
      ],
    }),
    ...(filterPaymentsValues.transactionId && {
      paymentTransactionId: [
        {
          target: 'paymentTransactionId',
          value: { value: paymentIds },
        },
      ],
    }),
    ...(filterPaymentsValues.interactionId && {
      paymentInteractionId: [
        {
          target: 'paymentInteractionId',
          value: { value: paymentIds },
        },
      ],
    }),
    ...(filterPaymentsValues.customFields && {
      paymentCustomField: [
        {
          target: 'paymentCustomField',
          value: { value: paymentIds },
        },
      ],
    }),
  };
};

/* This function is responsible of constructing a customized filter options
 * taking into account the results of the payments search. We will return a
 * valid "paymentPredicate" filter option so can be used in the
 * transformFiltersToWherePredicate util for the orders search
 */
export const buildPaymentFilterOptions = (options, payments, locale) => ({
  ...options,
  filters: {
    ...options.filters,
    ...combineFiltersWithPayments(options.filters, payments, locale),
  },
});
