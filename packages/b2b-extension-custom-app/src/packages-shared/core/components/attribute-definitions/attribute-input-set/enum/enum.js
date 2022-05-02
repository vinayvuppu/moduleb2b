import {
  messages as validationMessages,
  unique as validateUnique,
} from '../../../../../utils/validation';
import AttributeInputEnum from '../../attribute-input-enum';

export default function createEnumSetConfig(intl) {
  return {
    attributeComponent: AttributeInputEnum,
    customValidator(items) {
      const invalidValues = validateUnique(items, ['key']).map(input => {
        const label = items.find(value => value.key === input.key).label;
        return { key: input.key, label };
      });

      return {
        isValid: !invalidValues.length,
        invalidValues,
        message: intl.formatMessage(validationMessages.unique),
      };
    },
  };
}
