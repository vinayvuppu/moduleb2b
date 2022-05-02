import dateTransformer from '../date';
import timeTransformer from '../time';
import moneyTransformer from '../money';
import localizedTextTransformer from '../localized-string';
import { FILTER_TYPES, FIELD_TYPES } from '../../constants';

const composeNumberPredicateFromFilter = (target, value, option) => {
  switch (option) {
    case FILTER_TYPES.lessThan:
      return `${target} < ${value}`;
    case FILTER_TYPES.moreThan:
      return `${target} > ${value}`;
    case FILTER_TYPES.equalTo:
      return `${target} = ${value}`;
    case FILTER_TYPES.range:
      return `${target} >= ${value.from} and ${target} <= ${value.to}`;
    default:
      return '';
  }
};

export default function(filter, locale) {
  const customFieldsPredicates = filter.map(customFieldFilter => {
    const { target, type, value, option } = customFieldFilter.value;

    switch (type.name) {
      case FIELD_TYPES.Boolean:
        return `${target} = ${value.value}`;
      case FIELD_TYPES.String:
        return `${target} = "${value}"`;
      case FIELD_TYPES.LocalizedString:
        return `${target}(${localizedTextTransformer(value)})`;
      case FIELD_TYPES.Enum:
      case FIELD_TYPES.LocalizedEnum:
        return `${target} = "${value.value}"`;
      case FIELD_TYPES.Time:
        return timeTransformer(target, [{ type: option, value }]);
      case FIELD_TYPES.DateTime:
      case FIELD_TYPES.Date:
        return dateTransformer(target, [{ type: option, value }]);
      case FIELD_TYPES.Number:
        return composeNumberPredicateFromFilter(target, value, option);
      case FIELD_TYPES.Money:
        return `${target}(${moneyTransformer(value, option, locale)})`;
      case FIELD_TYPES.Reference:
      case FIELD_TYPES.Set:
      default:
        throw new Error('Custom field type not recognized');
    }
  });

  return `(custom(fields(${customFieldsPredicates.join(' and ')})))`;
}
