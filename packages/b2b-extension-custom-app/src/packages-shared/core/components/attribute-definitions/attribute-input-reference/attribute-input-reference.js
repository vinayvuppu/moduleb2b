import PropTypes from 'prop-types';
import React from 'react';
import { getReferenceTypeId } from '@commercetools-local/utils/type-definitions';
import ThrottledField from '../../fields/throttled-field';
import shouldUpdateAttributeInput from '../../../../utils/should-update-attribute-input';
import validatedInput, { VALIDATOR_REQUIRED } from '../../validated-input';
import getReferenceSearchComponentByType from '../reference-search';
import CartDiscountReferenceSearch from '../cart-discount-reference-search';
import styles from './attribute-input-reference.mod.css';

export const RequiredThrottledField = validatedInput(ThrottledField, [
  VALIDATOR_REQUIRED,
]);

export default class extends React.Component {
  static displayName = 'AttributeInputReference';

  static propTypes = {
    attribute: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.any,
    }),
    definition: PropTypes.shape({
      type: PropTypes.shape({
        name: PropTypes.oneOf(['reference', 'set']),
      }),
      isRequired: PropTypes.bool,
    }),
    disabled: PropTypes.bool,
    isSet: PropTypes.bool,
    onBlurValue: PropTypes.func,
    onChangeValue: PropTypes.func.isRequired,
    onFocusValue: PropTypes.func,
    selectedLanguage: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string),
    setInvalidValueState: PropTypes.func,
  };

  static defaultProps = {
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

  // Handle change on throttled field (non-searchable)
  handleChange = e => {
    const value = e.target.value;
    const typeId = getReferenceTypeId(this.props.definition);

    this.props.onChangeValue({
      name: this.props.attribute.name,
      value: value
        ? {
            typeId,
            id: value,
          }
        : undefined,
    });
  };

  handleBlur = value => {
    if (this.props.onBlurValue) this.props.onBlurValue(value);
  };

  renderComponent = typeId => {
    const ReferenceSearchComponent = getReferenceSearchComponentByType(typeId);

    // is the definition whitelisted to be a searchable reference?
    // render a searchable component
    if (ReferenceSearchComponent)
      return (
        <ReferenceSearchComponent
          definition={this.props.definition}
          isSet={this.props.isSet}
          onChangeValue={this.props.onChangeValue}
          onFocusValue={this.props.onFocusValue}
          selectedLanguage={this.props.selectedLanguage}
          languages={this.props.languages}
          setInvalidValueState={this.props.setInvalidValueState}
          value={this.props.attribute.value}
          disabled={this.props.disabled}
        />
      );

    const inputProps = {
      name: this.props.attribute.name,
      value: this.props.attribute.value ? this.props.attribute.value.id : null,
      className: styles.input,
      onChange: this.handleChange,
      onBlurValue: this.handleBlur,
      disabled: this.props.disabled,
    };

    return this.props.definition.isRequired ? (
      <RequiredThrottledField {...inputProps} />
    ) : (
      <ThrottledField {...inputProps} />
    );
  };

  render() {
    const typeId = getReferenceTypeId(this.props.definition);
    return (
      <div className={styles['input-container']}>
        {typeId === 'cart-discount' ? (
          <CartDiscountReferenceSearch
            typeId={typeId}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            {...this.props}
          />
        ) : (
          this.renderComponent(typeId)
        )}
      </div>
    );
  }
}
