import React from 'react';
import PropTypes from 'prop-types';
import { NumberInput } from '@commercetools-frontend/ui-kit';
import validatedInput, {
  VALIDATOR_NUMERIC,
  VALIDATOR_INTEGER,
} from '../../../validated-input';
import SingleFilter from '../single-filter';
import RangeFilter from '../range-filter';

export const createNumberSingleFilter = ({
  numberFormat,
  allowFloat = true,
  warnings = [],
}) => {
  const ValidatedNumericFormatInput = validatedInput(
    NumberInput,
    [allowFloat ? VALIDATOR_NUMERIC : VALIDATOR_INTEGER, ...warnings],
    // No custom classnames
    {},
    { changeHandler: 'onChange' }
  );
  const NumberSingleFilter = props => (
    <SingleFilter
      renderInput={({
        value,
        onUpdateValue,
        hasError,
        onBlur,
        onFocus,
        placeholder,
      }) =>
        renderInput({
          value,
          onUpdateValue,
          hasError,
          numberFormat,
          InputComponent: ValidatedNumericFormatInput,
          disabled: props.disabled,
          onBlur,
          onFocus,
          placeholder,
        })
      }
      value={props.value}
      error={props.error}
      placeholder={props.placeholder}
      onUpdateValue={props.onUpdateFilter}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
    />
  );
  NumberSingleFilter.defaultProps = {
    disabled: false,
  };
  NumberSingleFilter.propTypes = {
    onUpdateFilter: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        from: PropTypes.string,
        to: PropTypes.string,
      }),
    ]),
    disabled: PropTypes.bool,
    error: PropTypes.any,
    placeholder: PropTypes.string,
  };
  NumberSingleFilter.displayName = 'NumberSingleFilter';
  return NumberSingleFilter;
};

export const createNumberRangeFilter = ({
  numberFormat,
  allowFloat = true,
  warnings = [],
}) => {
  const ValidatedNumericFormatInput = validatedInput(
    NumberInput,
    [allowFloat ? VALIDATOR_NUMERIC : VALIDATOR_INTEGER, ...warnings],
    'top',
    { changeHandler: 'onChange' }
  );
  const NumberRangeFilter = props => (
    <RangeFilter
      renderInput={({
        value,
        onUpdateValue,
        hasError,
        onBlur,
        onFocus,
        placeholder,
      }) =>
        renderInput({
          value,
          onUpdateValue,
          numberFormat,
          hasError,
          InputComponent: ValidatedNumericFormatInput,
          onBlur,
          onFocus,
          placeholder,
        })
      }
      value={props.value}
      error={props.error}
      onUpdateValue={props.onUpdateFilter}
    />
  );
  NumberRangeFilter.propTypes = {
    onUpdateFilter: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        from: PropTypes.string,
        to: PropTypes.string,
      }),
    ]),
    disabled: PropTypes.bool,
    error: PropTypes.any,
  };
  NumberRangeFilter.displayName = 'NumberRangeFilter';
  return NumberRangeFilter;
};

/* eslint-disable react/prop-types */
export function renderInput({
  value = '',
  onUpdateValue,
  hasError,
  InputComponent,
  disabled,
  onBlur,
  onFocus,
  placeholder,
}) {
  return (
    <InputComponent
      name="number-filter"
      onChange={onUpdateValue}
      value={value}
      hasError={hasError}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder={placeholder}
      isDisabled={disabled}
    />
  );
}
renderInput.displayName = 'Input';
