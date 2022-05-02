const createService = require('../base.js');

module.exports = () => {
  const { getAll, findEntity, deleteEntity, createEntity } = createService(
    'customers'
  );

  const service = {
    getAllCustomers: getAll,
    findCustomers: findEntity,
    deleteCustomer: deleteEntity,
    createCustomer: createEntity
  };

  return service;
};
