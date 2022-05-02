import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import shouldUpdateAttributeInput from '@commercetools-local/utils/should-update-attribute-input';
import { getTypeNameOfType } from '@commercetools-local/utils/type-definitions';
import { Collapsible } from '@commercetools-frontend/ui-kit';
import ExpandableField from '../../fields/expandable-field';
import ThrottledField from '../../fields/throttled-field';
import LocalizedInput from '../../fields/localized-input';
import LocalizedTextarea from '../../fields/localized-textarea';
import validatedInput, { VALIDATOR_REQUIRED } from '../../validated-input';

const messages = defineMessages({
  setAttributeLocaleErrorModal: {
    id: 'AttributeInputText.setAttributeLocaleErrorModal',
    description:
      'The warning message shown in the modal when ' +
      "the input is a locale and already part of it's Set",
    defaultMessage:
      'The combination of values entered already exist for ' +
      'this attribute. Please create a unique combination of values.',
  },
});

export const RequiredThrottledField = validatedInput(ThrottledField, [
  VALIDATOR_REQUIRED,
]);

export class AttributeInputText extends React.Component {
  static displayName = 'AttributeInputText';

  static propTypes = {
    attribute: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.objectOf(PropTypes.string),
      ]),
    }),
    definition: PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.shape({
        name: PropTypes.oneOf(['text', 'ltext', 'set']).isRequired,
      }).isRequired,
      label: PropTypes.object.isRequired,
      inputHint: PropTypes.oneOf(['SingleLine', 'MultiLine']),
      isRequired: PropTypes.bool.isRequired,
    }).isRequired,
    disabled: PropTypes.bool,
    expandSettings: PropTypes.object.isRequired,
    isValid: PropTypes.bool,
    languages: PropTypes.array.isRequired,
    onBlurValue: PropTypes.func,
    onChangeValue: PropTypes.func.isRequired,
    selectedLanguage: PropTypes.string.isRequired,
    updateSettings: PropTypes.func.isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    definition: { isRequired: false },
    isValid: true,
    expandSettings: {},
    disabled: false,
  };

  state = { isExpanded: this.props.expandSettings[this.props.definition.name] };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      isExpanded: nextProps.expandSettings[this.props.definition.name],
    });
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
    this.props.onChangeValue({
      name: this.props.attribute.name,
      value: event.target.value || null,
    });
  };

  handleChangeLocalized = value => {
    // Since this is an object type attribute, we should pass in undefined
    // to the updateDraft (which builds actions) if there is no value to diff
    this.props.onChangeValue({
      name: this.props.attribute.name,
      value: value || undefined,
    });
  };

  handleBlur = value => {
    if (this.props.onBlurValue) this.props.onBlurValue(value);
  };

  toggleExpand = () => {
    const isExpanded =
      this.props.expandSettings[this.props.definition.name] || false;
    this.props.updateSettings(!isExpanded, this.props.definition);
  };

  renderModalWarningMessage = () =>
    this.props.definition.type.name === 'set' && !this.props.isValid
      ? this.props.intl.formatMessage(messages.setAttributeLocaleErrorModal)
      : null;

  render() {
    const isMultiLine = this.props.definition.inputHint === 'MultiLine';

    const fieldType = getTypeNameOfType(this.props.definition.type);

    const inputProps = {
      name: this.props.attribute.name,
      isValid: this.props.isValid,
      value: this.props.attribute.value || undefined,
      onChange: this.handleChange,
      onBlurValue: this.handleBlur,
      disabled: this.props.disabled,
    };
    const multilineProps = {
      isExpanded: this.state.isExpanded,
      autoExpand: true,
      onToggle: this.toggleExpand,
      as: 'textarea',
    };

    switch (fieldType) {
      case 'ltext': {
        const localizedProps = {
          ...inputProps,
          languages: this.props.languages,
          selectedLanguage: this.props.selectedLanguage,
          modalPrefixClassName: 'variant',
          modalTitle: this.props.definition.label[this.props.selectedLanguage],
          modalWarningMessage: this.renderModalWarningMessage(),
          onChangeValue: this.handleChangeLocalized,
        };
        // Remove `onChange`, because this method is for throttled-field only
        delete localizedProps.onChange;
        if (isMultiLine)
          return (
            <LocalizedTextarea
              {...localizedProps}
              {...multilineProps}
              isExpanded={this.state.isExpanded}
              // If it's a set attribute, only the main toggle element
              // should be saved in the settings, each individual input value
              // of the set attribute should not use the settings.
              // Because of that, by non passing the toggle function, the
              // toggling state will be kept locally to the component.
              onToggle={
                this.props.definition.type.name === 'set'
                  ? undefined
                  : this.toggleExpand
              }
              definition={{ isRequired: !!this.props.definition.isRequired }}
            />
          );

        return (
          <LocalizedInput
            {...localizedProps}
            definition={{ isRequired: !!this.props.definition.isRequired }}
          />
        );
      }
      case 'text': {
        if (isMultiLine)
          // If it's a set attribute, only the main toggle element
          // should be saved in the settings, each individual input value
          // of the set attribute should not use the settings.
          // Because of that, by non passing the toggle function, the
          // toggling state will be kept locally to the component.
          return this.props.definition.type.name === 'set' ? (
            <Collapsible isDefaultClosed={true}>
              {({ isOpen, toggle }) => (
                <ExpandableField
                  {...inputProps}
                  {...multilineProps}
                  isExpanded={isOpen}
                  onToggle={toggle}
                  definition={{
                    isRequired: !!this.props.definition.isRequired,
                  }}
                />
              )}
            </Collapsible>
          ) : (
            <ExpandableField
              {...inputProps}
              {...multilineProps}
              isExpanded={this.state.isExpanded}
              onToggle={this.toggleExpand}
              definition={{ isRequired: !!this.props.definition.isRequired }}
            />
          );

        return this.props.definition.isRequired ? (
          <RequiredThrottledField {...inputProps} />
        ) : (
          <ThrottledField {...inputProps} />
        );
      }
      default:
        return null;
    }
  }
}

export default injectIntl(AttributeInputText);
