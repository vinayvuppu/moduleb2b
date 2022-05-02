import PropTypes from 'prop-types';
import React from 'react';
import Step from '../step';
import styles from './steps.mod.css';

export const Steps = props => {
  const activeStepIndex = props.steps.findIndex(
    step => step.key === props.activeStepKey
  );
  return (
    <div className={styles['header-list']}>
      {props.steps.map((step, index) => (
        <Step
          isClickable={step.isClickable}
          key={step.key}
          label={step.label}
          onClick={step.onClick}
          isDone={index < activeStepIndex}
          isActive={props.activeStepKey === step.key}
          index={index}
          skin={props.skin}
        />
      ))}
    </div>
  );
};

Steps.displayName = 'Steps';
Steps.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      isClickable: PropTypes.bool,
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    })
  ).isRequired,
  activeStepKey: PropTypes.string.isRequired,
  skin: PropTypes.oneOf(['grey', 'white']),
};

Steps.defaultProps = {
  skin: 'grey',
};

export default Steps;
