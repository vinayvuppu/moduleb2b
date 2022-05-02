import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import Button from '../button';
import styles from '../button/button.mod.css';
import customStyles from './button-toggle-value.mod.css';

// TODO: this is only used by `MasterVariantButton`. Remove once we migrate that
// button to `SecondaryButton`.
// https://jira.commercetools.com/browse/MCD-781
export const ButtonToggleValue = ({
  isActive,
  isDisabled,
  onClick,
  label,
  icon,
  containerType,
}) => (
  <Button
    isDisabled={isActive || isDisabled}
    onClick={onClick}
    className={classnames(
      styles[
        isActive ? `switch-${containerType}--active` : `switch-${containerType}`
      ],
      customStyles.container
    )}
    data-track-component="ButtonToggleValue"
    data-track-event="click"
  >
    {icon}
    <span className={styles['switch-label']}>{label}</span>
  </Button>
);
ButtonToggleValue.displayName = 'ButtonToggleValue';
ButtonToggleValue.propTypes = {
  isDisabled: PropTypes.bool,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
  icon: PropTypes.element.isRequired,
  containerType: PropTypes.oneOf(['squared', 'rounded']),
};

ButtonToggleValue.defaultProps = {
  isDisabled: false,
  isActive: false,
  containerType: 'squared',
};

export default ButtonToggleValue;
