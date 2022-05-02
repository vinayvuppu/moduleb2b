import PropTypes from 'prop-types';
import React from 'react';
import Textarea from 'react-textarea-autosize';
import has from 'lodash.has';
import classnames from 'classnames';
import { filterDataAttributes } from '@commercetools-local/utils/dataset';
import styles from './throttled-field.mod.css';

class ThrottledField extends React.PureComponent {
  static displayName = 'ThrottledField';

  static propTypes = {
    autoComplete: PropTypes.string,
    onChange: PropTypes.func,
    onBlurValue: PropTypes.func,
    onEnter: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // Arbitrary time to delay network request in milliseconds.
    // Fast typists may not get UI feedback until they stop typing.
    throttleMS: PropTypes.number,
    isValid: PropTypes.bool,
    as: PropTypes.oneOf(['text', 'number', 'textarea', 'password']),
    style: PropTypes.oneOf(['primary', 'secondary']),
    disabled: PropTypes.bool,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    autoSize: PropTypes.bool,
    autoFocus: PropTypes.bool,
    inputRef: PropTypes.func,
  };

  static defaultProps = {
    as: 'text',
    style: 'secondary',
    throttleMS: 300,
    isValid: true,
    disabled: false,
    autoSize: true,
    autoFocus: false,
  };

  state = {
    draftValue:
      this.props.value || this.props.value === 0 ? this.props.value : '',
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!has(nextProps, 'value')) return;

    if (!nextProps.value && nextProps.value !== 0) {
      // let new value from props take precedence over pending updates
      this.clearPendingUpdates();
      this.setState({ draftValue: '' });
    } else if (nextProps.value !== this.state.draftValue) {
      // let new value from props take precedence over pending updates
      this.clearPendingUpdates();
      this.setState({ draftValue: nextProps.value });
    }
  }

  componentWillUnmount() {
    this.clearPendingUpdates();
  }

  clearPendingUpdates = () => {
    clearTimeout(this.changeTimeout);
    clearTimeout(this.blurTimeout);
    this.changeTimeout = null;
    this.blurTimeout = null;
  };

  handleChange = event => {
    // The `SyntheticEvent` is pooled by default for perf reasons.
    // See https://facebook.github.io/react/docs/events.html#event-pooling
    // To access the event in an async way we need to persist it.
    event.persist();
    this.setState({ draftValue: event.target.value });

    this.doDelayedUpdate(this.props.onChange, event, 'change');
  };

  handleEnter = event => {
    if (event.keyCode !== 13) return;

    if (this.changeTimeout) {
      // Since there are still are some pending updates that are not sent to the
      // parent yet we need to call the update here explicitly and clear the
      // pending updates
      this.props.onChange({ target: { value: this.state.draftValue } });
      // we can savely clear the timeout and thus abort all pending changes
      // because we just update the parent with the current state
      clearTimeout(this.changeTimeout);
      this.changeTimeout = null;
    }
    this.props.onEnter(this.state.draftValue);
  };

  handleBlur = event => {
    // The `SyntheticEvent` is pooled by default for perf reasons.
    // See https://facebook.github.io/react/docs/events.html#event-pooling
    // To access the event in an async way we need to persist it.
    if (this.props.onBlurValue) {
      event.persist();
      this.doDelayedUpdate(
        e => this.props.onBlurValue(e.target.value),
        event,
        'blur'
      );
    }
  };

  doDelayedUpdate = (updateFunction, event, eventType) => {
    const self = this;
    // TODO: can't we just use one variable?
    const timeoutKey = `${eventType}Timeout`;

    clearTimeout(this[timeoutKey]);

    this[timeoutKey] = setTimeout(() => {
      updateFunction.call(self, event);
      this[timeoutKey] = null;
    }, this.props.throttleMS);
  };

  render() {
    const commonProps = {
      value: this.state.draftValue,
      autoComplete: this.props.autoComplete,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      disabled: this.props.disabled,
      name: this.props.name,
      placeholder: this.props.placeholder,
      autoFocus: this.props.autoFocus,

      ...(this.props.onEnter ? { onKeyDown: this.handleEnter } : {}),

      ...filterDataAttributes(this.props),
    };

    if (this.props.as === 'textarea')
      return (
        <Textarea
          {...commonProps}
          className={classnames(
            styles.textarea,
            styles[`textarea-${this.props.style}`],
            {
              [styles.invalid]: !this.props.isValid,
              [styles.disabled]: this.props.disabled,
            }
          )}
          rows={1}
          maxRows={this.props.autoSize ? undefined : 1}
          useCacheForDOMMeasurements={true}
        />
      );

    return (
      <input
        {...commonProps}
        ref={this.props.inputRef}
        type={this.props.as}
        className={classnames(styles[`input-${this.props.style}`], {
          [styles.invalid]: !this.props.isValid,
          [styles.disabled]: this.props.disabled,
        })}
      />
    );
  }
}

export default ThrottledField;
