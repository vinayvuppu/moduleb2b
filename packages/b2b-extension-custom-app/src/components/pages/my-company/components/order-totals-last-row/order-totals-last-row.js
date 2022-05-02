import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import styles from './order-totals-last-row.mod.css';
import messages from './messages';

const OrderTotalsLastRow = ({ total, className }) => (
  <div
    className={classnames(styles.container, className)}
    data-testid="order-totals-last-row"
  >
    <div className={styles.total}>
      <span className={styles['total-text']}>
        <FormattedMessage {...messages.totalLabel} />
      </span>
      <span className={styles['total-amount']}>{total}</span>
    </div>
  </div>
);
OrderTotalsLastRow.displayName = 'OrderTotalsLastRow';
OrderTotalsLastRow.propTypes = {
  total: PropTypes.any,
  className: PropTypes.any,
};

export default OrderTotalsLastRow;
