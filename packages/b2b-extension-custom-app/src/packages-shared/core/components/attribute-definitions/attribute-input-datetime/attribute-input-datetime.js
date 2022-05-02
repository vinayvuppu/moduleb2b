// I hereby declare this the most confusing file of the MC.
// If you plan to tackle this, get a pair programming buddy for moral support.
//
// We need to render multiple components to work around validatedInput and
// the fact that we're not using Formik here yet.
// We need to only pass valid and formatted values or empty strings up from our
// date inputs, which were build with a completely different paradigm in mind.
// They are built on the assumption that the parent form always keeps the form
// values. But here we need the parent to work with the actual values.
// Luckily, DateInput and DateTimeInput already make this assumption for
// convenience anyways. However, TimeInput does not. So we need to get TimeInput
// to only call the parent with valid times or an empty string.
// We therefore store the invalid values inside of WellBehavedTimeInput's state
// and use onBlur to call the parent with the underlying value or an empty
// string. When the parent then calls us with the new value, we format it back.
//
// This whole file is workaround on top of workaround. We can remove all that
// once the product details are actualy refactored to Formik!
//
// Instead of one `AttributeInputDateTime` we should have one dedicated
// component for each type which would make this whole thing less confusing
// as well:
//   - AttributeInputDateTime for datetime
//   - AttributeInputDate for date
//   - AttributeInputTime for time
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import omit from 'lodash.omit';
import isEmpty from 'lodash.isempty';
import { ApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  DateTimeInput,
  DateInput,
  TimeInput,
} from '@commercetools-frontend/ui-kit';
import validatedInput, { VALIDATOR_REQUIRED } from '../../validated-input';

const getElementType = attributeType => {
  switch (attributeType.name) {
    case 'date':
    case 'time':
    case 'datetime':
      return attributeType.name;
    case 'set':
      return getElementType(attributeType.elementType);
    default:
      throw new Error(
        `The element type ${attributeType.name} is not supported, expected "date", "time", "datetime"`
      );
  }
};

// A version of TimeInput which only calls the parent with either an empty
// string or a valid value - that's whay it's well behaved.
// We only need this because this form is not using Formik, and because
// this form is using validatedInput() 😡
class WellBehavedTimeInput extends React.Component {
  static displayName = 'WellBehavedTimeInput';
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
  };
  state = {
    value: this.props.value,
  };
  render() {
    return (
      <TimeInput
        {...omit(this.props, ['isValid'])}
        onChange={event => {
          this.setState({ value: event.target.value });
        }}
        onBlur={event => {
          const adjustedEvent = {
            ...event,
            target: {
              ...event.target,
              value: TimeInput.to24h(this.state.value),
            },
          };
          this.props.onChange(adjustedEvent);
          this.props.onBlur(adjustedEvent);
        }}
        value={this.state.value}
        isDisabled={this.props.disabled}
        hasError={
          this.props.isValid === undefined ? false : !this.props.isValid
        }
      />
    );
  }
}

// ProxyDatePicker is quite the mix as it:
// - maps isValid to isInvalid
// - switches between DateInput, DateTimeInput and TimeInput
// - Applies the time-zone
export const ProxyDatePicker = props => {
  const timeScale = getElementType(props.definition.type);
  const intl = useIntl();
  switch (timeScale) {
    case 'date':
      return (
        <DateInput
          {...props}
          onChange={props.onChange}
          onBlur={props.onBlur}
          isDisabled={props.disabled}
          hasError={props.isValid === undefined ? false : !props.isValid}
        />
      );
    case 'datetime':
      return (
        <DateTimeInput
          {...props}
          timeZone={props.timeZone}
          onChange={props.onChange}
          onBlur={props.onBlur}
          isDisabled={props.disabled}
          hasError={props.isValid === undefined ? false : !props.isValid}
        />
      );
    case 'time':
      return (
        <WellBehavedTimeInput
          {...props}
          value={TimeInput.toLocaleTime(props.value || '', intl.locale)}
        />
      );
    default:
      throw new Error(
        `The time scale ${timeScale} is not supported, expected "date", "time", "datetime"`
      );
  }
};

ProxyDatePicker.propTypes = {
  timeZone: PropTypes.string.isRequired,
  definition: PropTypes.shape({
    type: PropTypes.shape({
      name: PropTypes.oneOf(['date', 'datetime', 'time', 'set']),
    }).isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};
ProxyDatePicker.displayName = 'ProxyDatePicker';

export const RequiredDatePicker = validatedInput(ProxyDatePicker, [
  VALIDATOR_REQUIRED,
]);

// The component name is a lie. This is actually the AttributeInput for
// DateTime, Date and Time all at once!
export default class AttributeInputDateTime extends React.PureComponent {
  static displayName = 'AttributeInputDateTime';
  static propTypes = {
    attribute: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string,
    }).isRequired,
    definition: PropTypes.shape({
      type: PropTypes.shape({
        name: PropTypes.oneOf(['date', 'datetime', 'time', 'set']),
      }),
      isRequired: PropTypes.bool.isRequired,
    }).isRequired,
    disabled: PropTypes.bool,
    onBlurValue: PropTypes.func,
    onChangeValue: PropTypes.func.isRequired,
  };

  handleChange = event => {
    this.props.onChangeValue({
      name: this.props.attribute.name,
      // If date value is an empty string it should be passed into update
      // function as undefined to trigger deletion of the value
      // rather than attempting to set the value of the date to an empty string
      // (which triggers an error)
      value: isEmpty(event.target.value) ? undefined : event.target.value,
    });
  };

  handleBlur = value => {
    if (this.props.onBlurValue) this.props.onBlurValue(value);
  };

  render() {
    const DateTimePickerComponent = this.props.definition.isRequired
      ? RequiredDatePicker
      : ProxyDatePicker;
    return (
      <ApplicationContext
        render={({ user }) => (
          <DateTimePickerComponent
            {...this.props}
            timeZone={user.timeZone}
            value={this.props.attribute.value || ''}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
          />
        )}
      />
    );
  }
}
