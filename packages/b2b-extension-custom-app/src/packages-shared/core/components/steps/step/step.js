import PropTypes from 'prop-types';
import React from 'react';
import requiredIf from 'react-required-if';
import classnames from 'classnames';
import {
  CheckThinIcon,
  AccessibleButton,
} from '@commercetools-frontend/ui-kit';
import styles from './step.mod.css';

export const Step = props => (
  <li
    className={classnames(styles['header-list-item'], {
      [styles['header-list-item--active']]: props.isActive,
      [styles['header-list-item--done']]: props.isDone,
    })}
  >
    <AccessibleButton
      type="button"
      className={styles['header-list-item-button']}
      label={props.label}
      isDisabled={!props.isDone || !props.isClickable}
      onClick={props.onClick}
    >
      <div className={styles[`bullet-container-${props.skin}`]}>
        <div className={styles.bullet}>
          {props.isDone ? (
            <CheckThinIcon color="surface" size="medium" />
          ) : (
            props.index + 1
          )}
        </div>
      </div>
      <span className={styles[`tab-text-${props.skin}`]}>{props.label}</span>
    </AccessibleButton>
  </li>
);

Step.displayName = 'Step';
Step.propTypes = {
  isClickable: PropTypes.bool,
  index: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  isDone: PropTypes.bool,
  onClick: requiredIf(PropTypes.func, props => props.isClickable),
  skin: PropTypes.oneOf(['grey', 'white']),
};

Step.defaultProps = {
  isClickable: false,
  onClick: () => {},
  skin: 'grey',
};

export default Step;
