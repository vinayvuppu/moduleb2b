import React from 'react';
import PropTypes from 'prop-types';
import { Spacings, Card } from '@commercetools-frontend/ui-kit';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import { useIntl } from 'react-intl';
import classnames from 'classnames';
import messages from './messages';
import styles from './cart-summary-budget-remaining.mod.css';

export const CartSummaryBudgetRemaining = props => {
  const intl = useIntl();

  if (!props.employeeAmountRemaining) {
    return (
      <Card>
        <Spacings.Stack>
          <Spacings.Inline justifyContent="space-between">
            <div className={styles.budget}>
              {intl.formatMessage(messages.withoutBudget)}
            </div>
          </Spacings.Inline>
        </Spacings.Stack>
      </Card>
    );
  }
  const budgetRemaining = {
    ...props.employeeAmountRemaining,
    centAmount:
      props.employeeAmountRemaining.centAmount -
      props.cartTotalPrice?.centAmount,
  };

  const isOver = budgetRemaining.centAmount < 0;

  return (
    <Card>
      <Spacings.Stack>
        <Spacings.Inline justifyContent="space-between">
          <div
            className={classnames(styles.budget, {
              [styles.negative]: isOver,
            })}
          >
            {intl.formatMessage(
              !isOver ? messages.remainingBudget : messages.isOver
            )}
          </div>
          <div
            className={classnames(styles.budget, {
              [styles.negative]: isOver,
            })}
          >
            {formatMoney(budgetRemaining, intl)}
          </div>
        </Spacings.Inline>
      </Spacings.Stack>
    </Card>
  );
};
CartSummaryBudgetRemaining.displayName = 'CartSummaryBudgetRemaining';
CartSummaryBudgetRemaining.propTypes = {
  cartTotalPrice: PropTypes.object,
  employeeAmountRemaining: PropTypes.object,
};
export default CartSummaryBudgetRemaining;
