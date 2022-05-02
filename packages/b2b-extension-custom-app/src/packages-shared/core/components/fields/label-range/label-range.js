import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import styles from './label-range.mod.css';

export const messages = defineMessages({
  from: {
    id: 'LabelRange.from',
    description: 'The label for "from" range',
    defaultMessage: 'From',
  },
  to: {
    id: 'LabelRange.to',
    description: 'The label for "to" range',
    defaultMessage: 'To',
  },
});

export const LabelRange = ({ type }) => (
  <label className={styles.label}>
    <FormattedMessage {...messages[type]} />
  </label>
);
LabelRange.displayName = 'LabelRange';
LabelRange.propTypes = {
  type: PropTypes.oneOf(['from', 'to']).isRequired,
};

export default LabelRange;
