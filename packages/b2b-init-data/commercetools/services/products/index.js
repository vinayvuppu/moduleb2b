const createService = require('../base.js');

module.exports = () => {
  const { deleteEntity, updateEntity } = createService('products');

  const service = {
    deleteProduct: deleteEntity,
    updateProduct: updateEntity
  };

  return service;
};
