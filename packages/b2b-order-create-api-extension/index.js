/* eslint-disable no-console */
const functions = require('firebase-functions');
const { getEmployeeById } = require('./services/commercetools');
const { getCompany } = require('./services/companies');
const { getEmployeeRoles, getNumber, checkIfOverBudget } = require('./utils');
const { executeRuleEngine } = require('./rules-engine');

const needsApprovalFromRules = async ({
  company,
  order,
  employee,
  employeeRoles
}) => {
  let needsApproval = false;
  if (company.rules && company.rules.length) {
    needsApproval = await executeRuleEngine({
      conditions: company.rules.map(rule => rule.parsedValue).filter(Boolean),
      order,
      employee: {
        ...employee,
        roles: employeeRoles
      }
    });
  }
  console.log('needsApprovalFromRules', needsApproval);
  return needsApproval;
};

const needsApprovalFromRoleAmount = ({
  company,
  employeeRoles,
  order: { totalPrice }
}) => {
  const requiredApprovalRol = company.requiredApprovalRoles.find(({ rol }) =>
    employeeRoles.find(r => rol === r)
  );

  if (requiredApprovalRol) {
    const totalOrder = getNumber(
      totalPrice.centAmount,
      totalPrice.fractionDigits
    );

    const approvalAmount = getNumber(
      requiredApprovalRol.amount.centAmount,
      requiredApprovalRol.amount.fractionDigits
    );

    const needsApproval = totalOrder >= approvalAmount;
    console.log('needsApprovalFromRoleAmount', needsApproval);
    return needsApproval;
  } else {
    return false;
  }
};

const b2bOrderCreation = async (req, res) => {
  if (!req.body || !req.body.resource || !req.body.resource) {
    console.log('keep alive call');
    return res.status(200).json({ result: 'ok' });
  }

  const order = req.body.resource.obj;
  const { store, customerId: employeeId } = order;

  const confirmedKey = 'confirmed';
  const pendingApprovalKey = 'pendingApproval';

  const statesActions = [
    {
      action: 'changePaymentState',
      paymentState: 'Pending'
    },
    {
      action: 'changeShipmentState',
      shipmentState: 'Pending'
    }
  ];
  const confirmedActions = [
    {
      action: 'changeOrderState',
      orderState: 'Confirmed'
    },
    {
      action: 'transitionState',
      state: {
        typeId: 'state',
        key: confirmedKey
      }
    }
  ];
  let actions = [...statesActions, ...confirmedActions];

  if (store) {
    const [company, employee] = await Promise.all([
      getCompany(store.key),
      getEmployeeById(employeeId)
    ]);
    if (company && employee) {
      const employeeRoles = getEmployeeRoles(employee);

      const isApproval = company.approverRoles.find(rol =>
        employeeRoles.includes(rol)
      );

      if (
        !isApproval &&
        (checkIfOverBudget({ company, employee, order }) ||
          (await needsApprovalFromRules({
            company,
            order,
            employee,
            employeeRoles
          })) ||
          needsApprovalFromRoleAmount({ company, order, employeeRoles }))
      ) {
        actions = [
          ...statesActions,
          {
            action: 'transitionState',
            state: {
              typeId: 'state',
              key: pendingApprovalKey
            }
          }
        ];
      }
    }
  }
  return res.status(200).json({ actions });
};

module.exports = {
  b2bOrderCreate: functions.https.onRequest(b2bOrderCreation),
  b2bOrderCreation
};
