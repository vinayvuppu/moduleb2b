import dateTransformer from '@commercetools-local/utils/filters/date';

const mapOperationToSymbol = {
  lessThan: '<',
  moreThan: '>',
  equalTo: '=',
};

const transformFilterValuesToWherePredicate = filter =>
  Array.isArray(filter)
    ? filter.map(val => `"${val}"`).join()
    : `"${filter.value}"`;

const composeReferencePredicateFromFilter = (filterName, filter) =>
  `${filterName.split('.')[0]}(${
    filterName.split('.')[1]
  } in (${transformFilterValuesToWherePredicate(filter[0].value)}))`;

const composeSinglePredicateFromFilter = (filterName, filter) =>
  `${filterName} ${mapOperationToSymbol[filter[0].type]} "${filter[0].value}"`;

const composeDateRangePredicate = (filterName, filter) =>
  `${filterName} >= "${filter[0].value.from}" and ${filterName} <= "${filter[0].value.to}"`;

const composeDatePredicateFromFilter = (filterName, filter) =>
  filter[0].type === 'range'
    ? composeDateRangePredicate(filterName, filter)
    : `${filterName} ${mapOperationToSymbol[filter[0].type]} "${
        filter[0].value
      }"`;

/* The value property on this function comes from the filters defined by SearchViewWithReduxState
 * so it can never be undefined or null, since the object is always defined with the type and the
 * value
 */
export default function transformFiltersToWherePredicate({ target, value }) {
  switch (target) {
    case 'customerGroup.id':
      return composeReferencePredicateFromFilter(target, value);
    // NOTE: This is not handled as the other date filters since the API is expecting here a Date
    // and not a DateTime so we can use the parsing date function using moment `dateTransformer`
    case 'dateOfBirth':
      return composeDatePredicateFromFilter(target, value);
    case 'createdAt':
    case 'lastModifiedAt':
      return dateTransformer(target, value);
    case 'firstName':
    case 'lastName':
    case 'middleName':
    case 'vatId':
      return composeSinglePredicateFromFilter(target, value);
    default:
      throw new Error('Invalid filter name requested');
  }
}
