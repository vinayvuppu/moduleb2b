import PropTypes from 'prop-types';
import React from 'react';
import { IconButton } from '@commercetools-frontend/ui-kit';
import styles from './actionable-cell.mod.css';

export const ActionableCell = ({
  value,
  onClick,
  icon,
  label,
  actionPosition,
}) => (
  <div className={styles['action-cell']}>
    {actionPosition === 'left' && (
      <div className={styles['button-left']}>
        <IconButton
          label={label}
          onClick={onClick}
          icon={icon}
          size="medium"
          data-track-component="ActionableCell"
          data-track-event="click"
        />
      </div>
    )}
    <div className={styles.text}>
      <span>{value}</span>
    </div>
    {actionPosition === 'right' && (
      <div className={styles['button-right']}>
        <IconButton
          label={label}
          onClick={onClick}
          icon={icon}
          size="medium"
          data-track-component="ActionableCell"
          data-track-event="click"
        />
      </div>
    )}
  </div>
);
ActionableCell.displayName = 'ActionableCell';
ActionableCell.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element,
  ]).isRequired,
  icon: PropTypes.node,
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  actionPosition: PropTypes.oneOf(['right', 'left']),
};

ActionableCell.defaultProps = {
  actionPosition: 'right',
};

export default ActionableCell;
