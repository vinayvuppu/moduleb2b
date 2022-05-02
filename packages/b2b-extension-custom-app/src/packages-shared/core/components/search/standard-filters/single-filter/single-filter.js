import PropTypes from 'prop-types';
import React from 'react';
import { ErrorMessage } from '@commercetools-frontend/ui-kit';
import styles from './single-filter.mod.css';

const SingleFilter = props => {
  return (
    <div>
      {props.renderInput({
        value: props.value,
        onUpdateValue: value =>
          props.onUpdateValue(value === '' ? null : value),
        hasError: Boolean(props.error),
        onBlur: (...args) => {
          if (props.onBlur) props.onBlur(...args);
        },
        onFocus: (...args) => {
          if (props.onFocus) props.onFocus(...args);
        },
        placeholder: props.placeholder,
      })}
      {props.error && (
        <div className={styles['error-container']}>
          <ErrorMessage>{props.error}</ErrorMessage>
        </div>
      )}
    </div>
  );
};
SingleFilter.displayName = 'SingleFilter';
SingleFilter.propTypes = {
  // function with signature:
  // ({
  //    value: String,
  //    onUpdateValue: Function,
  // })
  renderInput: PropTypes.func.isRequired,

  // triggers an update when the value changes
  onUpdateValue: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,

  value: PropTypes.any,

  error: PropTypes.string,

  placeholder: PropTypes.string,
};

export default SingleFilter;
