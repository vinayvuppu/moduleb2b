import isEmpty from '../../is-empty/single';
import { messages as validationMessages } from '../../../validation';

export const validateSingleOptionEnum = (selectedOption, intl) => {
  if (isEmpty(selectedOption))
    return intl.formatMessage(validationMessages.required);

  return null;
};

export const validateMultiOptionEnum = (selectedOption, intl) => {
  if (isEmpty(selectedOption) || selectedOption.value.length === 0)
    return intl.formatMessage(validationMessages.required);

  return null;
};
