jest.mock('../service');
const Service = require('../service');
const { ApiError } = require('../../../errors');

const controller = require('../controller')({
  config: {}
});

describe('controller', () => {
  let request;
  let reply;
  let service;

  beforeEach(() => {
    service = Service({});

    request = {
      log: { error: () => {}, warn: () => {}, debug: () => {} },
      body: {},
      params: {},
      query: {}
    };
    reply = {
      code: jest.fn(code => {
        return {
          send: data => {
            return { statusCode: code, body: data };
          }
        };
      }),
      send: jest.fn(data => {
        return { statusCode: 200, body: data };
      })
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('find', () => {
    const query = {
      page: 1,
      perPage: 10,
      sortBy: 'createdAt',
      sortDirection: 'desc'
    };
    let findSpy;
    beforeEach(async () => {
      findSpy = jest.spyOn(service, 'find');
      await controller.find({ query }, reply);
    });

    it('should call service.find with correct values', () => {
      expect(findSpy).toHaveBeenCalledWith(query);
    });
    it('should call reply.code with correct values', () => {
      expect(reply.code).toHaveBeenCalledWith(200);
    });
  });

  describe('get', () => {
    let serviceSpy;
    let id;

    beforeAll(() => {
      id = 'key1';
    });

    beforeEach(async () => {
      serviceSpy = jest.spyOn(service, 'get');

      await controller.get({ ...request, params: { id } }, reply);
    });

    it('should call to service get method', () => {
      expect(serviceSpy).toHaveBeenCalledWith(id);
    });

    it('should return code 200', () => {
      expect(reply.code).toHaveBeenCalledWith(200);
    });
  });

  describe('create', () => {
    let serviceSpy;
    let draft;

    describe('when success', () => {
      beforeAll(() => {
        draft = {
          name: 'sampleName',
          budget: [
            { rol: 'a', amount: { currrency: 'USD', centAmount: 1 } },
            { rol: 'b', amount: { currrency: 'USD', centAmount: 1 } }
          ]
        };
      });

      beforeEach(async () => {
        serviceSpy = jest.spyOn(service, 'create');

        await controller.create({ ...request, body: draft }, reply);
      });

      it('should call to service create method', () => {
        expect(serviceSpy).toHaveBeenCalledWith(draft);
      });

      it('should return code 201', () => {
        expect(reply.code).toHaveBeenCalledWith(201);
      });
    });

    describe('when fails', () => {
      describe('when the rols are repeated in the budget', () => {
        beforeAll(() => {
          draft = {
            name: 'sampleName',
            budget: [
              { rol: 'a', amount: { currrency: 'USD', centAmount: 1 } },
              { rol: 'a', amount: { currrency: 'USD', centAmount: 1 } }
            ]
          };
        });

        beforeEach(async () => {
          serviceSpy = jest.spyOn(service, 'create');
        });

        it('should throw the validation error', async () => {
          await expect(
            controller.create({ ...request, body: draft }, reply)
          ).rejects.toEqual(
            new ApiError({
              title: `Only one budget is allowed per role`,
              status: 400
            })
          );
        });
      });
    });
  });

  describe('update', () => {
    let serviceSpy;
    let id;
    let draft;
    describe('when success', () => {
      beforeAll(() => {
        id = 'key1';
        draft = { name: 'sampleName' };
      });

      beforeEach(async () => {
        serviceSpy = jest.spyOn(service, 'update');

        await controller.update(
          { ...request, params: { id }, body: draft },
          reply
        );
      });

      it('should call to service update method', () => {
        expect(serviceSpy).toHaveBeenCalledWith(id, draft);
      });

      it('should return code 200', () => {
        expect(reply.code).toHaveBeenCalledWith(200);
      });
    });
    describe('when fails', () => {
      describe('when the rols are repeated in the budget', () => {
        beforeAll(() => {
          id = 'key1';
          draft = {
            name: 'sampleName',
            budget: [
              { rol: 'a', amount: { currrency: 'USD', centAmount: 1 } },
              { rol: 'a', amount: { currrency: 'USD', centAmount: 1 } }
            ]
          };
        });

        beforeEach(async () => {
          serviceSpy = jest.spyOn(service, 'update');
        });

        it('should throw the validation error', async () => {
          await expect(
            controller.update(
              { ...request, params: { id }, body: draft },
              reply
            )
          ).rejects.toEqual(
            new ApiError({
              title: `Only one budget is allowed per role`,
              status: 400
            })
          );
        });
      });
    });
  });

  describe('remove', () => {
    let serviceSpy;
    let id;

    beforeAll(() => {
      id = 'key1';
    });

    beforeEach(async () => {
      serviceSpy = jest.spyOn(service, 'remove');

      await controller.remove({ ...request, params: { id } }, reply);
    });

    it('should call to service remove method', () => {
      expect(serviceSpy).toHaveBeenCalledWith(id);
    });

    it('should return code 200', () => {
      expect(reply.code).toHaveBeenCalledWith(200);
    });
  });

  describe('setDefaultBillingAddress', () => {
    let serviceSpy;
    let id;
    let draft;
    let company;

    describe('when success', () => {
      beforeAll(() => {
        id = 'key1';
        draft = { addressId: 'sampleId' };
      });

      beforeEach(async () => {
        company = {
          id,
          addresses: [{ id: 'sampleId' }]
        };
        jest.spyOn(service, 'get').mockResolvedValue(company);
        serviceSpy = jest.spyOn(service, 'patch');

        await controller.setDefaultBillingAddress(
          { ...request, params: { id }, body: draft },
          reply
        );
      });

      it('should call to service patch method', () => {
        expect(serviceSpy).toHaveBeenCalledWith(company, {
          defaultBillingAddress: draft.addressId
        });
      });

      it('should return code 200', () => {
        expect(reply.code).toHaveBeenCalledWith(200);
      });
    });
    describe('when fails', () => {
      describe('when validation fails', () => {
        beforeAll(() => {
          id = 'key1';
          draft = { addressId: 'sampleId' };
        });

        beforeEach(async () => {
          company = {
            id,
            addresses: [{ id: 'sampleId2' }]
          };
          jest.spyOn(service, 'get').mockResolvedValue(company);
          serviceSpy = jest.spyOn(service, 'patch');
        });

        it('should throw the validation error', async () => {
          await expect(
            controller.setDefaultBillingAddress(
              { ...request, params: { id }, body: draft },
              reply
            )
          ).rejects.toEqual(
            new ApiError({
              title: `Address with id sampleId, doesn't exist in addresses.`,
              status: 400
            })
          );
        });
      });
    });
  });

  describe('setDefaultShippingAddress', () => {
    let serviceSpy;
    let id;
    let draft;
    let company;
    describe('when success', () => {
      beforeAll(() => {
        id = 'key1';
        draft = { addressId: 'sampleId' };
      });

      beforeEach(async () => {
        company = {
          id,
          addresses: [{ id: 'sampleId' }]
        };
        jest.spyOn(service, 'get').mockResolvedValue(company);
        serviceSpy = jest.spyOn(service, 'patch');

        await controller.setDefaultShippingAddress(
          { ...request, params: { id }, body: draft },
          reply
        );
      });

      it('should call to service patch method', () => {
        expect(serviceSpy).toHaveBeenCalledWith(company, {
          defaultShippingAddress: draft.addressId
        });
      });

      it('should return code 200', () => {
        expect(reply.code).toHaveBeenCalledWith(200);
      });
    });
    describe('when fails', () => {
      describe('when validation fails', () => {
        beforeAll(() => {
          id = 'key1';
          draft = { addressId: 'sampleId' };
        });

        beforeEach(async () => {
          company = {
            id,
            addresses: [{ id: 'sampleId2' }]
          };
          jest.spyOn(service, 'get').mockResolvedValue(company);
          serviceSpy = jest.spyOn(service, 'patch');
        });

        it('should throw the validation error', async () => {
          await expect(
            controller.setDefaultShippingAddress(
              { ...request, params: { id }, body: draft },
              reply
            )
          ).rejects.toEqual(
            new ApiError({
              title: `Address with id sampleId, doesn't exist in addresses.`,
              status: 400
            })
          );
        });
      });
    });
  });
});
