const schema = require('./company/schema');

module.exports = async fastify => {
  const controller = require('./company/controller')(fastify);

  fastify.route({
    method: 'GET',
    url: '/',
    schema: schema.find,
    handler: controller.find
  });

  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: schema.get,
    handler: controller.get
  });

  fastify.route({
    method: 'POST',
    url: '/',
    schema: schema.create,
    handler: controller.create
  });

  fastify.route({
    method: 'PUT',
    url: '/:id',
    schema: schema.update,
    handler: controller.update
  });

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: schema.remove,
    handler: controller.remove
  });

  fastify.route({
    method: 'PATCH',
    url: '/:id/setDefaultBillingAddress',
    schema: schema.setDefaultBillingAddress,
    handler: controller.setDefaultBillingAddress
  });

  fastify.route({
    method: 'PATCH',
    url: '/:id/setDefaultShippingAddress',
    schema: schema.setDefaultShippingAddress,
    handler: controller.setDefaultShippingAddress
  });
};
