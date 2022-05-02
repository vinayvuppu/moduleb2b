import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { deepEqual } from 'fast-equals';
import { compose } from 'recompose';
import {
  AngleDownIcon,
  AngleUpIcon,
  FlatButton,
} from '@commercetools-frontend/ui-kit';
import { getIndexesOfInvalidValues } from '../../../../utils/validation';
import keepDisplayName from '../../keep-display-name';
import ValidatedItemList from '../../validated-item-list';
import styles from './attribute-input-set-base.mod.css';

const messages = defineMessages({
  expand: {
    id: 'AttributeInputSet.expand',
    description: 'The label to expand a set attribute.',
    defaultMessage: 'Show all ({count})',
  },
  collapse: {
    id: 'AttributeInputSet.collapse',
    description: 'The label to collapse a set attribute.',
    defaultMessage: 'Hide all',
  },
});

export class AttributeInputSetBase extends React.PureComponent {
  static displayName = 'AttributeInputSetBase';

  static propTypes = {
    attribute: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.array,
    }).isRequired,
    onChangeValue: PropTypes.func.isRequired,

    // function to check if value is empty according to the set type
    checkIsEmpty: PropTypes.func.isRequired,

    // callback for rendering items, signature is:
    // renderItem({ value::any, onChangeValue::fn, onBlurValue::fn})
    renderItem: PropTypes.func.isRequired,

    // Validation function should accept an array of values, and return
    // a result in the following format:
    // {
    //   isValid: Boolean,
    //   invalidValues: Array<any> An array of the invalid values
    //   message: String The validation message to display
    // }
    onValidate: PropTypes.func,

    // handles whether or not all the values of a set are displayed
    isExpanded: PropTypes.bool,
    onToggleExpand: PropTypes.func,
    disabled: PropTypes.bool,

    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
  };

  static defaultProps = {
    attribute: {
      value: [],
    },
    onValidate: defaultValidator,
    isExpanded: true,
    disabled: false,
  };

  state = {
    currentAttributeValues: getNextValues(this.props.attribute.value),
    validation: {
      isValid: true,
      invalidIndexes: [],
      message: '',
    },
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    // if its just an expand / collapse change then dont update the values
    if (this.props.isExpanded !== nextProps.isExpanded) return;

    const nextAttributeValues = getNextValues(nextProps.attribute.value);

    this.setState({
      validation: this.getValidationResult(
        nextAttributeValues,
        nextProps.onValidate
      ),
      currentAttributeValues: nextAttributeValues,
    });
  }

  // All additions / changes / removals are funnelled through here
  handleChange = () => {
    // filter out values that are the same as the initial value,
    // that is: they are empty
    const filteredChanges = this.state.currentAttributeValues.filter(
      value => !this.props.checkIsEmpty(value)
    );

    // only trigger update if there are changes
    if (!deepEqual(filteredChanges, this.props.attribute.value)) {
      const updatedAttribute = { name: this.props.attribute.name };

      if (filteredChanges.length > 0) updatedAttribute.value = filteredChanges;
      else updatedAttribute.value = undefined;

      this.props.onChangeValue(updatedAttribute);
    }
  };

  // This is just a convenience function to re-run validation and convert
  // invalidValues to invalidIndexes, so we don't need to do it everywhere
  // validation is run
  getValidationResult = (newValues, validator) => {
    const validationResult = validator
      ? validator(newValues)
      : defaultValidator();

    return {
      isValid: validationResult.isValid,
      invalidIndexes: getIndexesOfInvalidValues(
        newValues,
        validationResult.invalidValues
      ),
      message: validationResult.message,
    };
  };

  handleToggleExpand = () => {
    this.props.onToggleExpand(!this.props.isExpanded);
  };

  handleBlurValue = () => {
    this.setState(state => ({
      validation: this.getValidationResult(
        state.currentAttributeValues,
        this.props.onValidate
      ),
    }));
  };

  handleChangeValue = (value, index) => {
    let isValid;

    this.setState(
      state => {
        const newValues = [
          ...state.currentAttributeValues.slice(0, index),
          value,
          ...state.currentAttributeValues.slice(index + 1),
        ];
        const validationResult = this.getValidationResult(
          newValues,
          this.props.onValidate
        );
        isValid = validationResult.isValid;
        return {
          currentAttributeValues: newValues,
          validation: validationResult,
        };
      },
      () => {
        // if the set is valid, trigger the change callback
        if (isValid) this.handleChange();
      }
    );
  };

  handleAddNewValue = () => {
    this.setState(state => {
      // don't add more than one empty value
      if (state.currentAttributeValues[0] === undefined) return state;

      // shift all invalid indexes up one to account for new empty value
      const updatedInvalidIndexes = state.validation.invalidIndexes.map(
        index => index + 1
      );

      return {
        currentAttributeValues: [undefined, ...state.currentAttributeValues],
        validation: {
          ...state.validation,
          invalidIndexes: updatedInvalidIndexes,
        },
      };
    });
  };

  handleRemoveValue = ({ index }) => {
    let removedValue;
    let validationResult;

    this.setState(
      state => {
        const newValues = [
          ...state.currentAttributeValues.slice(0, index),
          ...state.currentAttributeValues.slice(index + 1),
        ];
        removedValue = state.currentAttributeValues[index];
        validationResult = this.getValidationResult(
          newValues,
          this.props.onValidate
        );
        return {
          currentAttributeValues: newValues,
          validation: validationResult,
        };
      },
      () => {
        // don't trigger update if value is empty
        if (
          removedValue !== undefined &&
          !this.props.checkIsEmpty(removedValue) &&
          validationResult.isValid
        )
          this.handleChange();
      }
    );
  };

  renderItem = ({ index }) =>
    this.props.renderItem({
      value: this.state.currentAttributeValues[index],
      isValid: !this.state.validation.invalidIndexes.includes(index),
      onChangeValue: ({ value }) => this.handleChangeValue(value, index),
      onBlurValue: this.handleBlurValue,
      index,
    });

  renderExpandToggle = () => (
    <div className={styles['toggle-item']}>
      <FlatButton
        tone="primary"
        icon={this.props.isExpanded ? <AngleUpIcon /> : <AngleDownIcon />}
        label={
          this.props.isExpanded
            ? this.props.intl.formatMessage(messages.collapse)
            : this.props.intl.formatMessage(messages.expand, {
                count: this.state.currentAttributeValues.length - 1,
              })
        }
        onClick={this.handleToggleExpand}
      />
    </div>
  );

  render() {
    const itemCount = this.props.isExpanded
      ? this.state.currentAttributeValues.length
      : 1;
    return (
      <div>
        <ValidatedItemList
          itemCount={itemCount}
          renderItem={this.renderItem}
          getKey={({ index }) => index}
          onAddItem={this.handleAddNewValue}
          onRemoveItem={this.handleRemoveValue}
          validation={this.state.validation}
          disabled={this.props.disabled}
        />
        {this.state.currentAttributeValues.length > 1 &&
          this.renderExpandToggle()}
      </div>
    );
  }
}

export default compose(
  keepDisplayName(AttributeInputSetBase),
  injectIntl
)(AttributeInputSetBase);

function defaultValidator() {
  return { isValid: true, message: '', invalidValues: [] };
}

function getNextValues(nextValues) {
  return !nextValues || nextValues.length === 0
    ? // if the values are empty, push in empty value so we have an inital input
      [undefined]
    : [...nextValues];
}
