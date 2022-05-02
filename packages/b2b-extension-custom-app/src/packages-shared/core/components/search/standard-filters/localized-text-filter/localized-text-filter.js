import React from 'react';
import PropTypes from 'prop-types';
import { LocalizedTextInput } from '@commercetools-frontend/ui-kit';
import isNil from 'lodash.isnil';
import SingleFilter from '../single-filter';

export class LocalizedTextSingleFilter extends React.Component {
  static propTypes = {
    onUpdateFilter: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.object,
    error: PropTypes.any,
    selectedLanguage: PropTypes.string.isRequired,
  };
  static displayName = 'LocalizedTextSingleFilter';
  static defaultProps = {
    disabled: false,
  };
  render() {
    return (
      <SingleFilter
        renderInput={({ value, onUpdateValue, hasError, onBlur, onFocus }) =>
          renderInput({
            value,
            onUpdateValue,
            placeholder: this.props.placeholder,
            disabled: this.props.disabled,
            hasError,
            onBlur,
            onFocus,
            selectedLanguage: this.props.selectedLanguage,
          })
        }
        value={this.props.value}
        error={this.props.error}
        onUpdateValue={this.props.onUpdateFilter}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
      />
    );
  }
}

/* eslint-disable react/prop-types */
export function renderInput({
  value,
  onUpdateValue,
  placeholder,
  disabled,
  hasError,
  onBlur,
  onFocus,
  selectedLanguage,
}) {
  return (
    <LocalizedTextInput
      hasError={hasError}
      onChange={onUpdateValue}
      value={isNil(value) ? {} : value}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder={{ [selectedLanguage]: placeholder }}
      isDisabled={disabled}
      selectedLanguage={selectedLanguage}
    />
  );
}
renderInput.displayName = 'Input';
