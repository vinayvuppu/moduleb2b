import PropTypes from 'prop-types';
import React from 'react';
import {
  mapToAttributeDefinition,
  mapToAttributeValue,
  mapToCustomTypeValue,
  omitNestedFieldDefinitions,
} from '@commercetools-local/utils/type-definitions';
import AttributeInput from '../../attribute-definitions/attribute-input';
import styles from './custom-attributes.mod.css';

const CustomAttributes = props => {
  const omittedNestedFieldDefinitions = omitNestedFieldDefinitions(
    props.fieldDefinitions
  );

  const elements = omittedNestedFieldDefinitions.map(
    (definition, indexOfDefinition) => {
      const attributeDefinition = mapToAttributeDefinition(definition);
      const attribute = mapToAttributeValue(props.fields, definition);

      return (
        <li
          className={styles['attribute-list-item']}
          key={`${definition.name}-${indexOfDefinition}`}
        >
          <AttributeInput
            languages={props.languages}
            currencies={props.currencies}
            attribute={attribute}
            updateSettings={props.updateSettings}
            expandSettings={props.expandSettings}
            onChangeValue={nextAttribute => {
              const name = definition.name;
              const value = mapToCustomTypeValue(nextAttribute, definition);

              props.handleChange(name, value);
            }}
            numberFormat={props.language}
            selectedLanguage={props.language}
            definition={attributeDefinition}
            disabled={props.isDisabled}
          />
        </li>
      );
    }
  );

  return (
    <div>
      <ul className={styles['attribute-list']}>{elements}</ul>
    </div>
  );
};
CustomAttributes.displayName = 'CustomAttributes';
CustomAttributes.propTypes = {
  fieldDefinitions: PropTypes.array.isRequired,
  fields: PropTypes.object.isRequired,
  languages: PropTypes.array.isRequired,
  language: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  updateSettings: PropTypes.func.isRequired,
  currencies: PropTypes.array,
  expandSettings: PropTypes.object,
};

CustomAttributes.defaultProps = {
  isDisabled: false,
};

export default CustomAttributes;
