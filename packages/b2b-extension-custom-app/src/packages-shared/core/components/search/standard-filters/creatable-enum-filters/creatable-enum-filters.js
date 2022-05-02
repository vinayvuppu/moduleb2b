import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { CreatableSelectInput } from '@commercetools-frontend/ui-kit';
import SingleFilter from '../single-filter';
import styles from './creatable-enum-filters.mod.css';

export const createCreatableEnumSingleFilter = ({ placeholder = '' }) => {
  const CreatableEnumSingleFilter = props => (
    <SingleFilter
      renderInput={({ value, onUpdateValue, onBlur, onFocus }) =>
        renderInput({
          value,
          onUpdateValue,
          placeholder: placeholder || props.placeholder,
          className: props.className,
          components: props.components,
          autofocus: props.autofocus,
          disabled: props.disabled,
          onBlur,
          onFocus,
        })
      }
      value={props.value}
      error={props.error}
      onUpdateValue={props.onUpdateFilter}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
    />
  );
  CreatableEnumSingleFilter.defaultProps = {
    disabled: false,
  };
  CreatableEnumSingleFilter.propTypes = {
    onUpdateFilter: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      })
    ),
    disabled: PropTypes.bool,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    error: PropTypes.any,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    autofocus: PropTypes.bool,
    components: PropTypes.object,
  };
  CreatableEnumSingleFilter.displayName = 'CreatableEnumSingleFilter';
  return CreatableEnumSingleFilter;
};

/* eslint-disable react/prop-types */
export function renderInput({
  value = '',
  onUpdateValue,
  placeholder,
  autofocus,
  className,
  disabled,
  onBlur,
  onFocus,
  components,
}) {
  return (
    <div className={classnames(className, styles['select-multi'])}>
      <CreatableSelectInput
        name="creatable-enum-filters"
        isClearable={true}
        backspaceRemovesValue={true}
        value={value}
        onChange={onUpdateValue}
        placeholder={placeholder}
        isDisabled={disabled}
        onBlur={onBlur}
        onFocus={onFocus}
        autofocus={autofocus}
        isMulti={true}
        components={components}
      />
    </div>
  );
}
renderInput.displayName = 'Input';
