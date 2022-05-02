const createService = require('../base.js');

module.exports = () => {
  const { getAll, findEntity, deleteEntity, createEntity } = createService(
    'carts'
  );

  const service = {
    getAllCarts: getAll,
    findCarts: findEntity,
    deleteCart: deleteEntity,
    createCart: createEntity
  };

  return service;
};
