import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classnames from 'classnames';
import { formatProductAttribute } from '../../../../utils/formats';
import { isEmptyValue } from '../../../../utils/attributes';
import styles from './attribute-value-by-type.mod.css';

export class AttributeValueByType extends React.PureComponent {
  static displayName = 'AttributeValueByType';
  static propTypes = {
    definition: PropTypes.shape({
      type: PropTypes.oneOfType([
        PropTypes.shape({
          name: PropTypes.oneOf(['set']).isRequired,
          elementType: PropTypes.shape({
            name: PropTypes.string.isRequired,
          }).isRequired,
        }),
        PropTypes.shape({
          name: PropTypes.string.isRequired,
        }),
      ]).isRequired,
    }).isRequired,
    value: PropTypes.any,
    language: PropTypes.string.isRequired,
    fallbackValue: PropTypes.string,
    className: PropTypes.string,

    // injectIntl
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
  };

  isAttributeValueLocalized = typeName => {
    switch (typeName) {
      case 'ltext':
      case 'lenum':
        return true;
      default:
        return false;
    }
  };

  renderAttributeValue = (value, type) => (
    <span className={styles.value}>
      {formatProductAttribute({
        value,
        type,
        language: this.props.language,
        intl: this.props.intl,
      })}
    </span>
  );

  renderLocalizedAttributeValue = (value, type, language) => (
    <div key={language} className={styles.field}>
      <div className={styles['field-locale-wrapper']}>
        <div className={styles.locale}>{language}</div>
      </div>
      <div
        className={classnames(styles['field-content'], this.props.className)}
      >
        {formatProductAttribute({
          value,
          type,
          language,
          intl: this.props.intl,
        })}
      </div>
    </div>
  );

  renderAttributeField = (val, type) => {
    if (this.isAttributeValueLocalized(type.name)) {
      const attributeValues = type.name === 'lenum' ? val.label : val;

      return Object.keys(attributeValues).map(key =>
        this.renderLocalizedAttributeValue(val, type, key)
      );
    }

    return this.renderAttributeValue(val, type);
  };

  render() {
    const type = this.props.definition.type;
    const definitionType = type.elementType || type;

    const values = Array.isArray(this.props.value)
      ? this.props.value
      : [this.props.value];

    return (
      <ul className={styles.container}>
        {values.map((val, index) => (
          <li
            key={index}
            className={
              isEmptyValue(val, definitionType)
                ? styles['cleared-value-item']
                : styles['value-item']
            }
          >
            {isEmptyValue(val, definitionType)
              ? this.props.fallbackValue
              : this.renderAttributeField(val, definitionType)}
          </li>
        ))}
      </ul>
    );
  }
}

export default injectIntl(AttributeValueByType);
