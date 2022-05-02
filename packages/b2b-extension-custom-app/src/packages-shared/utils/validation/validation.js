import { defineMessages } from 'react-intl';
import { deepEqual } from 'fast-equals';

export const messages = defineMessages({
  unique: {
    id: 'Validation.unique',
    description: 'An error message to show if the field must be unique',
    defaultMessage:
      'The value you have entered already exists in this list of ' +
      'values. Please add only unique values to this list.',
  },
  required: {
    id: 'Validation.required',
    description: 'An error message to show if the field is required',
    defaultMessage: 'Please fill in this required field.',
  },
  numeric: {
    id: 'Validation.numeric',
    description: 'An error message to show if the field must be numeric',
    defaultMessage:
      'Please enter only numbers (0 - 9) and decimal ' +
      'separators in this field.',
  },
  integer: {
    id: 'Validation.integer',
    description: 'An error message to show if the field must be integer',
    defaultMessage: 'Please enter only numbers (0 - 9) in this field.',
  },
  email: {
    id: 'Validation.email',
    description:
      'An error message to show if the field must be a ' +
      'valid email address',
    defaultMessage: 'Please enter a valid email address.',
  },
  notFound: {
    id: 'Validation.notFound',
    description: 'An error message to show a resource id was not found',
    defaultMessage: 'The resource was not found',
  },
  invalid: {
    id: 'Validation.invalid',
    description: 'An error message to show the id is invalid',
    defaultMessage: 'The resource id is invalid',
  },
});

/**
* This takes in an array of values or objects and returns an array of values
* that are duplicated in the original array. If the properties param is
* specified then only those fields of any objects are compared
*
* @param values         Array of values to check
* @param properties     Array of strings containing names of
*                         object properties to check
* @param ignoredValues  Array of values to ignore, defaults to empty string,
                          null and undefined
* @return               Array of strings or objects that are
*                         duplicated in original values
*/
export function unique(
  values,
  properties,
  ignoredValues = ['', null, undefined]
) {
  const duplicateValues = [];
  let realValues;

  // Strip out ignored values
  realValues = values.filter(value => !ignoredValues.includes(value));

  if (!realValues.length) return [];

  if (properties)
    realValues = realValues.map(value =>
      properties.reduce((prev, curr) => {
        const currentValue = value[curr] || '';
        return `${prev}:${currentValue}`;
      }, '')
    );
  else realValues = values.slice(0);

  // TODO: checking for dupes like this is slow, find a better way
  realValues.sort().reduce((prev, curr) => {
    if (curr === null) return curr;

    if (curr !== '' && prev === curr && duplicateValues.indexOf(curr) === -1)
      duplicateValues.push(curr);

    return curr;
  });

  if (properties)
    return duplicateValues.map(value => {
      const parts = value.split(':').slice(1);

      return properties.reduce((prev, curr, index) => {
        // eslint-disable-next-line no-param-reassign
        prev[curr] = parts[index];
        return prev;
      }, {});
    });

  return duplicateValues;
}

/**
 * This function does a dumb deepComparison of each item to produce
 * a list of duplicates. Its probably pretty slow an inefficient, if we have
 * perf issue with it then I've documented a slightly more efficient version of
 * it below
 * @param  Array<Object> items An array of objects to get the duplicate within
 * @return Array<Object> returns an array of objects with all duplicated values
 */
export function uniqueObjects(items) {
  const emptyValues = [undefined, null, ''];
  const itemsWorkingSet =
    items && items.length
      ? items.slice().filter(x => !emptyValues.includes(x))
      : [];
  const duplicateValues = itemsWorkingSet.reduce((acc, item, index) => {
    if (item === null) return acc;

    const isDuplicate = itemsWorkingSet
      .slice(index + 1) // get sub-array after this index
      .reduce((duplicateAcc, comparisonItem, comparisonIndex) => {
        if (comparisonItem === null) return duplicateAcc;

        // check if its a dupe
        const comparisonIsDuplicate = deepEqual(item, comparisonItem);

        // if and item is a duplicate, we set item in the original array to
        // null. This means we don't have to compare it again, we can just
        // skip it
        if (comparisonIsDuplicate)
          itemsWorkingSet[comparisonIndex + index + 1] = null;

        return duplicateAcc || comparisonIsDuplicate;
      }, false);

    if (isDuplicate) acc.push(item);

    return acc;
  }, []);

  return duplicateValues;
}

/**
 * A MAYBE BETTER WAY...

 INPUT: [ { en: 'hi' }, { en: 'hi', de: 'hallo' }, { de: 'hallo', en: 'hi' } ]


 STEP 1. collect object by concatenating their keys to produce this:

 _NB_ you will need to sort the keys when comparing them!

 STEP 1 OUTPUT: { en: [ 0 ], "de:en": [ 1, 2 ] }


 STEP 2. Drop anything from this key map that only has a length of 1:

 STEP 2 OUTPUT: { "de:en": [ 1, 2 ] }


 STEP 3. Compare everything in the sub-arrays as normal

 */
