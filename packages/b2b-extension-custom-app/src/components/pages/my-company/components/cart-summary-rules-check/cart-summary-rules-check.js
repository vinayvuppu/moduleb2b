import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Spacings, Text } from '@commercetools-frontend/ui-kit';

import executeRuleEngine from '../../../../utils/rules-engine';

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

const CartSummaryRulesCheck = ({ company, cart, employee }) => {
  const [rulesCheck, setRulesCheck] = useState({
    needsApproval: false,
    name: undefined,
  });

  useEffect(() => {
    const checkIfNeedApproval = async () => {
      if (!company.rules || !company.rules.length) {
        setRulesCheck(false);
      } else {
        const response = await executeRuleEngine({
          conditions: company.rules,
          cart,
          employee,
        });
        setRulesCheck(response);
      }
    };
    checkIfNeedApproval();
  }, [company, cart, employee]);

  if (!rulesCheck.needsApproval) {
    return <div data-testid="no-approval" />;
  }
  const getTextTone = () => {
    return rulesCheck.needsApproval ? { tone: 'warning' } : {};
  };

  const isApproval = company.approverRoles.find(rol =>
    employee.roles.includes(rol)
  );

  return (
    <Card>
      <Spacings.Inline justifyContent="space-between">
        {!isApproval ? (
          <Fragment>
            {rulesCheck.needsApproval && (
              <TextFixed
                {...getTextTone()}
                isBold
                intlMessage={{
                  ...messages.rulesMatch,
                  values: { name: rulesCheck.ruleName },
                }}
              />
            )}
          </Fragment>
        ) : (
          <TextFixed isBold intlMessage={messages.noApproval}></TextFixed>
        )}
      </Spacings.Inline>
    </Card>
  );
};

CartSummaryRulesCheck.propTypes = {
  company: PropTypes.shape({
    rules: PropTypes.arrayOf(
      PropTypes.shape({
        parsedValue: PropTypes.string.isRequired,
      })
    ),
    approverRoles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  cart: PropTypes.shape({
    totalPrice: PropTypes.object.isRequired,
    shippingInfo: PropTypes.object,
    customerEmail: PropTypes.string,
  }),
  employee: PropTypes.shape({
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    email: PropTypes.string,
  }),
};

CartSummaryRulesCheck.displayName = 'CartSummaryRulesCheck';

export default CartSummaryRulesCheck;
