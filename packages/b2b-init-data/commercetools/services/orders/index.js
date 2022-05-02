const createService = require('../base.js');

module.exports = () => {
  const { getAll, deleteEntity } = createService('orders');

  const service = {
    getAllOrders: getAll,
    deleteOrder: deleteEntity
  };

  return service;
};
