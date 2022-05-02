import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import classnames from 'classnames';
import isNumber from 'lodash.isnumber';
import { SelectInput } from '@commercetools-frontend/ui-kit';
import shouldUpdateAttributeInput from '../../../../utils/should-update-attribute-input';
import { messages as dropdownMessages } from '../../dropdowns/dropdown';
import NumericFormatInput from '../../fields/numeric-format-input';
import validatedInput, {
  VALIDATOR_REQUIRED,
  VALIDATOR_NUMERIC,
} from '../../validated-input';
import styles from './attribute-input-money.mod.css';

const RequiredNumericFormatInput = validatedInput(NumericFormatInput, [
  VALIDATOR_REQUIRED,
  VALIDATOR_NUMERIC,
]);
export const ValidatedNumericFormatInput = validatedInput(NumericFormatInput, [
  VALIDATOR_NUMERIC,
]);

export class AttributeInputMoney extends React.Component {
  static displayName = 'AttributeInputMoney';

  static propTypes = {
    attribute: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.any,
    }),
    // For custom styles
    className: PropTypes.string,
    currencies: PropTypes.array.isRequired,
    definition: PropTypes.shape({
      type: PropTypes.shape({
        name: PropTypes.oneOf(['money', 'set']),
      }),
      isRequired: PropTypes.bool,
    }),
    disabled: PropTypes.bool,
    numberFormat: PropTypes.string.isRequired,
    onBlurValue: PropTypes.func,
    onChangeValue: PropTypes.func.isRequired,
    // Define profile if this is a filter field OR a form field
    // The profile will determine the styles it should have.
    profile: PropTypes.oneOf(['form', 'filter']),
    // injectIntl
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    definition: {
      isRequired: false,
    },
    profile: 'form',
    disabled: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shouldUpdateAttributeInput({
      currentProps: this.props,
      currentState: this.state,
      nextProps,
      nextState,
    });
  }

  handleCurrencyChange = event => {
    const currencyCode = event.target.value;

    this.props.onChangeValue({
      name: this.props.attribute.name,
      value: { ...this.props.attribute.value, currencyCode },
    });
  };

  handleCentAmountChange = centAmount => {
    const currencyCode =
      this.props.attribute.value && this.props.attribute.value.currencyCode
        ? this.props.attribute.value.currencyCode
        : this.props.currencies[0];
    // Since this is an object type attribute, we should pass in undefined
    // to the updateDraft (which builds actions) if there is no value to diff
    const value = isNumber(centAmount)
      ? { ...this.props.attribute.value, currencyCode, centAmount }
      : { centAmount: undefined, currencyCode };

    this.props.onChangeValue({ name: this.props.attribute.name, value });
  };

  handleBlur = () => {
    if (this.props.onBlurValue)
      this.props.onBlurValue(this.props.attribute.value);
  };

  render() {
    const inputProps = {
      numberFormat: this.props.numberFormat,
      name: this.props.attribute.name,
      numberFormatType: 'money',
      value: this.props.attribute.value
        ? this.props.attribute.value.centAmount
        : undefined,
      className: classnames(
        styles[`input-${this.props.profile}`],
        this.props.className,
        {
          filled: this.props.attribute.value,
          empty: !this.props.attribute.value,
        }
      ),
      onChangeValue: this.handleCentAmountChange,
      onBlurValue: this.handleBlur,
      disabled: this.props.disabled,
    };

    const numericInput = this.props.definition.isRequired ? (
      <RequiredNumericFormatInput {...inputProps} />
    ) : (
      <ValidatedNumericFormatInput {...inputProps} />
    );

    return (
      <div className={styles['attribute-currencies']}>
        {this.props.currencies.length > 1 ? (
          <div className={styles.dropdown}>
            <SelectInput
              {...{
                name: 'currencies',
                onChange: this.handleCurrencyChange,
                onBlur: this.handleBlur,
                value: this.props.attribute.value
                  ? this.props.attribute.value.currencyCode
                  : this.props.currencies[0],
                options: this.props.currencies.map(code => ({
                  value: code,
                  label: code,
                })),
                isClearable: false,
                isSearchable: false,
                placeholder: this.props.intl.formatMessage(
                  dropdownMessages.select
                ),
                isDisabled: this.props.disabled,
              }}
            />
          </div>
        ) : (
          <span className={styles['input-like-text']}>
            {this.props.currencies[0]}
          </span>
        )}
        <div className={styles.wrapper}>{numericInput}</div>
      </div>
    );
  }
}

export default injectIntl(AttributeInputMoney);
