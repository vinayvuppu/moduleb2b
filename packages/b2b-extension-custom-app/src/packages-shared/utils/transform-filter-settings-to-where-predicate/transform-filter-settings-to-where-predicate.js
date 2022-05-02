import oneLine from 'common-tags/lib/oneLine';
import { PRODUCT_STATUSES } from '../constants';

const CATEGORIES = 'categories';
const CUSTOM_ATTRIBUTES = 'customAttributes';
const PRODUCT_TYPES = 'productTypes';
const STATES = 'states';
const STATUS = 'status';
const SELECTED_PRODUCT_IDS = 'selectedProductIds';

const transformers = {
  [CATEGORIES]: createResourceIdTransformer('categories'),
  [CUSTOM_ATTRIBUTES]: transformAttributeFilters,
  [PRODUCT_TYPES]: createResourceIdTransformer('productType'),
  [STATES]: createResourceIdTransformer('state'),
  [STATUS]: transformStatusFilter,
  [SELECTED_PRODUCT_IDS]: createKeyTransformer('id'),
};

export const transformerKeys = [
  CATEGORIES,
  CUSTOM_ATTRIBUTES,
  PRODUCT_TYPES,
  STATES,
  STATUS,
  SELECTED_PRODUCT_IDS,
];

export const createVariantPredicate = predicate => oneLine`
  (masterVariant(${predicate})
  or
  variants(${predicate}))
`;

export function transformFilterSettingsToWherePredicate(
  filterSettings,
  options = {}
) {
  const filterOperator = options.operator === 'OR' ? ' or ' : ' and ';
  const predicates = transformerKeys.reduce((acc, transformerKey) => {
    if (!filterSettings[transformerKey]) return acc;
    const transformer = transformers[transformerKey];
    const predicate = transformer(
      filterSettings[transformerKey],
      transformerKey === SELECTED_PRODUCT_IDS
        ? undefined
        : {
            missingKeys: filterSettings.missing,
            excludedKeys: filterSettings.excluded,
            language: options.language,
          }
    );
    return predicate ? [...acc, predicate] : acc;
  }, []);

  return predicates.length ? predicates.join(filterOperator) : null;
}

export function transformStatusFilter(statusFilter) {
  // if user has selected none or all, don't create any predicate
  if (
    !statusFilter.length ||
    statusFilter.length === Object.keys(PRODUCT_STATUSES).length
  )
    return null;

  // if user has selected published and unpublished,
  // we assume that they want all products that is either published
  // or unpublished but with no staged changes.
  if (
    statusFilter.length === 2 &&
    !statusFilter.includes(PRODUCT_STATUSES.MODIFIED)
  )
    return 'hasStagedChanges=false';

  const statusAggregate = statusFilter.reduce((predicates, statusType) => {
    if (statusType === PRODUCT_STATUSES.MODIFIED)
      return {
        ...predicates,
        hasStagedChanges: true,
      };

    if (
      statusType === PRODUCT_STATUSES.PUBLISHED ||
      statusType === PRODUCT_STATUSES.UNPUBLISHED
    )
      return {
        ...predicates,
        published: statusType === PRODUCT_STATUSES.PUBLISHED,
      };

    return predicates;
  }, {});

  const statusPredicates = Object.entries(statusAggregate).map(
    ([key, value]) => `${key}=${value}`
  );

  return statusPredicates.join(' and ');
}

const wrapWithAttributesClause = query => `attributes(${query})`;
const wrapWithNotClause = query => `not(${query})`;

function transformAttributeFilters(attributeFilters, options) {
  if (!attributeFilters.length) return null;
  const attributePredicates = attributeFilters.reduce(
    (predicates, attribute) => {
      const predicate = transformAttributeFilter(attribute, options).concat(
        attribute.missing
          ? `${attribute.values.length ? ' or ' : ''}${wrapWithAttributesClause(
              `not(name${attribute.excluded ? '!' : ''}="${attribute.name}")`
            )}`
          : ''
      );

      return predicate ? [...predicates, predicate] : predicates;
    },
    []
  );
  const joinedAttributePredicates = attributePredicates.join(' and ');
  return createVariantPredicate(joinedAttributePredicates);
}

