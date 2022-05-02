/* eslint-disable no-unused-vars */
const uuidv1 = require('uuid/v1');
const { ApiError } = require('../../errors');
const { companyToContainer, containerToCompany } = require('./converter');

const container = 'company';
const { LOCALE: locale } = process.env;

module.exports = fastify => {
  const {
    CustomObjectRepository,
    CustomerGroupRepository,
    StoreRepository,
    CartRepository,
    OrderRepository,
    CustomerRepository
  } = fastify.commercetools.repositories;

  const service = {};

  service.find = async ({ page, perPage, sortBy, sortDirection, all }) => {
    const where = [`container="${container}"`];

    const commonFindParams = { where, sortBy, sortDirection };

    const companiesResult = await (all
      ? CustomObjectRepository.findAll(commonFindParams)
      : CustomObjectRepository.find({ ...commonFindParams, page, perPage }));

    return {
      ...companiesResult,
      results: companiesResult.results.map(containerToCompany)
    };
  };

  service.get = async id => {
    const response = await CustomObjectRepository.find({
      where: [`key="${id}"`]
    });
    const company = response.results[0];
    let store, customerGroup;

    if (!company) return null;

    try {
      store = await StoreRepository.get(`key=${id}`);
      // eslint-disable-next-line no-empty
    } catch (e) {}

    try {
      customerGroup = await CustomerGroupRepository.get(`key=${id}`);
      // eslint-disable-next-line no-empty
    } catch (e) {}

    return containerToCompany({
      ...company,
      value: { ...company.value, store, customerGroup }
    });
  };

  service.create = async ({ name, ...companyDraft }) => {
    const key = uuidv1();
    const [customerGroup, store] = await Promise.all([
      CustomerGroupRepository.create({
        key,
        groupName: name
      }),
      StoreRepository.create({ key, name: { [locale]: name } })
    ]);

    const companyContainer = companyToContainer({
      ...companyDraft,
      name,
      id: key
    });

    const company = await CustomObjectRepository.create(companyContainer);

    return containerToCompany({
      ...company,
      value: { ...company.value, store, customerGroup }
    });
  };

  service.update = async (id, companyDraft) => {
    const company = await service.get(id);
    if (!company) return null;

    let store = company.store;
    let customerGroup = company.customerGroup;

    if (companyDraft.name !== company.name) {
      store = await StoreRepository.update(store.id, store.version, [
        { action: 'setName', name: { [locale]: companyDraft.name } }
      ]);
      customerGroup = await CustomerGroupRepository.update(
        customerGroup.id,
        customerGroup.version,
        [{ action: 'changeName', name: companyDraft.name }]
      );
    }

    const companyContainer = companyToContainer({ ...companyDraft, id });

    const updatedCompanyContainer = await CustomObjectRepository.update(
      companyContainer
    );

    return {
      ...containerToCompany(updatedCompanyContainer),
      customerGroup,
      store
    };
  };

  service.patch = async (company, companyDraft) => {
    const updatedCompanyDraft = { ...company, ...companyDraft };

    const updatedCompany = await CustomObjectRepository.update(
      companyToContainer(updatedCompanyDraft)
    );

    return containerToCompany({
      ...updatedCompany,
      value: {
        ...updatedCompany.value,
        store: company.store,
        customerGroup: company.customerGroup
      }
    });
  };

  service.remove = async id => {
    const company = await service.get(id);

    if (!company) return null;

    if (company.customerGroup) {
      const query = {
        where: [`customerGroup(id="${company.customerGroup.id}")`]
      };
      const [
        cartResponse,
        orderResponse,
        customerResponse
      ] = await Promise.all([
        CartRepository.findAll(query),
        OrderRepository.findAll(query),
        CustomerRepository.findAll(query)
      ]);

      if (
        cartResponse.results.length ||
        orderResponse.results.length ||
        customerResponse.results.length
      ) {
        throw new ApiError({
          status: '400',
          code: '002',
          title: 'Can not remove a Company with Employees, Carts or Orders',
          detail: 'Can not remove a Company with Employees, Carts or Orders'
        });
      }

      await CustomerGroupRepository.delete(
        company.customerGroup.id,
        company.customerGroup.version
      );
    }

    if (company.store) {
      await StoreRepository.delete(company.store.id, company.store.version);
    }

    await CustomObjectRepository.deleteByContainerAndKey(container, id);

    return company;
  };

  return service;
};
