require('dotenv').config();
const functions = require('firebase-functions');
const { getEmployee, updateEmployee } = require('./services/employees');
const { getOrder } = require('./services/orders');
const { sum } = require('./utils/money');
const {
  topic: { addmonthlyspent }
} = functions.config();

const ORDER_STATE_CONFIRMED = 'Confirmed';

const getCustomField = (entity, field) =>
  entity.custom && entity.custom.fields && entity.custom.fields[field];

const addMonthlySpent = async ({ data }) => {
  const message = JSON.parse(Buffer.from(data, 'base64').toString());
  const order = message.order || (await getOrder(message.orderId));

  if (order.orderState === ORDER_STATE_CONFIRMED) {
    const employee = await getEmployee(order.customerId);

    const amountExpent = sum(
      getCustomField(employee, 'amountExpent'),
      order.totalPrice
    );

    const actions = [
      { action: 'setCustomField', name: 'amountExpent', value: amountExpent }
    ];

    return updateEmployee(employee.id, actions, employee.version);
  }
};

module.exports = {
  addMonthlySpent: functions.pubsub
    .topic(addmonthlyspent)
    .onPublish(addMonthlySpent)
};
