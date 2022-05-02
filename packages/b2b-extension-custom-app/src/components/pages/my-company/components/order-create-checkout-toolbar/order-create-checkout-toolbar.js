import React, { Fragment, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Text, Spacings } from '@commercetools-frontend/ui-kit';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import SaveToolbarSteps from '@commercetools-local/core/components/save-toolbar-steps';
import { isTotalMoreThanRol } from '../../../../utils/budget';
import executeRuleEngine from '../../../../utils/rules-engine';

import messages from './messages';
import OrderCreateConnectorContext from '../order-create-connector/order-create-connector-context';

const OrderCreateCheckoutToolbar = ({
  currentStep,
  totalSteps,
  isVisible,
  onBack,
  onCancel,
  onSave,
  employee,
  company,
  cart,
}) => {
  const { formatMessage, formatNumber } = useIntl();
  const { cartDraftState } = useContext(OrderCreateConnectorContext);
  const [confirmModalMessages, setConfirmModalMessages] = useState([]);

  const handleSave = async () => {
    const isApproval = company.approverRoles.find(rol =>
      employee.roles.includes(rol)
    );
    const ruleEngineResult = company.rules?.length
      ? await executeRuleEngine({
          conditions: company.rules,
          cart,
          employee,
        })
      : false;

    const infoMessages = [
      isTotalMoreThanRol(
        employee.roles,
        company.requiredApprovalRoles,
        cartDraftState.value.totalPrice,
        { formatNumber }
      ) && formatMessage(messages.orderLimitPass),
      isTotalMoreThanRol(
        employee.roles,
        company.budget,
        cartDraftState.value.totalPrice,
        { formatNumber }
      ) && formatMessage(messages.outOfBudget),
      ruleEngineResult.needsApproval &&
        formatMessage(messages.rulesMatch, { name: ruleEngineResult.ruleName }),
    ].filter(Boolean);

    if (infoMessages.length && !isApproval) {
      setConfirmModalMessages(infoMessages);
    } else {
      onSave();
    }
  };
  return (
    <Fragment>
      <SaveToolbarSteps
        currentStep={currentStep}
        totalSteps={totalSteps}
        isVisible={isVisible}
        onBack={onBack}
        onCancel={onCancel}
        onNext={() => {}}
        onSave={handleSave}
        buttonProps={{
          save: {
            label: formatMessage(messages.placeOrderLabel),
          },
        }}
      />
      {confirmModalMessages.length ? (
        <ConfirmationDialog
          title={formatMessage(messages.orderNeedApprovalTitle)}
          zIndex={1100}
          isOpen={Boolean(confirmModalMessages.length)}
          onClose={() => setConfirmModalMessages([])}
          onCancel={() => setConfirmModalMessages([])}
          onConfirm={onSave}
          labelPrimary={formatMessage(messages.continueButton)}
        >
          <Spacings.Stack>
            <Text.Body>
              {formatMessage(messages.orderNeedApprovalDescription)}
            </Text.Body>
            <ul>
              {confirmModalMessages.map(msg => (
                <li key={msg}>
                  <Text.Body>{msg}</Text.Body>
                </li>
              ))}
            </ul>
          </Spacings.Stack>
        </ConfirmationDialog>
      ) : (
        <div />
      )}
    </Fragment>
  );
};

OrderCreateCheckoutToolbar.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  employee: PropTypes.object.isRequired,
  cart: PropTypes.shape({
    totalPrice: PropTypes.object.isRequired,
    shippingInfo: PropTypes.object,
    customerEmail: PropTypes.string,
  }),
};

OrderCreateCheckoutToolbar.displayName = 'OrderCreateCheckoutToolbar';

export default OrderCreateCheckoutToolbar;
