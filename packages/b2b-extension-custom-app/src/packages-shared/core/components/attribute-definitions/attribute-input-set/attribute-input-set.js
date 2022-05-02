import PropTypes from 'prop-types';
import React from 'react';
import { defaultMemoize } from 'reselect';
import { injectIntl } from 'react-intl';
import shouldUpdateAttributeInput from '../../../../utils/should-update-attribute-input';
import AttributeInputBoolean from '../attribute-input-boolean';
import createAttributeInputSet from './create-attribute-input-set';
import createReferenceSetConfig from './reference';
import { createTextSetConfig, createLocalizedTextSetConfig } from './text';
import createNumberSetConfig from './number';
import createMoneySetConfig from './money';
import createEnumSetConfig from './enum';
import {
  createDateSetConfig,
  createTimeSetConfig,
  createDateTimeSetConfig,
} from './date';

const createReferenceSet = defaultMemoize(intl =>
  createAttributeInputSet(createReferenceSetConfig(intl))
);

const createTextSet = defaultMemoize(() =>
  createAttributeInputSet(createTextSetConfig())
);

const createLTextSet = defaultMemoize(intl =>
  createAttributeInputSet(createLocalizedTextSetConfig(intl))
);

const createNumberSet = defaultMemoize(() =>
  createAttributeInputSet(createNumberSetConfig())
);

const createMoneySet = defaultMemoize(intl =>
  createAttributeInputSet(createMoneySetConfig(intl))
);

const createEnumSet = defaultMemoize(intl =>
  createAttributeInputSet(createEnumSetConfig(intl))
);

const createDateSet = defaultMemoize(intl =>
  createAttributeInputSet(createDateSetConfig(intl))
);

const createDateTimeSet = defaultMemoize(intl =>
  createAttributeInputSet(createDateTimeSetConfig(intl))
);

const createTimeSet = defaultMemoize(intl =>
  createAttributeInputSet(createTimeSetConfig(intl))
);

export class AttributeInputSet extends React.Component {
  static displayName = 'AttributeInputSet';

  static propTypes = {
    selectedLanguage: PropTypes.string.isRequired,
    definition: PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.shape({
        elementType: PropTypes.shape({
          name: PropTypes.string.isRequired,
          referenceTypeId: PropTypes.string,
        }),
      }),
    }).isRequired,
    attribute: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.array,
    }),
    onChangeValue: PropTypes.func.isRequired,
    // Settings
    expandSettings: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
  };

  static defaultProps = { expandSettings: {}, disabled: false };

  shouldComponentUpdate(nextProps, nextState) {
    return shouldUpdateAttributeInput({
      currentProps: this.props,
      currentState: this.state,
      nextProps,
      nextState,
    });
  }

  handleUpdateExpandedSettings = isExpanded => {
    this.props.updateSettings(isExpanded, this.props.definition);
  };

  render() {
    const setType = this.props.definition.type.elementType.name;

    const setComponentProps = {
      ...this.props,
      isExpanded: this.props.expandSettings[this.props.definition.name],
      onUpdateExpandedSettings: this.handleUpdateExpandedSettings,
    };

    switch (setType) {
      case 'text': {
        const TextSet = createTextSet();
        return <TextSet {...setComponentProps} />;
      }
      case 'ltext': {
        const LTextSet = createLTextSet(this.props.intl);
        return <LTextSet {...setComponentProps} />;
      }
      case 'enum':
      case 'lenum': {
        const EnumSet = createEnumSet(this.props.intl);
        return <EnumSet {...setComponentProps} />;
      }
      case 'boolean':
        return (
          <AttributeInputBoolean
            definition={this.props.definition}
            attribute={this.props.attribute}
            onChangeValue={this.props.onChangeValue}
            disabled={this.props.disabled}
          />
        );
      case 'number': {
        const NumberSet = createNumberSet(this.props.intl);
        return <NumberSet {...setComponentProps} />;
      }
      case 'money': {
        const MoneySet = createMoneySet(this.props.intl);
        return <MoneySet {...setComponentProps} />;
      }
      case 'date': {
        const DateSet = createDateSet(this.props.intl);
        return <DateSet {...setComponentProps} />;
      }
      case 'time': {
        const TimeSet = createTimeSet(this.props.intl);
        return <TimeSet {...setComponentProps} />;
      }
      case 'datetime': {
        const DateTimeSet = createDateTimeSet(this.props.intl);
        return <DateTimeSet {...setComponentProps} />;
      }
      case 'reference': {
        const ReferenceSet = createReferenceSet(this.props.intl);
        return <ReferenceSet {...setComponentProps} />;
      }
      default:
        return null;
    }
  }
}

export default injectIntl(AttributeInputSet);
