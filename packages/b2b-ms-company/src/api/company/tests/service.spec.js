const oldEnv = process.env;
process.env.LOCALE = 'es';
const uuidv1 = require('uuid/v1');
const { companyToContainer } = require('../converter');
jest.mock('uuid/v1');
jest.mock('../validator');

const key = 'key';
const container = 'company';
const buildService = plugins => require('../service')({ ...plugins });

const companyDraft = {
  name: 'company',
  logo: 'logo',
  channels: ['channel'],
  budget: [],
  approverRoles: [],
  addresses: [{ title: 'address', id: 'key' }],
  requiredApprovalRoles: ['b2b-company-admin']
};

const company = {
  ...companyDraft,
  addresses: companyDraft.addresses.map(address => ({ ...address, id: key })),
  customerGroup: { version: 1, key, id: 'customerGroup' },
  store: { version: 1, key, id: 'store' },
  id: key,
  rules: [],
  createdAt: '2019-12-18T16:44:39.622Z',
  lastModifiedAt: '2019-12-18T16:44:39.622Z'
};

describe('service', () => {
  let response, service;
  afterAll(() => {
    process.env = oldEnv;
  });
  describe('find', () => {
    let customObjectRepositoryFindSpy;

    beforeEach(async () => {
      customObjectRepositoryFindSpy = jest.fn().mockResolvedValue({
        results: [
          {
            value: company,
            lastModifiedAt: company.lastModifiedAt,
            createdAt: company.createdAt,
            key
          }
        ]
      });
      service = buildService({
        commercetools: {
          repositories: {
            CustomObjectRepository: { find: customObjectRepositoryFindSpy }
          }
        }
      });
      response = await service.find({
        page: 1,
        perPage: 10,
        sortBy: 'createdAt',
        sortDirection: 'asc'
      });
    });
    it('should call CustomObjectRepository.find with correct values', () => {
      expect(customObjectRepositoryFindSpy).toHaveBeenCalledWith({
        page: 1,
        perPage: 10,
        where: [`container="${container}"`],
        sortBy: 'createdAt',
        sortDirection: 'asc'
      });
    });
    it('should return the correct response', () => {
      expect(response).toEqual({ results: [company] });
    });
    describe('when all parameter is set to true', () => {
      let customObjectRepositoryFindAllSpy;
      beforeEach(() => {
        customObjectRepositoryFindAllSpy = jest.fn().mockResolvedValue({
          results: [
            {
              value: company,
              lastModifiedAt: company.lastModifiedAt,
              createdAt: company.createdAt,
              key
            }
          ]
        });
        service = buildService({
          commercetools: {
            repositories: {
              CustomObjectRepository: {
                findAll: customObjectRepositoryFindAllSpy
              }
            }
          }
        });
        service.find({
          page: 1,
          perPage: 10,
          sortBy: 'createdAt',
          sortDirection: 'asc',
          all: true
        });
      });
      it('should call CustomObjectRepository.findAll with correct values', () => {
        expect(customObjectRepositoryFindAllSpy).toHaveBeenCalledWith({
          sortBy: 'createdAt',
          sortDirection: 'asc',
          where: ['container="company"']
        });
      });
    });
  });
  describe('get', () => {
    let customObjectFindSpy, storeGetSpy, customerGroupGetSpy;
    describe('when succes', () => {
      beforeEach(async () => {
        customObjectFindSpy = jest.fn().mockResolvedValue({
          results: [
            {
              value: company,
              lastModifiedAt: company.lastModifiedAt,
              createdAt: company.lastModifiedAt,
              key
            }
          ]
        });
        storeGetSpy = jest.fn().mockResolvedValue(company.store);
        customerGroupGetSpy = jest
          .fn()
          .mockResolvedValue(company.customerGroup);
        service = buildService({
          commercetools: {
            repositories: {
              CustomObjectRepository: { find: customObjectFindSpy },
              StoreRepository: {
                get: storeGetSpy
              },
              CustomerGroupRepository: {
                get: customerGroupGetSpy
              }
            }
          }
        });
        response = await service.get(key);
      });
      it('should call CustomObjectRepository.find with correct values', () => {
        expect(customObjectFindSpy).toHaveBeenCalledWith({
          where: [`key="${key}"`]
        });
      });
      it('should return the correct response', () => {
        expect(response).toEqual(company);
      });
    });
    describe('when company not found', () => {
      beforeEach(async () => {
        customObjectFindSpy = jest.fn().mockResolvedValue({ results: [] });
        service = buildService({
          commercetools: {
            repositories: {
              CustomObjectRepository: { find: customObjectFindSpy }
            }
          }
        });
        response = await service.get(key);
      });
      it('should return the correct response', () => {
        expect(response).toBeNull();
      });
    });
  });
  describe('create', () => {
    let customerGroupRepositoryCreateSpy,
      storeRepositoryCreateSpy,
      customObjectRepositoryCreateSpy;
    beforeEach(() => {
      uuidv1.mockReturnValue(key);
    });
    describe('when success', () => {
      beforeEach(async () => {
        customerGroupRepositoryCreateSpy = jest
          .fn()
          .mockResolvedValue(company.customerGroup);
        storeRepositoryCreateSpy = jest.fn().mockResolvedValue(company.store);
        customObjectRepositoryCreateSpy = jest.fn().mockResolvedValue({
          value: company,
          lastModifiedAt: company.lastModifiedAt,
          createdAt: company.createdAt,
          key
        });
        service = buildService({
          commercetools: {
            repositories: {
              CustomerGroupRepository: {
                create: customerGroupRepositoryCreateSpy
              },
              StoreRepository: {
                create: storeRepositoryCreateSpy
              },
              CustomObjectRepository: {
                create: customObjectRepositoryCreateSpy
              }
            }
          }
        });
        response = await service.create(companyDraft);
      });
      it('should call CustomerGroupRepository.create with correct values', () => {
        expect(customerGroupRepositoryCreateSpy).toHaveBeenCalledWith({
          key,
          groupName: company.name
        });
      });
      it('should call StoreRepository.create with correct values', () => {
        expect(storeRepositoryCreateSpy).toHaveBeenCalledWith({
          key,
          name: { es: company.name }
        });
      });
      it('should call CustomObjectRepository.create with correct values', () => {
        expect(customObjectRepositoryCreateSpy).toHaveBeenCalledWith({
          container: 'company',
          key,
          value: {
            ...companyDraft,
            customerGroup: { key, typeId: 'customer-group' },
            store: { typeId: 'store', key },
            addresses: [{ id: key, title: 'address' }],
            rules: []
          }
        });
      });
      it('should return the correct response', () => {
        expect(response).toEqual(company);
      });
    });
  });
  describe('update', () => {
    describe('when success', () => {
      let companyDraft,
        customObjectUpdateSpy,
        company,
        companyContainer,
        companyContainerDraft;
      beforeEach(async () => {
        companyDraft = {
          name: 'testCompany',
          createdAt: '2019-12-18T16:44:39.622Z',
          lastModifiedAt: '2019-12-18T16:44:39.622Z',
          customerGroup: 'customerGroup',
          approverRoles: [],
          requiredApprovalRoles: [],
          store: 'store'
        };
        company = {
          ...companyDraft,
          id: key,
          channels: [],
          addresses: [],
          budget: [],
          rules: []
        };
        companyContainerDraft = {
          key,
          container,
          value: {
            name: 'testCompany',
            channels: [],
            budget: [],
            addresses: [],
            requiredApprovalRoles: [],
            customerGroup: { key, typeId: 'customer-group' },
            store: { key, typeId: 'store' },
            approverRoles: [],
            rules: []
          }
        };
        companyContainer = {
          ...companyContainerDraft,
          createdAt: '2019-12-18T16:44:39.622Z',
          lastModifiedAt: '2019-12-18T16:44:39.622Z'
        };
        customObjectUpdateSpy = jest.fn().mockResolvedValue(companyContainer);
        service = buildService({
          commercetools: {
            repositories: {
              CustomObjectRepository: {
                update: customObjectUpdateSpy
              }
            }
          }
        });
        service.get = jest.fn().mockResolvedValue(company);
        response = await service.update(key, companyDraft);
      });
      it('should call service.get with correct values', () => {
        expect(service.get).toHaveBeenCalledWith(key);
      });

      it('should call CustomObjectRepository.update with correct values', () => {
        expect(customObjectUpdateSpy).toHaveBeenCalledWith(
          companyContainerDraft
        );
      });
      it('should return the correct response', () => {
        expect(response).toEqual(company);
      });
    });
    describe('when change the company name', () => {
      let storeRepositoryUpdateSpy, customerGroupRepositoryUpdateSpy;
      beforeEach(async () => {
        storeRepositoryUpdateSpy = jest.fn();
        customerGroupRepositoryUpdateSpy = jest.fn();
        service = buildService({
          commercetools: {
            repositories: {
              CustomObjectRepository: {
                update: jest.fn().mockResolvedValue({ value: {} })
              },
              StoreRepository: {
                update: storeRepositoryUpdateSpy
              },
              CustomerGroupRepository: {
                update: customerGroupRepositoryUpdateSpy
              }
            }
          }
        });
        service.get = jest.fn().mockResolvedValue({
          name: 'init',
          store: { id: 'store', version: 1 },
          customerGroup: { id: 'customerGroup', version: 1 }
        });
        await service.update(key, {
          name: 'change'
        });
      });
      it('should call StoreRepository.update with correct values', () => {
        expect(storeRepositoryUpdateSpy).toHaveBeenCalledWith('store', 1, [
          { action: 'setName', name: { es: 'change' } }
        ]);
      });
      it('should call CustomerGroupRepository.update with correct values', () => {
        expect(
          customerGroupRepositoryUpdateSpy
        ).toHaveBeenCalledWith('customerGroup', 1, [
          { action: 'changeName', name: 'change' }
        ]);
      });
    });
  });
  describe('patch', () => {
    let customObjectUpdateSpy, companyDraft;
    beforeEach(async () => {
      companyDraft = { defaultShippingAddress: 'testId' };
      customObjectUpdateSpy = jest.fn().mockResolvedValue({
        ...companyToContainer(company),
        createdAt: '2019-12-18T16:44:39.622Z',
        lastModifiedAt: '2019-12-18T16:44:39.622Z'
      });
      service = buildService({
        commercetools: {
          repositories: {
            CustomObjectRepository: {
              update: customObjectUpdateSpy
            }
          }
        }
      });
      response = await service.patch(company, companyDraft);
    });

    it('should call CustomObjectRepository.update with correct values', () => {
      expect(customObjectUpdateSpy).toHaveBeenCalledWith(
        companyToContainer({ ...company, ...companyDraft })
      );
    });
    it('should return the correct response', () => {
      expect(response).toEqual(company);
    });
  });
  describe('delete', () => {
    describe('when success', () => {
      let getSpy;
      let cartFindAllSpy;
      let orderFindAllSpy;
      let customerFindAllSpy;
      let customerGroupDeleteSpy;
      let storeDeleteSpy;
      let customObjectDeleteSpy;
      beforeEach(async () => {
        cartFindAllSpy = jest.fn().mockResolvedValue({ results: [] });
        orderFindAllSpy = jest.fn().mockResolvedValue({ results: [] });
        customerFindAllSpy = jest.fn().mockResolvedValue({ results: [] });
        customerGroupDeleteSpy = jest.fn();
        storeDeleteSpy = jest.fn();
        customObjectDeleteSpy = jest.fn();
        service = buildService({
          commercetools: {
            repositories: {
              CustomObjectRepository: {
                find: jest.fn().mockResolvedValue({
                  results: [
                    {
                      value: company,
                      key: company.id,
                      createdAt: company.createdAt,
                      lastModifiedAt: company.lastModifiedAt
                    }
                  ]
                }),
                deleteByContainerAndKey: customObjectDeleteSpy
              },
              StoreRepository: {
                get: jest.fn().mockResolvedValue(company.store),
                delete: storeDeleteSpy
              },
              CustomerGroupRepository: {
                get: jest.fn().mockResolvedValue(company.customerGroup),
                delete: customerGroupDeleteSpy
              },
              CartRepository: {
                findAll: cartFindAllSpy
              },
              OrderRepository: {
                findAll: orderFindAllSpy
              },
              CustomerRepository: {
                findAll: customerFindAllSpy
              }
            }
          }
        });
        getSpy = jest.spyOn(service, 'get');
        response = await service.remove(key);
      });
      it('should call service.get with correct values', () => {
        expect(getSpy).toHaveBeenCalledWith(key);
      });
      it('should call CartRepository.findAll with correct values', () => {
        expect(cartFindAllSpy).toHaveBeenCalledWith({
          where: [`customerGroup(id="${company.customerGroup.id}")`]
        });
      });
      it('should call OrderRepository.findAll with correct values', () => {
        expect(orderFindAllSpy).toHaveBeenCalledWith({
          where: [`customerGroup(id="${company.customerGroup.id}")`]
        });
      });
      it('should call CustomerRepository.findAll with correct values', () => {
        expect(customerFindAllSpy).toHaveBeenCalledWith({
          where: [`customerGroup(id="${company.customerGroup.id}")`]
        });
      });
      it('should call CustomerGroupRepository.delete with correct values', () => {
        expect(customerGroupDeleteSpy).toHaveBeenCalledWith(
          company.customerGroup.id,
          company.customerGroup.version
        );
      });
      it('should call StoreRepository.delete with correct values', () => {
        expect(storeDeleteSpy).toHaveBeenCalledWith(
          company.store.id,
          company.store.version
        );
      });
      it('should call CustomObjectRepository.deleteByContainerAndKey with correct values', () => {
        expect(customObjectDeleteSpy).toHaveBeenCalledWith(
          container,
          company.id
        );
      });
      it('should return the correct response', () => {
        expect(response).toEqual(company);
      });
    });
    describe('when company has carts related', () => {
      let error;
      beforeEach(async () => {
        service = buildService({
          commercetools: {
            repositories: {
              CustomObjectRepository: {
                find: jest
                  .fn()
                  .mockResolvedValue({ results: [{ value: company }] })
              },
              StoreRepository: {
                get: jest.fn()
              },
              CustomerGroupRepository: {
                get: jest.fn().mockResolvedValue(company.customerGroup)
              },
              CartRepository: {
                findAll: jest.fn().mockResolvedValue({ results: ['cart'] })
              },
              OrderRepository: {
                findAll: jest.fn().mockResolvedValue({ results: [] })
              },
              CustomerRepository: {
                findAll: jest.fn().mockResolvedValue({ results: [] })
              }
            }
          }
        });
        try {
          await service.remove(key);
        } catch (e) {
          error = e;
        }
      });
      it('should throw the correct error', () => {
        expect(error.message).toBe(
          'Can not remove a Company with Employees, Carts or Orders'
        );
      });
    });

    describe('when company has orders related', () => {
      let error;
      beforeEach(async () => {
        service = buildService({
          commercetools: {
            repositories: {
              CustomObjectRepository: {
                find: jest
                  .fn()
                  .mockResolvedValue({ results: [{ value: company }] })
              },
              StoreRepository: {
                get: jest.fn()
              },
              CustomerGroupRepository: {
                get: jest.fn().mockResolvedValue(company.customerGroup)
              },
              CartRepository: {
                findAll: jest.fn().mockResolvedValue({ results: [] })
              },
              OrderRepository: {
                findAll: jest.fn().mockResolvedValue({ results: ['orders'] })
              },
              CustomerRepository: {
                findAll: jest.fn().mockResolvedValue({ results: [] })
              }
            }
          }
        });
        try {
          await service.remove(key);
        } catch (e) {
          error = e;
        }
      });
      it('should throw the correct error', () => {
        expect(error.message).toBe(
          'Can not remove a Company with Employees, Carts or Orders'
        );
      });
    });

    describe('when company has employees related', () => {
      let error;
      beforeEach(async () => {
        service = buildService({
          commercetools: {
            repositories: {
              CustomObjectRepository: {
                find: jest
                  .fn()
                  .mockResolvedValue({ results: [{ value: company }] })
              },
              StoreRepository: {
                get: jest.fn()
              },
              CustomerGroupRepository: {
                get: jest.fn().mockResolvedValue(company.customerGroup)
              },
              CartRepository: {
                findAll: jest.fn().mockResolvedValue({ results: [] })
              },
              OrderRepository: {
                findAll: jest.fn().mockResolvedValue({ results: [] })
              },
              CustomerRepository: {
                findAll: jest.fn().mockResolvedValue({ results: ['employee'] })
              }
            }
          }
        });
        try {
          await service.remove(key);
        } catch (e) {
          error = e;
        }
      });
      it('should throw the correct error', () => {
        expect(error.message).toBe(
          'Can not remove a Company with Employees, Carts or Orders'
        );
      });
    });

    describe('when doesnt find the company', () => {
      beforeEach(async () => {
        service = buildService({
          commercetools: {
            repositories: {
              CustomObjectRepository: {
                find: jest.fn().mockResolvedValue({ results: [] })
              }
            }
          }
        });
        response = await service.remove(key, {});
      });
      it('should return null', () => {
        expect(response).toBeNull();
      });
    });
  });
});
