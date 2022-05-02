import { sortRequiresLanguage } from '../products';
import { PRODUCT_STATUSES } from '../constants';

export const getProductTypesFilterQuery = productTypes =>
  productTypes && productTypes.length
    ? `productType.id:${productTypes.map(p => `"${p.id}"`).join(',')}`
    : null;

export const getCategoriesFilterQuery = ({
  hasMissingCategory,
  categories,
  excludeSubcategories,
}) => {
  if (hasMissingCategory) return 'categories:missing';
  if (categories && categories.length) {
    const categoryIds = categories
      .map(category =>
        excludeSubcategories ? `"${category.id}"` : `subtree("${category.id}")`
      )
      .join(',');

    return `categories.id:${categoryIds}`;
  }

  return null;
};

export const getStateQueryFilter = ({ hasMissingState, states }) => {
  if (hasMissingState) return 'state:missing';
  if (states && states.length) {
    const stateIds = states.map(state => `"${state.id}"`).join(',');
    return `state.id:${stateIds}`;
  }

  return null;
};

export const getStatusFilterQueries = status => {
  const results = [];

  if (status && status.length) {
    const published = [];
    const hasStagedChanges = [];
    if (
      status.includes(PRODUCT_STATUSES.PUBLISHED) ||
      status.includes(PRODUCT_STATUSES.MODIFIED)
    )
      published.push(true);
    if (status.includes(PRODUCT_STATUSES.PUBLISHED))
      hasStagedChanges.push(false);
    if (status.includes(PRODUCT_STATUSES.MODIFIED)) hasStagedChanges.push(true);
    if (status.includes(PRODUCT_STATUSES.UNPUBLISHED)) published.push(false);

    if (published.length) results.push(`published:${published.join(',')}`);
    if (hasStagedChanges.length) {
      results.push(`hasStagedChanges:${hasStagedChanges.join(',')}`);
    }
  }

  return results;
};

export const getCustomAttributesFilterQuery = filter => {
  // Backwards compatibility
  if (filter.value && !filter.values) return null;

  const baseFilterPath = `variants.attributes.${filter.name}`;

  if (filter.type === 'boolean')
    return (
      baseFilterPath +
      (filter.missing === true
        ? ':missing'
        : `:${filter.values.map(x => `"${x}"`).join(',')}`)
    );
  if (filter.type === 'enum' || filter.type === 'lenum')
    return (
      baseFilterPath +
      (filter.missing === true
        ? ':missing'
        : `.key:${filter.values
            .map(v => v.key)
            .filter(Boolean)
            .map(x => `"${x.trim()}"`)
            .join(',')}`)
    );
  if (filter.type === 'reference')
    return (
      baseFilterPath +
      (filter.missing === true
        ? ':missing'
        : `.id:${filter.values
            .filter(Boolean)
            .map(x => `"${x.trim()}"`)
            .join(',')}`)
    );
  if (
    filter.type === 'date' ||
    filter.type === 'time' ||
    filter.type === 'datetime'
  ) {
    if (filter.missing === true) return `${baseFilterPath}:missing`;

    const ranges = filter.values.map(
      val =>
        '(' +
        `"${val.from ? val.from : '*'}" to ` +
        `"${val.to ? val.to : '*'}")`
    );

    return `${baseFilterPath}:range ${ranges.join(',')}`;
  }
  if (filter.type === 'money' || filter.type === 'number') {
    if (filter.missing === true) return `${baseFilterPath}:missing`;

    const currencyCode = [];
    const amount = [];

    // Using `.forEach` will break minification with Uglify
    // as it attemps to parse the template literal which
    // is not transformed by babel beforehand. Can be replaced
    // in favor of a `.forEach` whenever we activiate ES201*
    // aware minification through e.g. babili or uglify-em.
    // eslint-disable-next-line no-restricted-syntax
    for (const val of filter.values) {
      if (filter.type === 'money' && val.currency)
        currencyCode.push(`"${val.currency}"`);

      if (val.from || val.to)
        amount.push(
          '(' +
            `"${val.from ? val.from : '*'}" to ` +
            `"${val.to ? val.to : '*'}")`
        );
    }

    if (filter.type === 'money' && currencyCode.length) {
      if (currencyCode.length)
        return `${baseFilterPath}.currencyCode:${currencyCode.join(',')}`;

      if (amount.length)
        return `${baseFilterPath}.centAmount:range ${amount.join(',')}`;
    } else if (filter.type === 'number' && amount.length)
      return `${baseFilterPath}:range ${amount.join(',')}`;
    // Either `text` type or default fallback.
  } else
    return (
      baseFilterPath +
      (filter.missing === true
        ? ':missing'
        : `:${filter.values
            .filter(Boolean)
            .map(x => `"${typeof x === 'string' ? x.trim() : x}"`)
            .join(',')}`)
    );

  return null;
};

export const getSortingFilters = ({ sorting, language }) => {
  const results = [];
  for (let i = 0; i < sorting.length; i += 1) {
    const sortOption = sorting[i];
    const { key } = sortOption;
    const type = sortOption.type ? sortOption.type.name : null;
    let suffix;

    if (type === 'ltext') suffix = language;
    else if (type === 'enum' || type === 'lenum') suffix = 'key';
    else if (type === 'money') {
      // Need to add this, otherwise sorting by cents doesn't make sense!
      // The sort order here needs to be fixed, otherwise the currency code
      // will jump depending on the order of the cent amount.
      results.push({
        path: `variants.attributes.${key}.currencyCode`,
        order: true,
      });

      suffix = 'centAmount';
    }

    if (key !== 'relevance') {
      let sortPath = `variants.attributes.${key}${suffix ? `.${suffix}` : ''}`;
      if (!type)
        sortPath = sortRequiresLanguage.has(key) ? `${key}.${language}` : key;

      results.push({
        path: sortPath,
        order: sortOption.order === 'asc',
      });
    }
  }

  return results;
};
