import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';
import { ErrorMessage, Text } from '@commercetools-frontend/ui-kit';
import styles from './range-filter.mod.css';

const messages = defineMessages({
  and: {
    id: 'Search.Filters.RangeFilter.and',
    defaultMessage: 'and',
  },
});

export const processUpdateValue = newValue => {
  const processedValue = { ...newValue };
  if (newValue.to === '') processedValue.to = null;
  else if (newValue.from === '') processedValue.from = null;

  return processedValue;
};

const RangeFilter = props => (
  <div className={styles.range}>
    <div className={styles.container}>
      {props.renderInput({
        value: props.value ? props.value.from : undefined,
        /**
         * `onUpdateValue` will be called with an envent for new inputs,
         * and with the value for the old inputs.
         * Todo: change this to only event once all filters updated to use the new inputs
         * */
        onUpdateValue: eventOrNewValue =>
          props.onUpdateValue(
            processUpdateValue({
              from: eventOrNewValue.target
                ? eventOrNewValue.target.value
                : eventOrNewValue,
              to: props.value ? props.value.to : undefined,
            })
          ),
        hasError: Boolean(props.error && props.error.from),
        onBlur: (...args) => {
          if (props.onBlur) props.onBlur(...args);
        },
        onFocus: (...args) => {
          if (props.onFocus) props.onFocus(...args);
        },
      })}
      {props.error && props.error.from && (
        <div className={styles['error-container']}>
          <ErrorMessage>{props.error.from}</ErrorMessage>
        </div>
      )}
    </div>
    {/* TODO: this message should probably be overridable with a prop */}
    <Text.Body intlMessage={messages.and} />
    <div className={styles.container}>
      {props.renderInput({
        value: props.value ? props.value.to : undefined,
        /**
         * `onUpdateValue` will be called with an envent for new inputs,
         * and with the value for the old inputs.
         * Todo: change this to only event once all filters updated to use the new inputs
         * */
        onUpdateValue: eventOrNewValue =>
          props.onUpdateValue(
            processUpdateValue({
              from: props.value ? props.value.from : undefined,
              to: eventOrNewValue.target
                ? eventOrNewValue.target.value
                : eventOrNewValue,
            })
          ),
        hasError: Boolean(props.error && props.error.to),
        onBlur: (...args) => {
          if (props.onBlur) props.onBlur(...args);
        },
        onFocus: (...args) => {
          if (props.onFocus) props.onFocus(...args);
        },
      })}
      {props.error && props.error.to && (
        <div className={styles['error-container']}>
          <ErrorMessage>{props.error.to}</ErrorMessage>
        </div>
      )}
    </div>
  </div>
);
RangeFilter.displayName = 'RangeFilter';

RangeFilter.propTypes = {
  // function with signature:
  // ({
  //    value: String / Number,
  //    onUpdateValue: Function,
  // })
  renderInput: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,

  // triggers an update when the value changes
  onUpdateValue: PropTypes.func.isRequired,

  value: PropTypes.shape({
    from: PropTypes.any,
    to: PropTypes.any,
  }),

  error: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
  }),
};

export default RangeFilter;
