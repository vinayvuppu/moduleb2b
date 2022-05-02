import {
  messages as validationMessages,
  unique as validateUnique,
} from '../../../../../utils/validation';
import AttributeInputReference from '../../attribute-input-reference';

export default function createReferenceSetConfig(intl) {
  return {
    attributeComponent: AttributeInputReference,
    customValidator(items) {
      const invalidValues = validateUnique(items, ['id']).map(input => {
        const ref = items.find(value => value.id === input.id);
        return ref;
      });

      return {
        isValid: !invalidValues.length,
        invalidValues,
        message: intl.formatMessage(validationMessages.unique),
      };
    },
  };
}
