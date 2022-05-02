import omit from 'lodash.omit';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import flatMap from 'lodash.flatmap';
import { formatMoney } from '../formats/money';
import { getMinimumPricesByCurrencyCode } from '../prices';
import { PRODUCT_STATUSES } from '../constants';
import { formatDateTime } from '../formats';
import localize from '../localize';
import { getPathName, getAncestors } from '../categories';

export const COLUMN_WIDTH_FALLBACK = 200;

export const whiteList = new Map([
  // key => default (null means it has a translated message)
  ['id', 'ID'],
  ['version', null],
  ['productType', null],
  ['name', null],
  ['image', null],
  ['description', null],
  ['slug', 'Slug'],
  ['sku', 'SKU'],
  ['status', null],
  ['categories', null],
  ['totalCategories', null],
  ['totalVariants', null],
  ['metaTitle', null],
  ['metaDescription', null],
  ['price', null],
  ['taxCategory', null],
  ['createdAt', null],
  ['lastModifiedAt', null],
  ['state', null],
]);

export const columnsBlacklist = [];

export const sortRequiresLanguage = new Set(['name']);

export function sanitizeListColumns(columns) {
  return columns.map(column =>
    omit(column, [
      // This is injected in the client hence it does not need to be saved
      'attributeDefinition',

      // Deprecated props
      'display',
      'customLabel',
      'customType',
    ])
  );
}

export function normalizeProductSettings(settings) {
  return Object.keys(settings).reduce((acc, key) => {
    if (settings[key] === null || settings[key] === undefined) return acc;

    let field = key;

    if (key.includes('list_')) field = key.split('list_')[1];

    if (key.includes('filter_')) field = key.split('filter_')[1];

    // eslint-disable-next-line no-param-reassign
    acc[field] = settings[key];
    return acc;
  }, {});
}

// TODO remove the old splitVariantAttributesByConstraint function after
// state is normalized everywhere and use this one exclusively.
export function normalizedSplitVariantAttributesByConstraint(
  productType,
  constraint
) {
  const productAttributeDefinitions = [];
  const variantAttributeDefinitions = [];

  if (productType) {
    if (!constraint)
      throw new Error('You need to specify a constraint to filter for.');

    for (let i = 0; i < productType.attributes.length; i += 1) {
      const definition = productType.attributes[i];
      if (definition.attributeConstraint === constraint)
        productAttributeDefinitions.push(definition);
      else variantAttributeDefinitions.push(definition);
    }
  }

  return [productAttributeDefinitions, variantAttributeDefinitions];
}

export function splitVariantAttributesByConstraint(product, constraint) {
  const productAttributeDefinitions = [];
  const variantAttributeDefinitions = [];

  if (product) {
    if (!constraint)
      throw new Error('You need to specify a constraint to filter for.');

    for (let i = 0; i < product.productType.obj.attributes.length; i += 1) {
      const definition = product.productType.obj.attributes[i];
      if (definition.attributeConstraint === constraint)
        productAttributeDefinitions.push(definition);
      else variantAttributeDefinitions.push(definition);
    }
  }

  return [productAttributeDefinitions, variantAttributeDefinitions];
}

export function resolveStatusType(product) {
  const { published, hasStagedChanges } = product;

  if (published && hasStagedChanges) return PRODUCT_STATUSES.MODIFIED;

  if (published && !hasStagedChanges) return PRODUCT_STATUSES.PUBLISHED;

  return PRODUCT_STATUSES.UNPUBLISHED;
}

export const computedProperties = {
  // TODO: show relative time as tooltip
  // `intl.formatRelative(<DATETIME>)`
  createdAt({ product, intl, timeZone }) {
    return formatDateTime('datetime', product.createdAt, {
      locale: intl.locale,
      timeZone,
    });
  },
  lastModifiedAt({ product, intl, timeZone }) {
    return formatDateTime('datetime', product.lastModifiedAt, {
      locale: intl.locale,
      timeZone,
    });
  },
  productType({ product }) {
    return product.productType.obj
      ? product.productType.obj.name
      : NO_VALUE_FALLBACK;
  },
  price({ product, intl }) {
    const allVariants = product.variants.concat(product.masterVariant);
    const variantPrices = flatMap(allVariants, variant => variant.prices);
    return (
      getMinimumPricesByCurrencyCode(variantPrices)
        .map(price => formatMoney(price, intl))
        .join(', ') || NO_VALUE_FALLBACK
    );
  },
  sku({ product }) {
    const allVariants = [product.masterVariant].concat(product.variants);
    return allVariants
      .map(({ sku }) => sku)
      .filter(Boolean)
      .join(', ');
  },
  totalCategories({ product }) {
    return product.categories.length;
  },
  totalVariants({ product }) {
    // including master variant :)
    return product.variants.length + 1;
  },
  taxCategory({ product }) {
    // Guards against dead references of a tax category
    if (product.taxCategory && product.taxCategory.obj)
      return product.taxCategory.obj.name;

    return NO_VALUE_FALLBACK;
  },
  state({ product, language, languages }) {
    if (product.state && product.state.obj && product.state.obj.name)
      return localize({
        obj: product.state.obj,
        key: 'name',
        language,
        fallbackOrder: languages,
      });
    return NO_VALUE_FALLBACK;
  },
  categories({ product, language, languages }) {
    // If any of the expanded categories in the product
    // doesn't have an `obj` key, we should assume that it is a dead reference.
    // This scenario occurs when the search index of product-projections
    // doesn't update in time when a category belonging to the product
    // has been deleted. See MC-1925 for further information.
    const filteredCategories = product.categories.filter(
      category => category.obj !== undefined
    );

    return filteredCategories.map(category => {
      const categoryPath = getPathName(category, language, languages);
      const ancestors = getAncestors(category, language);

      const externalIdValue = category.obj.externalId
        ? // hardcoding "ext. ID" since this is not part of a message to be
          // translated. This has been communicated with Jenn
          `| ext. ID: ${category.obj.externalId}`
        : '';

      return {
        id: category.id,
        name: `${localize({
          obj: category.obj,
          key: 'name',
          language,
          fallbackOrder: languages,
        })} ${externalIdValue}`,
        path: categoryPath,
        level: ancestors.length,
      };
    });
  },
};
