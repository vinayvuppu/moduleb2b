import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import requiredIf from 'react-required-if';
import startCase from 'lodash.startcase';
import { ButtonCancel, ButtonSave, ButtonConfirm } from '../buttons';
import styles from '../save-toolbar/save-toolbar.mod.css';

const messages = defineMessages({
  back: {
    id: 'SaveToolbarSteps.back',
    description: 'The label of the button (back)',
    defaultMessage: 'Back',
  },
  next: {
    id: 'SaveToolbarSteps.next',
    description: 'The label of the button (next)',
    defaultMessage: 'Next',
  },
});

export const SaveToolbarButton = props => {
  const { buttonProps: customButtonProps, currentStep, type, onClick } = props;
  const intl = useIntl();

  const buttonProps = {
    'data-step': currentStep,
    'data-track-event': 'click',
    'data-track-label': startCase(type),
    onClick,
    ...customButtonProps,
  };

  if (type === 'cancel')
    return <ButtonCancel {...buttonProps} style="alternative" />;

  if (type === 'save')
    return <ButtonSave style="alternative" {...buttonProps} />;

  if (type === 'next')
    return (
      <ButtonConfirm
        {...buttonProps}
        style="alternative"
        label={intl.formatMessage(messages[type])}
      />
    );

  if (type === 'back')
    return (
      <ButtonCancel
        {...buttonProps}
        style="alternative"
        label={intl.formatMessage(messages[type])}
      />
    );

  return null;
};
SaveToolbarButton.displayName = 'SaveToolbarButton';
SaveToolbarButton.propTypes = {
  currentStep: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  buttonProps: PropTypes.object,
};

export class SaveToolbarSteps extends React.PureComponent {
  static displayName = 'SaveToolbarSteps';
  static propTypes = {
    buttonProps: PropTypes.shape({
      cancel: PropTypes.object,
      back: PropTypes.object,
      next: PropTypes.object,
      save: PropTypes.object,
    }),
    isVisible: PropTypes.bool,
    currentStep: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
    onSave: requiredIf(
      PropTypes.func,
      props => props.currentStep === props.totalSteps
    ),
    onNext: requiredIf(
      PropTypes.func,
      props => props.currentStep !== props.totalSteps
    ),
    onBack: requiredIf(PropTypes.func, props => props.currentStep > 1),
    onCancel: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isVisible: false,
    buttonProps: {},
  };

  render() {
    if (!this.props.isVisible) return null;
    return (
      <div
        className={styles.container}
        data-track-component="Save Toolbar Steps"
      >
        <ul className={styles['list-left']}>
          <li className={styles['list-item']}>
            <SaveToolbarButton
              {...{
                buttonProps: this.props.buttonProps.cancel,
                currentStep: this.props.currentStep,
                type: 'cancel',
                onClick: this.props.onCancel,
              }}
            />
          </li>
        </ul>
        <ul className={styles['list-right']}>
          {this.props.currentStep > 1 ? (
            <li className={styles['list-item']}>
              <SaveToolbarButton
                {...{
                  buttonProps: this.props.buttonProps.back,
                  currentStep: this.props.currentStep,
                  type: 'back',
                  onClick: this.props.onBack,
                }}
              />
            </li>
          ) : null}
          <li className={styles['list-item']}>
            {this.props.currentStep !== this.props.totalSteps ? (
              <SaveToolbarButton
                buttonProps={this.props.buttonProps.next}
                currentStep={this.props.currentStep}
                type={'next'}
                onClick={this.props.onNext}
              />
            ) : (
              <SaveToolbarButton
                buttonProps={this.props.buttonProps.save}
                currentStep={this.props.currentStep}
                type={'save'}
                onClick={this.props.onSave}
              />
            )}
          </li>
        </ul>
      </div>
    );
  }
}

export default SaveToolbarSteps;
