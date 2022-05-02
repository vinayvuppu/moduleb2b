/* eslint-disable no-param-reassign */

export function pickFilters(filterParams, settings) {
  return filterParams.reduce((acc, filter) => {
    const filterValue = settings[filter];
    if (filterValue || typeof filterValue === 'boolean')
      acc[filter] = filterValue;
    return acc;
  }, {});
}

export function coercion(values) {
  return Object.keys(values).reduce((acc, p) => {
    const paramValue = values[p];
    if (!isNaN(paramValue)) {
      acc[p] = parseInt(paramValue, 10);
      return acc;
    }

    acc[p] =
      paramValue === 'true' || (paramValue === 'false' ? false : paramValue);
    return acc;
  }, {});
}

export function sanitize(param) {
  if (typeof param === 'string')
    return (
      param
        // Replace all \ with \\ (to prevent generate escape characters)
        .replace(/\\/g, '\\\\')
        // Replace all " with \"
        .replace(/"/g, '\\"')
    );

  return param;
}
