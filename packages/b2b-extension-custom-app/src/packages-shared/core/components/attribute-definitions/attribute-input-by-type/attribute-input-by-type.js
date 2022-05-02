import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldLabel, WarningIcon } from '@commercetools-frontend/ui-kit';
import AttributeInputText from '../attribute-input-text';
import AttributeInputDateTime from '../attribute-input-datetime';
import AttributeInputEnum from '../attribute-input-enum';
import AttributeInputBoolean from '../attribute-input-boolean';
import AttributeInputNumber from '../attribute-input-number';
import AttributeInputMoney from '../attribute-input-money';
import AttributeInputReference from '../attribute-input-reference';
import AttributeInputSet from '../attribute-input-set';
import NestedAttributeInputs from '../nested-attribute-inputs';
import messages from './messages';

const AttributeEditWarning = props => (
  <FieldLabel title="" hint={props.message} hintIcon={<WarningIcon />} />
);
AttributeEditWarning.displayName = 'AttributeEditWarning';
AttributeEditWarning.propTypes = {
  message: PropTypes.node,
};
//
const MAX_NESTING_LEVEL = 5;

const AttributeInputByType = props => {
  const isSetType = props.definition.type.name === 'set';

  const type = isSetType
    ? props.definition.type?.elementType
    : props.definition.type;
  if (type?.name === 'nested') {
    if (props.level === MAX_NESTING_LEVEL)
      return (
        <AttributeEditWarning
          message={<FormattedMessage {...messages.aboveFifthLevelWarning} />}
        />
      );
    if (!props.canEditNestedAttributes)
      return (
        <AttributeEditWarning
          message={<FormattedMessage {...messages.editAttributeWarning} />}
        />
      );
    return <NestedAttributeInputs {...props} />;
  }
  switch (props.definition.type.name) {
    case 'text':
    case 'ltext':
      return (
        <AttributeInputText
          attribute={props.attribute}
          definition={props.definition}
          disabled={props.disabled}
          isValid={props.isValid}
          languages={props.languages}
          onBlurValue={props.onBlurValue}
          onChangeValue={props.onChangeValue}
          selectedLanguage={props.selectedLanguage}
          expandSettings={props.expandSettings}
          updateSettings={props.updateSettings}
        />
      );

    case 'enum':
    case 'lenum':
      return (
        <AttributeInputEnum
          definition={props.definition}
          attribute={props.attribute}
          disabled={props.disabled}
          expandSettings={props.expandSettings}
          isClearable={props.isClearable}
          isValid={props.isValid}
          onBlurValue={props.onBlurValue}
          onChangeValue={props.onChangeValue}
          profile={props.profile}
          selectedLanguage={props.selectedLanguage}
        />
      );

    case 'boolean':
      return (
        <AttributeInputBoolean
          definition={props.definition}
          attribute={props.attribute}
          profile={props.profile}
          onChangeValue={props.onChangeValue}
          disabled={props.disabled}
        />
      );

    case 'number':
      return (
        <AttributeInputNumber
          attribute={props.attribute}
          definition={props.definition}
          disabled={props.disabled}
          numberFormat={props.numberFormat}
          onBlurValue={props.onBlurValue}
          onChangeValue={props.onChangeValue}
        />
      );

    case 'money':
      return (
        <AttributeInputMoney
          attribute={props.attribute}
          className={props.className}
          currencies={props.currencies}
          definition={props.definition}
          numberFormat={props.numberFormat}
          onBlurValue={props.onBlurValue}
          onChangeValue={props.onChangeValue}
          profile={props.profile}
          disabled={props.disabled}
        />
      );

    case 'date':
    case 'time':
    case 'datetime':
      return (
        <AttributeInputDateTime
          attribute={props.attribute}
          definition={props.definition}
          disabled={props.disabled}
          onBlurValue={props.onBlurValue}
          onChangeValue={props.onChangeValue}
        />
      );

    case 'reference':
      return (
        <AttributeInputReference
          attribute={props.attribute}
          definition={props.definition}
          disabled={props.disabled}
          isSet={props.isSet}
          onBlurValue={props.onBlurValue}
          onChangeValue={props.onChangeValue}
          onFocusValue={props.onFocusValue}
          selectedLanguage={props.selectedLanguage}
          languages={props.languages}
          setInvalidValueState={props.setInvalidValueState}
        />
      );

    case 'set':
      return <AttributeInputSet {...props} />;

    default:
      return null;
  }
};

AttributeInputByType.displayName = 'AttributeInputByType';
AttributeInputByType.propTypes = {
  attribute: PropTypes.object,
  definition: PropTypes.object,
  disabled: PropTypes.bool,
  isValid: PropTypes.bool,
  languages: PropTypes.arrayOf(PropTypes.string),
  onBlurValue: PropTypes.func,
  onChangeValue: PropTypes.func,
  level: PropTypes.number,
  // money, number
  numberFormat: PropTypes.string,

  // text, enum
  selectedLanguage: PropTypes.string,

  // text
  expandSettings: PropTypes.object,
  updateSettings: PropTypes.func,

  // enum
  isClearable: PropTypes.bool,

  // boolean, enum, money
  profile: PropTypes.oneOf(['form', 'filter']),

  // money
  className: PropTypes.string,
  currencies: PropTypes.arrayOf(PropTypes.string),

  isSet: PropTypes.bool,
  setInvalidValueState: PropTypes.func,
  onFocusValue: PropTypes.func,
  canEditNestedAttributes: PropTypes.bool,
};

export default AttributeInputByType;
