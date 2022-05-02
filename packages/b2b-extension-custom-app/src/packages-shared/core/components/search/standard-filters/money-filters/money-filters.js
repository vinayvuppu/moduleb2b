import React from 'react';
import PropTypes from 'prop-types';
import { MoneyInput } from '@commercetools-frontend/ui-kit';
import SingleFilter from '../single-filter';
import RangeFilter from '../range-filter';

const MONEY_FILTER_NAME = 'moneyFilter';

export const createMoneySingleFilter = () => {
  const MoneySingleFilter = props => (
    <SingleFilter
      renderInput={({ value, onUpdateValue, hasError, onBlur }) =>
        renderInput({
          value,
          onUpdateValue,
          hasError,
          disabled: props.disabled,
          placeholder: props.placeholder,
          onBlur,
        })
      }
      value={props.value}
      error={props.error}
      placeholder={props.placeholder}
      onUpdateValue={props.onUpdateFilter}
      onBlur={props.onBlur}
    />
  );
  MoneySingleFilter.defaultProps = {
    disabled: false,
  };
  MoneySingleFilter.propTypes = {
    onUpdateFilter: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    value: PropTypes.shape({
      currencyCode: PropTypes.string,
      amount: PropTypes.string,
    }),
    disabled: PropTypes.bool,
    error: PropTypes.string,
    placeholder: PropTypes.string,
  };
  MoneySingleFilter.displayName = 'MoneySingleFilter';
  return MoneySingleFilter;
};

export const createMoneyRangeFilter = () => {
  const MoneyRangeFilter = props => (
    <RangeFilter
      renderInput={({ value, onUpdateValue, hasError, onBlur }) =>
        renderInput({
          value,
          onUpdateValue,
          hasError,
          disabled: props.disabled,
          placeholder: props.placeholder,
          onBlur,
        })
      }
      value={props.value}
      error={props.error}
      placeholder={props.placeholder}
      onUpdateValue={props.onUpdateFilter}
      onBlur={props.onBlur}
    />
  );
  MoneyRangeFilter.defaultProps = {
    disabled: false,
  };
  MoneyRangeFilter.propTypes = {
    onUpdateFilter: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    value: PropTypes.shape({
      from: PropTypes.shape({
        currencyCode: PropTypes.string,
        amount: PropTypes.string,
      }),
      to: PropTypes.shape({
        currencyCode: PropTypes.string,
        amount: PropTypes.string,
      }),
    }),
    disabled: PropTypes.bool,
    error: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
    placeholder: PropTypes.string,
  };
  MoneyRangeFilter.displayName = 'MoneyRangeFilter';
  return MoneyRangeFilter;
};

/*
  MoneyInput calls onChange function using either ${inputName}.currencyCode
  or ${inputName}.amount as name depending on which have changed
*/
const getMoneyInputChange = (nextValue, currentValue) => {
  const { name, value } = nextValue.target;
  return {
    ...currentValue,
    [`${name.split('.')[1]}`]: value,
  };
};

/* eslint-disable react/prop-types */
export function renderInput({
  value,
  onUpdateValue,
  hasError,
  disabled,
  onBlur,
  placeholder,
}) {
  const { currencyCode, amount, currencies = [] } = value;
  return (
    <MoneyInput
      name={MONEY_FILTER_NAME}
      value={{ currencyCode, amount }}
      onChange={nextValue =>
        onUpdateValue({
          ...getMoneyInputChange(nextValue, value),
          currencies,
        })
      }
      onBlur={onBlur}
      currencies={currencies}
      placeholder={placeholder}
      isDisabled={disabled}
      hasError={hasError}
    />
  );
}
renderInput.displayName = 'Input';
