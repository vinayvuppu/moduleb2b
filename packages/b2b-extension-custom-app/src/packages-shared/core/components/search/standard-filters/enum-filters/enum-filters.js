import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { SelectInput } from '@commercetools-frontend/ui-kit';
import SingleFilter from '../single-filter';
import RangeFilter from '../range-filter';
import styles from './enum-filters.mod.css';

export const createEnumSingleFilter = ({
  options,
  isMulti = false,
  isSearchable = false,
}) => {
  const EnumSingleFilter = props => (
    <SingleFilter
      renderInput={({ value, onUpdateValue, onBlur, onFocus }) =>
        renderInput({
          value,
          onUpdateValue,
          options,
          placeholder: props.placeholder,
          className: props.className,
          components: props.components,
          autofocus: props.autofocus,
          disabled: props.disabled,
          isSearchable,
          isMulti,
          onBlur,
          onFocus,
          optionsOverride: props.options,
        })
      }
      value={props.value}
      error={props.error}
      onUpdateValue={props.onUpdateFilter}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
    />
  );
  EnumSingleFilter.defaultProps = {
    disabled: false,
  };
  EnumSingleFilter.propTypes = {
    onUpdateFilter: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      })
    ),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      }),
      PropTypes.shape({
        from: PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
        }),
        to: PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
        }),
      }),
    ]),
    disabled: PropTypes.bool,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    error: PropTypes.any,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    autofocus: PropTypes.bool,
    components: PropTypes.object,
  };
  EnumSingleFilter.displayName = 'EnumSingleFilter';
  return EnumSingleFilter;
};

export const createEnumRangeFilter = ({ options }) => {
  const EnumRangeFilter = props => (
    <RangeFilter
      renderInput={({ value, onUpdateValue }) =>
        renderInput({
          value,
          onUpdateValue,
          options,
        })
      }
      value={props.value}
      onUpdateValue={props.onUpdateFilter}
    />
  );
  EnumRangeFilter.propTypes = {
    onUpdateFilter: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      }),
      PropTypes.shape({
        from: PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
        }),
        to: PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
        }),
      }),
    ]),
    disabled: PropTypes.bool,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };
  EnumRangeFilter.displayName = 'EnumRangeFilter';
  return EnumRangeFilter;
};

/* In case of the multi selection we need the function because
 *  the `value` could be
 *  1. An array
 *  2. An object with an array attribute called `value`
 *  3. Could be `null`, in which case we need to pass an empty array
 *     to SelectInput
 */
const parseMultiValueForSelectInput = value =>
  Array.isArray(value) ? value : value?.value || [];

/* In case of the single selection we need the function because
 *  the `value` could be
 *  1. `null`
 *  2. A string
 *  3. An object with a string attribute called `value`
 */
const parseSingleValueForSelectInput = value => {
  if (!value) return value;
  return value.value ? `${value.value}` : `${value}`;
};

/* eslint-disable react/prop-types */
export function renderInput({
  value = '',
  onUpdateValue,
  placeholder,
  autofocus,
  className,
  options, // array of { value, label } objects
  isMulti,
  isSearchable,
  disabled,
  onBlur,
  onFocus,
  components,
  optionsOverride,
}) {
  return (
    <div
      className={classnames(
        className,
        isMulti ? styles['select-multi'] : styles.select
      )}
    >
      <SelectInput
        options={optionsOverride?.length ? optionsOverride : options}
        isClearable={false}
        backspaceRemovesValue={false}
        isSearchable={isSearchable}
        value={
          isMulti
            ? parseMultiValueForSelectInput(value)
            : parseSingleValueForSelectInput(value)
        }
        onChange={event => onUpdateValue(event.target)}
        placeholder={placeholder}
        isDisabled={disabled}
        onBlur={onBlur}
        onFocus={onFocus}
        autofocus={autofocus}
        isMulti={isMulti}
        components={components}
      />
    </div>
  );
}
renderInput.displayName = 'Input';
