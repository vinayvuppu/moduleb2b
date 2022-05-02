import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import {
  messages as validationMessages,
  unique as validateUnique,
} from '../../../../../utils/validation';
import { isEmptyValue } from '../../../../../utils/attributes';
import AttributeInputSetBase from '../attribute-input-set-base';
import styles from './attribute-input-set.mod.css';

export default function createAttributeInputSet({
  attributeComponent: AttributeComponent,
  customValidator,
}) {
  class AttributeInputSet extends React.PureComponent {
    static displayName = `AttributeInputSet(${AttributeComponent.displayName})`;

    static propTypes = {
      definition: PropTypes.object.isRequired,
      attribute: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.array,
      }).isRequired,
      onChangeValue: PropTypes.func.isRequired,
      isExpanded: PropTypes.bool,
      onUpdateExpandedSettings: PropTypes.func.isRequired,
      disabled: PropTypes.bool,

      // injectIntl
      intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired,
      }).isRequired,
    };

    static defaultProps = { isExpanded: false, disabled: false };

    validateItemsUnique = items => {
      const invalidValues = validateUnique(items);

      return {
        isValid: !invalidValues.length,
        invalidValues,
        message: this.props.intl.formatMessage(validationMessages.unique),
      };
    };

    renderItem = ({ value, isValid, onChangeValue, onBlurValue }) => (
      <div className={isValid ? styles.container : styles.invalid}>
        <AttributeComponent
          {...this.props} // collect other props eg. numberFormat for number inputs
          definition={this.props.definition}
          attribute={{
            ...this.props.attribute,
            value,
          }}
          onChangeValue={onChangeValue}
          onBlurValue={onBlurValue}
        />
      </div>
    );

    render() {
      const type = this.props.definition.type.elementType.name;
      const validator = customValidator
        ? items => customValidator.call(this, items)
        : this.validateItemsUnique;

      return (
        <AttributeInputSetBase
          attribute={this.props.attribute}
          renderItem={this.renderItem}
          onChangeValue={this.props.onChangeValue}
          onValidate={validator}
          checkIsEmpty={value => isEmptyValue(value, type)}
          isExpanded={this.props.isExpanded}
          onToggleExpand={this.props.onUpdateExpandedSettings}
          disabled={this.props.disabled}
        />
      );
    }
  }
  return injectIntl(AttributeInputSet);
}
