import { MoneyInput } from '@commercetools-frontend/ui-kit';
import { FILTER_TYPES } from '../../constants';

const getCentAmountClause = (value, operator, locale) =>
  `centAmount ${operator} ${
    MoneyInput.convertToMoneyValue(value, locale).centAmount
  }`;

export default function moneyTransformer(value, option, locale) {
  const clauses = [];

  if (option === FILTER_TYPES.range) {
    clauses[0] = `currencyCode = "${value.from.currencyCode}"`;
    clauses[1] = getCentAmountClause(value.from, '>=', locale);
    clauses[2] = getCentAmountClause(value.to, '<=', locale);

    return clauses.join(' and ');
  }

  clauses[0] = `currencyCode = "${value.currencyCode}"`;
  switch (option) {
    case FILTER_TYPES.lessThan:
      clauses[1] = getCentAmountClause(value, '<', locale);
      break;
    case FILTER_TYPES.moreThan:
      clauses[1] = getCentAmountClause(value, '>', locale);
      break;
    case FILTER_TYPES.equalTo:
      clauses[1] = getCentAmountClause(value, '=', locale);
      break;
    default:
      return '';
  }

  return clauses.join(' and ');
}
