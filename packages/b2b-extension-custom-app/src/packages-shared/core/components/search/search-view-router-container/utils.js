import { getIn } from 'formik';
import omit from 'lodash.omit';
import { encode as encodeQueryString, decode as decodeQueryString } from 'qss';
import { stringToBase64, base64ToString } from '../../../../utils/encodings';

/**
 * NOTE
 *   The `version` comes first and can be overwriten to bust
 *   existing search queries in case of conflicting migrations.
 */
export const VERSION_KEY = '__version';
export const matchesVersion = (searchQuery, version) =>
  Boolean(searchQuery[VERSION_KEY]) && searchQuery[VERSION_KEY] === version;
export const augmentWithVersion = (searchQuery, version) => ({
  [VERSION_KEY]: version,
  ...searchQuery,
});
export const omitVersion = searchQuery => omit(searchQuery, [VERSION_KEY]);

export const hasQuery = location =>
  getIn(location, 'query.query', '').length > 0;
export const hasStorage = storageSlice =>
  window.localStorage.getItem(storageSlice) !== null;

export const encode = searchOptions =>
  stringToBase64(JSON.stringify(searchOptions));
export const decode = searchOptions =>
  searchOptions && JSON.parse(base64ToString(searchOptions));

export const getFromStorage = storageSlice =>
  decode(window.localStorage.getItem(storageSlice));
export const putToStorage = (storageSlice, searchOptions) =>
  window.localStorage.setItem(storageSlice, encode(searchOptions));
export const removeFromStorage = storageSlice =>
  window.localStorage.removeItem(storageSlice);

export const encodeToUrl = (nextSearchOptions, previousSearch) => {
  const previousQueryString = decodeQueryString(previousSearch);
  /**
   * NOTE:
   *    `track` needs to be omitted from the `searchOptions`. It is
   *    used in action creators to track what filters are selected
   *    but should not end up in the URL.
   */
  const nextSearchOptionsAsQueryString = encode(
    omit(nextSearchOptions, 'track')
  );
  const nextQueryString = {
    ...previousQueryString,
    ...{
      query: nextSearchOptionsAsQueryString,
    },
  };

  return encodeQueryString(nextQueryString);
};
