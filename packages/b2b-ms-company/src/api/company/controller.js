const { validateFields } = require('./validator');

module.exports = fastify => {
  const service = require('./service')(fastify);

  const find = async (request, reply) => {
    const { page, perPage, sortBy, sortDirection, all } = request.query;

    const companies = await service.find({
      page,
      perPage,
      sortBy,
      sortDirection,
      all
    });

    return reply.code(200).send(companies);
  };

  const get = async (request, reply) => {
    const { id } = request.params;
    const obj = await service.get(id);

    return obj ? reply.code(200).send(obj) : reply.callNotFound();
  };

  const create = async (request, reply) => {
    const { body: draft } = request;

    validateFields(draft);

    const obj = await service.create(draft);

    if (!obj) {
      reply.code(500);
      return {};
    }

    return reply.code(201).send(obj);
  };

  const update = async (request, reply) => {
    const { id } = request.params;
    const draft = request.body;

    validateFields(draft);

    const obj = await service.update(id, draft);

    if (!obj) {
      return reply.callNotFound();
    }

    return reply.code(200).send(obj);
  };

  const remove = async (request, reply) => {
    const { id } = request.params;
    const obj = await service.remove(id);

    if (!obj) {
      return reply.callNotFound();
    }

    return reply.code(200).send(obj);
  };

  const handlePathFields = async ({ id, ...companyDraft }, reply) => {
    const company = await service.get(id);

    if (!company) {
      return reply.callNotFound();
    }

    validateFields({ ...company, ...companyDraft });

    const updatedCompany = await service.patch(company, companyDraft);

    return reply.code(200).send(updatedCompany);
  };

  const setDefaultBillingAddress = async (request, reply) => {
    const { id } = request.params;
    const { addressId } = request.body;

    return handlePathFields({ id, defaultBillingAddress: addressId }, reply);
  };

  const setDefaultShippingAddress = async (request, reply) => {
    const { id } = request.params;
    const { addressId } = request.body;
    return handlePathFields({ id, defaultShippingAddress: addressId }, reply);
  };

  return {
    find,
    get,
    create,
    update,
    remove,
    setDefaultBillingAddress,
    setDefaultShippingAddress
  };
};
