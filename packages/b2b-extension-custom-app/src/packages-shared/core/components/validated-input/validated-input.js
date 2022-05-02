import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { injectIntl } from 'react-intl';
import { oneLineTrim } from 'common-tags';
import { deepEqual } from 'fast-equals';
import has from 'lodash.has';
import isNil from 'lodash.isnil';
import warning from 'warning';
import * as numbers from '../../../utils/numbers';
import { messages } from '../../../utils/validation';
// FIXME: use uikit Tooltip!!
import Tooltip from '../tooltip';
import styles from './validated-input.mod.css';

// Note: don't use `g`! Regex with global flag have state
// and subsequent calls may give false results.
export const EMAIL_REGEX = /^[\wäöüÄÖÜß._%+-]+@[\wäöüÄÖÜß.-]+\.[A-Z]{2,}$/i;

export const getIsEvent = event =>
  typeof event === 'object' && !isNil(event.target);

const validateRequired = value => {
  let isValid = true;

  if (Array.isArray(value) && value.length === 0) isValid = false;
  else if (isNil(value)) isValid = false;

  return isValid;
};

export const VALIDATOR_REQUIRED = {
  name: 'required',
  message: messages.required,
  permanent: true,
  validators: {
    change(value) {
      if (!this.state.validStatus.required) return validateRequired(value);

      return this.state.validStatus.required;
    },
    blur(value) {
      return validateRequired(value);
    },
  },
};

export const VALIDATOR_NUMERIC = {
  name: 'numeric',
  message: messages.numeric,
  permanent: false,
  validators: {
    change: v => [undefined, null, ''].includes(v) || numbers.isNumberish(v),
    blur: v => [undefined, null, ''].includes(v) || numbers.isNumberish(v),
  },
};

export const VALIDATOR_INTEGER = {
  name: 'integer',
  message: messages.integer,
  permanent: false,
  validators: {
    change: v => [undefined, null, ''].includes(v) || numbers.isInteger(v),
    blur: v => [undefined, null, ''].includes(v) || numbers.isInteger(v),
  },
};

export const VALIDATOR_EMAIL = {
  name: 'email',
  message: messages.email,
  permanent: false,
  validators: {
    // Note: it's a bit weird to validate it on every change,
    // let's just validate it when the user blurs out of the input.
    blur(value) {
      return EMAIL_REGEX.test(value);
    },
  },
};

/**
 * This var is placed here to ensure that this component
 * has emitted a warning once in the logs, not for every instance
 */
let hasWarned = false;
export const warningMessage = oneLineTrim`
  \`validatedInput\` is no longer supported.
  Please use \`formik\` instead.
`;

