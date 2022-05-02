import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { filterDataAttributes } from '@commercetools-local/utils/dataset';
import styles from './button.mod.css';

const Button = props => {
  const { className, onClick, isDisabled, children } = props;

  // Pass only `data-*` props
  const dataProps = filterDataAttributes(props);

  return (
    <button
      onClick={isDisabled ? null : onClick}
      type={props.type}
      className={classnames(
        styles.button,
        isDisabled ? styles.disabled : null,
        className
      )}
      disabled={isDisabled}
      {...dataProps}
    >
      {children}
    </button>
  );
};
Button.displayName = 'Button';
Button.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};
Button.defaultProps = {
  type: 'button',
};

export default Button;
