import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { Tag } from '@commercetools-frontend/ui-kit';
import styles from './range-filter-tag.mod.css';

const messages = defineMessages({
  from: {
    id: 'Search.Filters.RangeFilterTag.from',
    description: '',
    defaultMessage: 'from',
  },
  to: {
    id: 'Search.Filters.RangeFilterTag.to',
    description: '',
    defaultMessage: 'to',
  },
});

export const RangeFilterTag = props => (
  <Tag onRemove={props.onRemove} onClick={props.onClick}>
    <div className={styles.tagBody}>
      <div className={styles.bold}>
        {props.fieldLabel}
        {':'}
      </div>
      <div>{props.intl.formatMessage(messages.from)}</div>
      <div className={styles.bold}>
        {props.renderValue(props.value ? props.value.from : null)}
      </div>
      <div>{props.intl.formatMessage(messages.to)}</div>
      <div className={styles.bold}>
        {props.renderValue(props.value ? props.value.to : null)}
      </div>
    </div>
  </Tag>
);

RangeFilterTag.displayName = 'RangeFilterTag';
RangeFilterTag.propTypes = {
  intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
    .isRequired,
  fieldLabel: PropTypes.string.isRequired,
  value: PropTypes.shape({
    from: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.shape({
        currencyCode: PropTypes.string,
        amount: PropTypes.string,
      }),
    ]),
    to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.shape({
        currencyCode: PropTypes.string,
        amount: PropTypes.string,
      }),
    ]),
  }),
  renderValue: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onClick: PropTypes.func,
};

export default injectIntl(RangeFilterTag);
