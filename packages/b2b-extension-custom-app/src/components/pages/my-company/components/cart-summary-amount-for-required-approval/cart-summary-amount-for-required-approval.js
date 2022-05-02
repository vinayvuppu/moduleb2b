import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Card, Spacings, Text } from '@commercetools-frontend/ui-kit';
import {
  isTotalMoreThanRol,
  getRemainingApprovalAmount,
} from '../../../../utils/budget';
import messages from './message';

const TextFixed = Text.Body;

TextFixed.propTypes = {
  ...TextFixed.propTypes,
  tone: PropTypes.oneOf([
    'primary',
    'secondary',
    'information',
    'positive',
    'negative',
    'inverted',
    'warning',
  ]),
};

const CartSummaryAmountForRequiredApproval = ({
  company,
  employeeRoles,
  cartTotalPrice,
}) => {
  const intl = useIntl();

  const getTextTone = () => {
    return isTotalMoreThanRol(
      employeeRoles,
      company.requiredApprovalRoles,
      cartTotalPrice,
      intl
    )
      ? { tone: 'warning' }
      : {};
  };

  const remainingApprovalAmount = getRemainingApprovalAmount(
    employeeRoles,
    company.requiredApprovalRoles,
    cartTotalPrice,
    intl
  );

  const isApproval = company.approverRoles.find(rol =>
    employeeRoles.includes(rol)
  );

  if (!(remainingApprovalAmount.amountCurrency && !isApproval)) {
    return <div data-testid="no-approval" />;
  }

  return (
    <Card>
      <Spacings.Inline justifyContent="space-between">
        {remainingApprovalAmount.amountCurrency && !isApproval ? (
          <Fragment>
            <TextFixed
              {...getTextTone()}
              isBold
              intlMessage={
                remainingApprovalAmount.amountNumber <= 0
                  ? messages.remainingOver
                  : messages.label
              }
            />
            <TextFixed {...getTextTone()} isBold>
              {remainingApprovalAmount.amountCurrency}
            </TextFixed>
          </Fragment>
        ) : (
          <TextFixed isBold intlMessage={messages.noApproval}></TextFixed>
        )}
      </Spacings.Inline>
    </Card>
  );
};

CartSummaryAmountForRequiredApproval.propTypes = {
  company: PropTypes.shape({
    requiredApprovalRoles: PropTypes.arrayOf(
      PropTypes.shape({
        rol: PropTypes.string.isRequired,
        amount: PropTypes.object.isRequired,
      })
    ),
    approverRoles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  employeeRoles: PropTypes.array.isRequired,
  cartTotalPrice: PropTypes.object.isRequired,
};

CartSummaryAmountForRequiredApproval.displayName =
  'CartSummaryAmountForRequiredApproval';

export default CartSummaryAmountForRequiredApproval;
