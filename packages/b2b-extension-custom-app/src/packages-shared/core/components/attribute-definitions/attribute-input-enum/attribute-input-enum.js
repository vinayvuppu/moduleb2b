import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import isObject from 'lodash.isobject';
import { SelectInput } from '@commercetools-frontend/ui-kit';
import shouldUpdateAttributeInput from '@commercetools-local/utils/should-update-attribute-input';
import { getTypeNameOfType } from '@commercetools-local/utils/type-definitions';
import localize from '@commercetools-local/utils/localize';
import { messages as dropdownMessages } from '../../dropdowns/dropdown';

const messages = defineMessages({
  placeholderSearch: {
    id: 'AttributeInputEnum.placeholderSearch',
    description: 'Placeholder for search input in dropdown.',
    defaultMessage: 'Search for an attribute',
  },
  noResults: {
    id: 'AttributeInputEnum.noResults',
    description: 'Label for no results',
    defaultMessage: 'No attribute values match your search.',
  },
});

function isLenum(definition) {
  const type = getTypeNameOfType(definition.type);

  return type === 'lenum';
}

export class AttributeInputEnum extends React.Component {
  static displayName = 'AttributeInputEnum';

  static propTypes = {
    definition: PropTypes.shape({
      type: PropTypes.shape({
        name: PropTypes.oneOf(['enum', 'lenum', 'set']),
      }).isRequired,
      name: PropTypes.string,
      isRequired: PropTypes.bool,
    }).isRequired,
    attribute: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.objectOf(PropTypes.string),
      ]),
      isRequired: PropTypes.bool,
    }),
    disabled: PropTypes.bool,
    isClearable: PropTypes.bool,
    isValid: PropTypes.bool,
    onBlurValue: PropTypes.func,
    onChangeValue: PropTypes.func.isRequired,
    // Define profile if this is a filter field OR a form field
    // The profile will determine the styles it should have.
    profile: PropTypes.oneOf(['form', 'filter']),
    selectedLanguage: PropTypes.string.isRequired,
    // injectIntl
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    profile: 'form',
    isValid: true,
    isClearable: true,
    disabled: false,
  };

  getInitialStateFromProps = props => {
    const {
      definition: { type },
    } = props;
    const initialValues = type.elementType?.values || type.values;

    // Naming it initialX clearly indicates that the only purpose
    // of the passed down prop is to initialize something internally
    return {
      shouldClearSearch: false,
      allowedValues: initialValues.map(({ key, label }) => ({
        value: key,
        label: this.renderLabel(props, label, key),
        originalLabel: label,
      })),
    };
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(this.getInitialStateFromProps(nextProps));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldUpdateAttributeInput({
      currentProps: this.props,
      currentState: this.state,
      nextProps,
      nextState,
    });
  }

  handleChange = event => {
    // Since this is an object type attribute, we should pass in undefined
    // to the updateDraft (which builds actions) if there is no value to diff
    const { name, value } = event.target;

    const option = this.state.allowedValues.find(val => val.value === value);

    const newValue = option
      ? {
          key: option.value,
          label: option.originalLabel,
        }
      : undefined;

    this.props.onChangeValue({
      name,
      value: newValue,
    });
  };

  handleBlur = value => {
    if (this.props.onBlurValue) this.props.onBlurValue(value);
  };

  renderLabel = (props, label, key) => {
    const isTypeLenum = isLenum(props.definition);
    return isObject(label) && isTypeLenum
      ? localize({
          obj: { label },
          key: 'label',
          language: props.selectedLanguage,
          fallback: key,
        })
      : label || key;
  };

  state = this.getInitialStateFromProps(this.props);

  render() {
    const selectProps = {
      name: this.props.attribute.name,
      value: this.props.attribute.value ? this.props.attribute.value.key : null,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      hasError: !this.props.isValid,
      options: this.state.allowedValues || [],
      placeholder: this.props.intl.formatMessage(dropdownMessages.select),
      noOptionsMessage: () => this.props.intl.formatMessage(messages.noResults),
      // if the field is not required and/or does not receive
      // the isClearable prop as true, it will be clearable by default
      isClearable: !this.props.attribute.isRequired && this.props.isClearable,
      backspaceRemovesValue: !this.props.attribute.isRequired,
      isDisabled: this.props.disabled,
    };

    return <SelectInput {...selectProps} />;
  }
}

export default injectIntl(AttributeInputEnum);
