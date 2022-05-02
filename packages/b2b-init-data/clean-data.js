require('dotenv').config();

const BPromise = require('bluebird');

const {
  getAllCustomers,
  deleteCustomer
} = require('./commercetools/services/customers')();

const { getAllCarts, deleteCart } = require('./commercetools/services/carts')();

const {
  getAllOrders,
  deleteOrder
} = require('./commercetools/services/orders')();

const { findCompanies, removeCompany } = require('./companies');

const removeCarts = async () => {
  const carts = await getAllCarts();

  console.log('Carts to remove', carts.length);

  const removedCarts = await BPromise.map(
    carts,
    ({ id, version }) => deleteCart({ id, version }),
    { concurrency: 5 }
  );
  console.log('Carts removed', removedCarts.length);
};

const removeOrders = async () => {
  const orders = await getAllOrders();

  console.log('orders to remove', orders.length);

  const removedOrders = await BPromise.map(
    orders,
    ({ id, version }) => deleteOrder({ id, version }),
    { concurrency: 5 }
  );
  console.log('orders removed', removedOrders.length);
};

const removeCustomers = async () => {
  const customers = await getAllCustomers();

  console.log('customers to remove', customers.length);

  const removedcustomers = await BPromise.map(
    customers,
    ({ id, version }) => deleteCustomer({ id, version }),
    { concurrency: 5 }
  );
  console.log('customers removed', removedcustomers.length);
};

const removeCompanies = async () => {
  const companies = await findCompanies({ all: true });
  console.log('companies to remove', companies.total);

  const removedCompanies = await BPromise.map(
    companies.results,
    company => removeCompany(company.id),
    { concurrency: 5 }
  );
  console.log('companies removed', removedCompanies.length);
};

const cleanAllData = async () => {
  // REMOVE CARTS
  await removeCarts();
  // REMOVE ORDERS
  await removeOrders();
  // REMOVE CUSTOMERS
  await removeCustomers();
  // REMOVE COMPANIES
  await removeCompanies();
};

const run = async () => {
  await cleanAllData();
};

return run();