export function transformAttributeFilter(attributeFilter, options) {
  if (!attributeFilter.values.length) return '';

  const formatValues = values => values.map(v => `"${v}"`).join(', ');
  const formatRangePredicate = (attributeType, value) => {
    const label = attributeType === 'money' ? 'centAmount' : 'value';
    const formatFilterValue = filterValue =>
      ['number', 'money'].includes(attributeType)
        ? filterValue
        : `"${filterValue}"`;

    if ((!value.from || !value.to) && value.searchByRange === false) {
      return `${label}=${formatFilterValue(value.from)}`;
    }

    if (value.from && value.to) {
      return `${label} > ${formatFilterValue(
        value.from
      )} and ${label} < ${formatFilterValue(value.to)}`;
    }

    return `${label} ${value.from ? '>' : '<'} ${formatFilterValue(
      value.from || value.to
    )}`;
  };

  const basePredicate = (() => {
    switch (attributeFilter.type) {
      case 'enum':
      case 'lenum': {
        const formattedValues = formatValues(
          attributeFilter.values.map(v => v.key)
        );
        return wrapWithAttributesClause(
          oneLine`
          name="${attributeFilter.name}"
          and
          value(key in (${formattedValues}))
        `
        );
      }
      case 'boolean': {
        return wrapWithAttributesClause(
          oneLine`
          name="${attributeFilter.name}"
          and
          value in (${attributeFilter.values.join(', ')})
        `
        );
      }
      case 'text': {
        const formattedValues = formatValues(attributeFilter.values);
        return wrapWithAttributesClause(
          oneLine`
          name="${attributeFilter.name}"
          and
          value in (${formattedValues})
        `
        );
      }
      case 'ltext': {
        const valuePredicates = attributeFilter.values.map(value =>
          wrapWithAttributesClause(
            oneLine`
            name="${attributeFilter.name}"
            and
            value(${options.language || attributeFilter.locale}="${value}")
            `
          )
        );
        return valuePredicates.join(' or ');
      }
      case 'date':
      case 'datetime':
      case 'time': {
        const valuePredicates = attributeFilter.values.map(value =>
          wrapWithAttributesClause(
            oneLine`
            name="${attributeFilter.name}"
            and
            ${formatRangePredicate(attributeFilter.type, value)}
          `
          )
        );
        return valuePredicates.join(' or ');
      }
      case 'number': {
        const valuePredicates = attributeFilter.values.map(value =>
          wrapWithAttributesClause(
            oneLine`
            name="${attributeFilter.name}"
            and
            ${formatRangePredicate(attributeFilter.type, value)}
          `
          )
        );
        return valuePredicates.join(' or ');
      }
      case 'money': {
        const valuePredicates = attributeFilter.values.map(value =>
          wrapWithAttributesClause(
            oneLine`
            name="${attributeFilter.name}"
            and
            value(currencyCode="${value.currency ||
              value.currencyCode}" and ${formatRangePredicate(
              attributeFilter.type,
              value
            )})`
          )
        );
        return valuePredicates.join(' or ');
      }
      case 'reference': {
        const valuePredicates = attributeFilter.values.map(value =>
          wrapWithAttributesClause(
            oneLine`
            name="${attributeFilter.name}"
            and
            value(typeId="${attributeFilter.referenceTypeId}" and id="${value}")
          `
          )
        );
        return valuePredicates.join(' or ');
      }
      default:
        throw new Error(`attribute-type ${attributeFilter.type} not supported`);
    }
  })();

  return attributeFilter.excluded
    ? wrapWithNotClause(basePredicate)
    : basePredicate;
}

export function createResourceIdTransformer(resourceType) {
  const transformerById = createKeyTransformer('id');
  return (resourceList, options = {}) => {
    // the `missing` key of the filter-settings object is a list of
    // resource names which are to be filtered by missing values.
    // for `state` of the product, this is named `states` among the filters,
    // but we need it to be `state` when mapping to a where-query
    const missingKey = resourceType === 'state' ? 'states' : resourceType;

    if (
      options.missingKeys &&
      options.missingKeys.includes(missingKey) &&
      !resourceList.length
    )
      return `${resourceType}(id is not defined)`;

    if (
      !resourceList.length &&
      (!options.missingKeys || !options.missingKeys.includes(missingKey))
    )
      return null;
    const isExcluded = options.excludedKeys?.includes(resourceType);

    const transformedIds = transformerById(
      resourceList.map(resource => resource.id),
      isExcluded
    );

    return `${resourceType}(${transformedIds})`.concat(
      options.missingKeys && options.missingKeys.includes(missingKey)
        ? ` or ${resourceType}(id is ${isExcluded ? '' : 'not '}defined)`
        : ''
    );
  };
}

export function createKeyTransformer(key) {
  return (values, isExcluded = false) => {
    if (!values.length) return null;

    const valuesIn = values.map(value => `"${value}"`).join(', ');
    return `${key} ${isExcluded ? 'not ' : ''}in (${valuesIn})`;
  };
}
