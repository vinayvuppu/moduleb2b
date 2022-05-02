import {
  messages as validationMessages,
  unique as validateUnique,
} from '../../../../../utils/validation';
import AttributeInputMoney from '../../attribute-input-money';

export default function createMoneySetConfig(intl) {
  return {
    attributeComponent: AttributeInputMoney,
    customValidator(items) {
      const invalidValues = validateUnique(items, [
        'currencyCode',
        'centAmount',
      ]);

      return {
        isValid: !invalidValues.length,
        invalidValues,
        message: intl.formatMessage(validationMessages.unique),
      };
    },
  };
}
