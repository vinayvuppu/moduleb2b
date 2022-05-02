import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { Spacings } from '@commercetools-frontend/ui-kit';
import shouldUpdateAttributeInput from '@commercetools-local/utils/should-update-attribute-input';
import localize from '@commercetools-local/utils/localize';
import LabelField from '../../fields/label-field';
import AttributeReferenceLabel from '../../fields/attribute-reference-label';
import AttributeInputTip from '../attribute-input-tip';
import AttributeInputByType from '../attribute-input-by-type';
import styles from './attribute-input.mod.css';

export const AttributeInput = class extends React.Component {
  static displayName = 'AttributeInput';

  static propTypes = {
    definition: PropTypes.shape({
      inputTip: PropTypes.object,
      isRequired: PropTypes.bool,
      label: PropTypes.object,
      type: PropTypes.shape({
        name: PropTypes.string.isRequired,
        elementType: PropTypes.shape({
          name: PropTypes.string.isRequired,
        }),
      }).isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    disabled: PropTypes.bool.isRequired,
    selectedLanguage: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
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

  render() {
    const isSetType = this.props.definition.type.name === 'set';

    const type = isSetType
      ? this.props.definition.type?.elementType
      : this.props.definition.type;
    const isNestedAttribute = type?.name === 'nested';

    return (
      <div className={classnames({ [styles.disabled]: this.props.disabled })}>
        <Spacings.Inline>
          <LabelField
            title={localize({
              obj: this.props.definition,
              key: 'label',
              language: this.props.selectedLanguage,
              fallbackOrder: this.props.languages,
            })}
            isRequired={this.props.definition.isRequired}
          />
        </Spacings.Inline>
        <AttributeReferenceLabel definition={this.props.definition} />
        {/* Nested attributes need to show the referenced type first */}
        {!isNestedAttribute && (
          <AttributeInputTip
            inputTip={this.props.definition.inputTip}
            language={this.props.selectedLanguage}
            languages={this.props.languages}
          />
        )}
        <AttributeInputByType {...this.props} />
      </div>
    );
  }
};

export default AttributeInput;
