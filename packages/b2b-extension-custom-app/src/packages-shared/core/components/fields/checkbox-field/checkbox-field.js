import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { filterDataAttributes } from '@commercetools-local/utils/dataset';
import styles from './checkbox-field.mod.css';

const CheckboxField = props => {
  // Pass only `data-*` props
  const dataAttributes = filterDataAttributes(props);

  return (
    <label
      className={classnames(props.labelClassName, styles['custom-check'], {
        [styles.disabled]: props.disabled,
      })}
      {...dataAttributes}
    >
      <input
        type="checkbox"
        className={classnames(props.inputClassName, styles['input-checkbox'], {
          [styles.disabled]: props.disabled,
        })}
        name={props.name}
        checked={props.checked}
        onChange={props.onChange}
        disabled={props.disabled}
      />
      <span className={styles['check-element']} />
      {props.label ? (
        <span className={styles['check-text']}>{props.label}</span>
      ) : null}
    </label>
  );
};
CheckboxField.displayName = 'CheckboxField';
CheckboxField.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onChange: PropTypes.func,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  disabled: PropTypes.bool,
};

CheckboxField.defaultProps = {
  onChange: () => {},
  disabled: false,
};

export default CheckboxField;
