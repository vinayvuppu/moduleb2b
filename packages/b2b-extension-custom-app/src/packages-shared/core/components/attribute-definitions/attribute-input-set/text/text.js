import {
  messages as validationMessages,
  uniqueObjects as validateUniqueObjects,
} from '../../../../../utils/validation';
import AttributeInputText from '../../attribute-input-text';

export function createTextSetConfig() {
  return { attributeComponent: AttributeInputText };
}

export function createLocalizedTextSetConfig(intl) {
  return {
    attributeComponent: AttributeInputText,
    customValidator(items) {
      const invalidValues = validateUniqueObjects(items);

      return {
        isValid: !invalidValues.length,
        invalidValues,
        message: intl.formatMessage(validationMessages.unique),
      };
    },
  };
}
