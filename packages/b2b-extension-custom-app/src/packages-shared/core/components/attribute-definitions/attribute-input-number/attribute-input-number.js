import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import shouldUpdateAttributeInput from '../../../../utils/should-update-attribute-input';
import NumericFormatInput from '../../fields/numeric-format-input';
import validatedInput, {
  VALIDATOR_REQUIRED,
  VALIDATOR_NUMERIC,
} from '../../validated-input';
import styles from './attribute-input-number.mod.css';

const RequiredNumericFormatInput = validatedInput(NumericFormatInput, [
  VALIDATOR_REQUIRED,
  VALIDATOR_NUMERIC,
]);
const ValidatedNumericFormatInput = validatedInput(NumericFormatInput, [
  VALIDATOR_NUMERIC,
]);

export default class extends React.Component {
  static displayName = 'AttributeInputNumber';

  static propTypes = {
    attribute: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.any,
    }),
    definition: PropTypes.shape({
      type: PropTypes.shape({
        name: PropTypes.oneOf(['number', 'set']),
      }),
      isRequired: PropTypes.bool,
    }),
    disabled: PropTypes.bool,
    numberFormat: PropTypes.string.isRequired,
    onBlurValue: PropTypes.func,
    onChangeValue: PropTypes.func.isRequired,
  };

  static defaultProps = { definition: { isRequired: false }, disabled: false };

  shouldComponentUpdate(nextProps, nextState) {
    return shouldUpdateAttributeInput({
      currentProps: this.props,
      currentState: this.state,
      nextProps,
      nextState,
    });
  }

  handleChange = value => {
    this.props.onChangeValue({ name: this.props.attribute.name, value });
  };

  handleBlur = value => {
    if (this.props.onBlurValue) this.props.onBlurValue(value);
  };

  render() {
    const componentProps = {
      numberFormat: this.props.numberFormat,
      name: this.props.attribute.name,
      value: this.props.attribute.value,
      className: classnames(styles.input, {
        filled: this.props.attribute.value,
        empty: !this.props.attribute.value,
      }),
      onChangeValue: this.handleChange,
      onBlurValue: this.handleBlur,
      disabled: this.props.disabled,
    };

    return this.props.definition.isRequired ? (
      <RequiredNumericFormatInput {...componentProps} />
    ) : (
      <ValidatedNumericFormatInput {...componentProps} />
    );
  }
}
