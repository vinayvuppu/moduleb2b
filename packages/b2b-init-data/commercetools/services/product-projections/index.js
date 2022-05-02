const createService = require('../base.js');

module.exports = () => {
  const { getAll, findEntity } = createService('productProjections');

  const service = {
    getAllProducts: getAll,
    findProducts: findEntity
  };

  return service;
};
