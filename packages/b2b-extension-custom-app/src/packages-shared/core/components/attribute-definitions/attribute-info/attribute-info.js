import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import capitalizeFirst from '@commercetools-local/utils/capitalize-first';
import LabelField from '../../fields/label-field';
import styles from './attribute-info.mod.css';

const messages = defineMessages({
  attributeName: {
    id: 'BulkUpdateAttribute.attributeName',
    description: 'The name of the attribute',
    defaultMessage: 'Attribute Name:',
  },
  attributeType: {
    id: 'BulkUpdateAttribute.attributeType',
    description: 'The type of the attribute',
    defaultMessage: 'Attribute Type:',
  },
  attributeConstraint: {
    id: 'BulkUpdateAttribute.attributeConstraint',
    description: 'The constraint of the attribute',
    defaultMessage: 'Constraint:',
  },
});

const AttributeInfo = props => {
  const intl = useIntl();
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <LabelField
          className={styles.label}
          title={intl.formatMessage(messages.attributeName)}
        />
        <p className={styles.info}>{props.definition.name}</p>
      </div>
      <div className={styles.section}>
        <LabelField
          className={styles.label}
          title={intl.formatMessage(messages.attributeType)}
        />
        <p className={styles.info}>
          {`${capitalizeFirst(props.definition.type.name)}, ${
            props.definition.inputHint
          }`}
        </p>
      </div>
      <div className={styles.section}>
        <LabelField
          className={styles.label}
          title={intl.formatMessage(messages.attributeConstraint)}
        />
        <p className={styles.info}>{props.definition.attributeConstraint}</p>
      </div>
    </div>
  );
};
AttributeInfo.displayName = 'AttributeInfo';
AttributeInfo.propTypes = {
  definition: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.shape({
      name: PropTypes.string,
    }),
    attributeConstraint: PropTypes.string,
    inputHint: PropTypes.string,
  }).isRequired,
};

export default AttributeInfo;
