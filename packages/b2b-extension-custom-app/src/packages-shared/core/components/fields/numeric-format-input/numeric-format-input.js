import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import isNil from 'lodash.isnil';
import isUndefined from 'lodash.isundefined';
import isFinite from 'lodash.isfinite';
import oneLine from 'common-tags/lib/oneLine';
import Cleave from 'cleave.js/react';
import { withProps } from 'recompose';
import { filterDataAttributes } from '@commercetools-local/utils/dataset';
import { getSeparatorsForLocale, isNumberish } from '../../../../utils/numbers';
import styles from './numeric-format-input.mod.css';

Cleave.displayName = 'Cleave';

// only allow values of type Number or values that are nil (null or undefined)
// use isFinite to exclude Infitinty, -Inifinity and NaN
const isValidValue = value => isFinite(value) || isNil(value);

export class NumericFormatInput extends React.PureComponent {
  static displayName = 'NumericFormatInput';

  static propTypes = {
    numberFormat: PropTypes.string.isRequired,
    numberFormatType: PropTypes.oneOf(['number', 'money']).isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    // eslint-disable-next-line consistent-return
    value: (props, propName, componentName) => {
      if (!isValidValue(props[propName])) {
        return new Error(
          oneLine`Invalid prop \`${propName}\` supplied to \`${componentName}\`.
          Validation failed. It may only be number or nil but you passed
          \`${props[propName]}\`.`
        );
      }
    },
    onChangeValue: PropTypes.func.isRequired,
    onBlurValue: PropTypes.func,
    onFocus: PropTypes.func,
    onInvalidValue: PropTypes.func,
    isValid: PropTypes.bool,
    numeralDecimalScale: PropTypes.number.isRequired,
    formatNumber: PropTypes.func.isRequired,
    parseNumber: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    numberFormatType: 'number',
    isValid: true,
    numeralDecimalScale: 20,
    formatNumber: number => number,
    // Since the Cleave component might call the onChange handler with a string
    // we need to cast the string back to a number.
    // This function ensures that the value is always either
    // - null
    // - undefined
    // - JavaScript number
    parseNumber: number => {
      if (number === '') return undefined;
      if (isNumberish(number)) {
        const parsedAsNumber = parseFloat(number);
        return !Number.isNaN(parsedAsNumber) ? parsedAsNumber : undefined;
      }
      return undefined;
    },
    disabled: false,
  };

  parsedValue = this.props.value;

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props.value !== nextProps.value &&
      nextProps.value !== this.parsedValue
    ) {
      this.setValue(nextProps.value);
    }
  }

  setValue = value => {
    if (!isValidValue(value)) return;
    const newValue = !isUndefined(value)
      ? this.props.formatNumber(value)
      : undefined;

    this.owner.setRawValue(newValue);
  };

  handleInit = owner => {
    this.owner = owner;
    this.setValue(this.props.value);
  };

  handleChange = event => {
    const value = event.target.rawValue;
    const parsedNumber = this.props.parseNumber(value);

    if (this.parsedValue === parsedNumber) return;

    this.parsedValue = parsedNumber;
    this.props.onChangeValue(parsedNumber);

    if (!isNumberish(value) && this.props.onInvalidValue)
      this.props.onInvalidValue(value);
  };

  handleBlur = () => {
    this.setValue(this.props.value);
    if (this.props.onBlurValue) this.props.onBlurValue(this.props.value);
  };

  registerInputRef = ref => {
    this.textInput = ref;
  };

  render() {
    const separators = getSeparatorsForLocale(this.props.numberFormat);
    const dataAttributes = filterDataAttributes(this.props);
    return (
      <Cleave
        placeholder={this.props.placeholder}
        htmlRef={this.registerInputRef}
        options={{
          numeral: true,
          numeralThousandsGroupStyle: 'thousand',
          numeralDecimalMark: separators.decSeparator,
          delimiter: separators.thoSeparator,
          numeralDecimalScale: this.props.numeralDecimalScale,
          // This option is provided to help Cleave slice the numerical values
          // according to a certain "scale". The default value is `10` which
          // effectively affects all numerical values (including AttributeMoney)
          // in MC where the value exceeds the length of `10`
          // We provide `0` to disable this feature.
          numeralIntegerScale: 0,
        }}
        name={this.props.name}
        className={classnames(this.props.className, {
          [styles.invalid]: !this.props.isValid,
          [styles.disabled]: this.props.disabled,
        })}
        onChange={this.handleChange}
        onInit={this.handleInit}
        onBlur={this.handleBlur}
        onFocus={this.props.onFocus}
        disabled={this.props.disabled}
        {...dataAttributes}
      />
    );
  }
}

export const withPropsForMoney = ownProps =>
  ownProps.numberFormatType === 'money'
    ? {
        value: isNil(ownProps.value) ? ownProps.value : ownProps.value / 100,
        formatNumber: number => (isNil(number) ? number : number.toFixed(2)),
        onChangeValue: value => {
          if (isNumberish(value)) {
            // JavaScript is sometimes incorrect when multiplying floats, e.g.
            //   2.49 * 100 -> 249.00000000000003
            // While inaccuracy from multiplying floating point numbers is a
            // general problem in JS, we can avoid it by cutting off all
            // decimals. This is possible since cents is the base unit, so we
            // operate on integers anyways
            // Also we should the round the value to ensure that we come close
            // to the nearest decimal value
            // ref: https://github.com/commercetools/merchant-center-frontend/pull/770
            ownProps.onChangeValue(Math.trunc(Math.round(value * 100)));
          } else {
            ownProps.onChangeValue(value);
          }
        },
        numeralDecimalScale: 2,
      }
    : {};

export default withProps(withPropsForMoney)(NumericFormatInput);
