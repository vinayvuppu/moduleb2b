import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { defineMessages, injectIntl } from 'react-intl';
import localize from '@commercetools-local/utils/localize';
import { getAttributeValueType } from '@commercetools-local/utils/type-definitions';
import LabelField from '../../fields/label-field';
import styles from './attribute-read.mod.css';

export const messages = defineMessages({
  yes: {
    id: 'AttributeRead.yes',
    description: 'The label for boolean attribute `true` value',
    defaultMessage: 'YES',
  },
  no: {
    id: 'AttributeRead.no',
    description: 'The label for boolean attribute `false` value',
    defaultMessage: 'NO',
  },
});

export class AttributeRead extends React.PureComponent {
  static displayName = 'AttributeRead';
  static propTypes = {
    attributeValue: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.number,
        PropTypes.object,
        // enum
        PropTypes.shape({
          label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
          key: PropTypes.string.isRequired,
        }),
        // money
        PropTypes.shape({
          currencyCode: PropTypes.string.isRequired,
          centAmount: PropTypes.number.isRequired,
        }),
        // reference
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          typeId: PropTypes.string.isRequired,
          obj: PropTypes.object,
        }),

        // set
        PropTypes.array,
      ]),
    }).isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    language: PropTypes.string.isRequired,
    // injectIntl
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
      formatNumber: PropTypes.func.isRequired,
    }).isRequired,
  };

  renderValue = value => {
    const type = getAttributeValueType(value);

    switch (type) {
      case 'money': {
        return (
          <div className={styles.money}>
            <div className={styles['money-currencyCode']}>
              {value.currencyCode}
            </div>
            <div className={styles['money-centAmount']}>
              {this.props.intl.formatNumber(value.centAmount / 100, {
                style: 'decimal',
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        );
      }
      case 'ltext': {
        const usedLocalizedKeys = this.props.languages.filter(
          lang => value[lang]
        );
        return (
          <div>
            {usedLocalizedKeys.map(localizedKey => (
              <div
                className={styles.ltext}
                key={`${this.props.attributeValue.name}-${localizedKey}`}
              >
                <div className={styles['ltext-lang']}>
                  <div className={styles['arrow-right']} />
                  <div className={styles['arrow-right-border']} />
                  <div>{localizedKey.toUpperCase()}</div>
                </div>
                <div className={styles['ltext-value']}>
                  {value[localizedKey]}
                </div>
              </div>
            ))}
          </div>
        );
      }
      case 'enum':
        return value.label;

      case 'lenum':
        return localize({
          obj: value,
          key: 'label',
          language: this.props.language,
          fallbackOrder: this.props.languages,
        });

      case 'date-time':
        return moment(value).format('YYYY-MM-DD, HH:mm:ss');

      case 'boolean': {
        const message = value ? messages.yes : messages.no;
        return this.props.intl.formatMessage(message);
      }

      case 'reference': {
        return value.id;
      }

      case 'number': {
        return this.props.intl.formatNumber(value);
      }

      default:
        return value;
    }
  };

  renderAttributeValue = () => {
    const value = Array.isArray(this.props.attributeValue.value)
      ? this.props.attributeValue.value
      : [this.props.attributeValue.value];

    // we rely on `index` as key on the iteration since this is read-only
    return value.map((v, index) => (
      <div key={index} className={styles.value}>
        {this.renderValue(v)}
      </div>
    ));
  };

  render() {
    const isSet = Array.isArray(this.props.attributeValue.value);
    const type = getAttributeValueType(this.props.attributeValue.value);

    const className = isSet
      ? classnames(styles['attribute-set'], styles[`attribute-${type}-set`])
      : styles[`attribute-${type}`];

    return (
      <div className={className}>
        <LabelField title={this.props.attributeValue.name} />
        <div>{this.renderAttributeValue()}</div>
      </div>
    );
  }
}

export default injectIntl(AttributeRead);