export default function validatedInput(
  InnerComponent,
  validators,
  // Custom class names
  { containerClassName, tooltipContainerClassName } = {},
  // Callback handlers
  { changeHandler = null, blurHandler = null } = {}
) {
  let _InnerComponent = InnerComponent;

  if (typeof InnerComponent === 'string')
    _InnerComponent = simpleInput(InnerComponent);

  const _validators = [];
  const _initialValidState = {};

  validators.forEach(v => {
    _validators.push(v);
    _initialValidState[v.name] = true;
  });

  class ValidatedInput extends React.PureComponent {
    static displayName = `ValidatedInput(${_InnerComponent.displayName})`;

    static propTypes = {
      onChange: PropTypes.func,
      onBlurValue: PropTypes.func,
      attribute: PropTypes.object,
      value: PropTypes.any,
      // This props is forwarded to <input /> of `simpleInput`
      // ref: https://reactjs.org/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components
      getInputRef: PropTypes.func,
      // A passthrough by the parent.
      // In the context of SET,
      // the value within in the input can be deemed valid by the validators,
      // but still invalid if it were e.g a duplicated value
      isValid: PropTypes.bool,

      // injectIntl
      intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired,
      }).isRequired,
    };

    static defaultProps = {
      isValid: true,
      getInputRef: () => {},
    };

    state = { validStatus: _initialValidState };
    componentDidMount() {
      warning(hasWarned, warningMessage);
      hasWarned = true;
    }
    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
      if (
        (nextProps.attribute && nextProps.attribute.value) ||
        nextProps.value
      ) {
        this.resetValidity();
        this.handleChange(nextProps.value, { triggerUpdate: false });
      }
    }

    conditionalSetValidStatus = nextValidStatus => {
      if (!deepEqual(this.state.validStatus, nextValidStatus)) {
        this.setState({ validStatus: nextValidStatus });
      }
    };

    handleChange = (event, { triggerUpdate = true } = {}) => {
      let value = '';
      const nextValidStatus = {};
      const onChange =
        (changeHandler && this.props[changeHandler]) || this.props.onChange;

      // If the actual event is passed, validate the value
      if (getIsEvent(event)) value = event.target.value;
      else value = event;

      _validators.forEach(v => {
        if (v.validators.change)
          nextValidStatus[v.name] = v.validators.change.call(this, value);
        else nextValidStatus[v.name] = true;
      });

      if (onChange && triggerUpdate) onChange(event);

      this.conditionalSetValidStatus(nextValidStatus);
    };

    /**
     * Only triggers when there is a value, but its not valid
     * so it must be an invalid numeric value
     */
    handleInvalid = () => {
      const nextValidStatus = { ...this.state.validStatus };

      if (has(nextValidStatus, 'numeric')) {
        nextValidStatus.numeric = false;
        this.conditionalSetValidStatus(nextValidStatus);
      }
    };

    handleBlur = event => {
      let value = '';
      const nextValidStatus = {};
      const onBlur =
        (blurHandler && this.props[blurHandler]) || this.props.onBlurValue;

      // If the actual event is passed, validate the value
      if (getIsEvent(event)) value = event.target.value;
      else value = event;

      _validators.forEach(v => {
        if (v.validators.blur)
          nextValidStatus[v.name] = v.validators.blur.call(this, value);
        else nextValidStatus[v.name] = true;
      });

      if (onBlur) onBlur(event);

      this.conditionalSetValidStatus(nextValidStatus);
    };

    resetValidity = () => {
      const nextValidStatus = {};

      _validators.forEach(v => {
        nextValidStatus[v.name] = true;
      });

      this.conditionalSetValidStatus(nextValidStatus);
    };

    render() {
      const isValid = _validators.reduce((prev, v) => {
        if (prev) return this.state.validStatus[v.name];
        return prev;
      }, true);

      const componentProps = {
        ...this.props,
        [blurHandler || 'onBlurValue']: this.handleBlur,
        [changeHandler || 'onChange']: this.handleChange,
        onInvalidValue: this.handleInvalid,
        isValid: this.props.isValid && isValid,
        getInputRef: this.props.getInputRef,
      };

      const firstFailedValidator = _validators.find(
        v => !this.state.validStatus[v.name]
      );

      const tooltipProps = {
        position: 'top',
        className: tooltipContainerClassName,
        trigger: 'force',
        display: !isValid,
        autohide: {
          enabled: firstFailedValidator && !firstFailedValidator.permanent,
          timeout: 5000,
          onHide: this.resetValidity,
        },
        message:
          (firstFailedValidator &&
            this.props.intl.formatMessage(firstFailedValidator.message)) ||
          '',
      };

      return (
        <div className={classnames(styles.container, containerClassName)}>
          <Tooltip {...tooltipProps}>
            <_InnerComponent {...componentProps} />
          </Tooltip>
        </div>
      );
    }
  }

  return injectIntl(ValidatedInput);
}

export function simpleInput(type) {
  return class extends React.PureComponent {
    static displayName = 'SimpleInput';

    static propTypes = {
      className: PropTypes.string,
      disabled: PropTypes.bool,
      isValid: PropTypes.bool.isRequired,
      name: PropTypes.string,
      getInputRef: PropTypes.func,
      onBlurValue: PropTypes.func,
      onChange: PropTypes.func.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    };

    static defaultProps = {
      getInputRef: () => {},
      name: 'simple-validated-input',
    };

    handleBlur = event => {
      if (this.props.onBlurValue) this.props.onBlurValue(event.target.value);
    };

    render() {
      return (
        <input
          className={classnames(this.props.className, {
            [styles.invalid]: !this.props.isValid,
          })}
          name={this.props.name}
          disabled={this.props.disabled}
          ref={this.props.getInputRef}
          value={this.props.value === undefined ? '' : this.props.value}
          type={type}
          onBlur={this.handleBlur}
          onChange={this.props.onChange}
        />
      );
    }
  };
}
