jest.mock('uuid/v1', () => () => 'id');
const { makeResolvers } = require('../resolvers');

describe('query and mutation resolvers', () => {
  let resolvers;
  let CartRepository;
  let TaxCategoryRepository;
  let CustomObjectRepository;
  let response;
  describe('query quote resolver', () => {
    describe('when success', () => {
      beforeEach(async () => {
        CartRepository = {
          get: jest.fn().mockResolvedValue({
            id: 'quote-id',
            customerId: '124',
            customerGroup: { obj: { key: 'cg-1', name: 'company name' } },
            lineItems: [],
            custom: {
              fields: {
                isQuote: true
              }
            }
          })
        };
        resolvers = makeResolvers({ CartRepository });
        response = await resolvers.Query.quote({}, { id: 'quote-id' });
      });

      it('should call to CartRepository.get', () => {
        expect(CartRepository.get).toHaveBeenCalled();
      });

      it('should return the quote', () => {
        expect(response).toEqual({
          company: { id: 'cg-1', name: 'company name' },
          customerGroup: { key: 'cg-1' },
          employeeId: '124',
          id: 'quote-id',
          lineItems: [],
          originalTotalPrice: undefined
        });
      });
    });

    describe('when error', () => {
      beforeEach(() => {
        CartRepository = {
          get: jest.fn().mockRejectedValue({
            errors: 'Error1'
          })
        };
        resolvers = makeResolvers({ CartRepository });
      });

      it('should throw  error', async () => {
        await expect(
          resolvers.Query.quote({}, { id: 'customer-id' })
        ).rejects.toEqual({ errors: 'Error1' });
      });
    });
  });

  describe('query quotes resolver', () => {
    describe('when success', () => {
      beforeEach(async () => {
        CartRepository = {
          find: jest.fn().mockResolvedValue({
            results: [
              {
                id: 'quote-id',
                customerId: '124',
                customerGroup: { obj: { key: 'cg-1', name: 'company name' } },
                lineItems: [],
                custom: {
                  fields: {
                    isQuote: true
                  }
                }
              }
            ]
          })
        };
        resolvers = makeResolvers({ CartRepository });
        response = await resolvers.Query.quotes({}, {});
      });

      it('should call to CartRepository.find', () => {
        expect(CartRepository.find).toHaveBeenCalled();
      });

      it('should return the quote result page', () => {
        expect(response).toEqual({
          results: [
            {
              company: { id: 'cg-1', name: 'company name' },
              customerGroup: { key: 'cg-1', typeId: undefined },
              employeeId: '124',
              id: 'quote-id',
              lineItems: [],
              originalTotalPrice: undefined
            }
          ]
        });
      });
    });

    describe('when error', () => {
      beforeEach(() => {
        CartRepository = {
          find: jest.fn().mockRejectedValue({
            errors: 'Error1'
          })
        };
        resolvers = makeResolvers({ CartRepository });
      });

      it('should throw  error', async () => {
        await expect(resolvers.Query.quotes({}, {})).rejects.toEqual({
          errors: 'Error1'
        });
      });
    });
  });

  describe('mutation create quote', () => {
    describe('when success', () => {
      beforeEach(async () => {
        CustomObjectRepository = {
          find: jest.fn().mockResolvedValue({
            results: [
              {
                value: 4
              }
            ]
          }),
          update: jest.fn().mockResolvedValue({
            value: 5
          })
        };
        CartRepository = {
          create: jest.fn().mockResolvedValue({
            id: 'quote-id',
            customerId: '124',
            currency: 'USD',
            customerGroup: { obj: { key: 'cg-1', name: 'company name' } },
            store: {
              typeId: 'store',
              key: 'cg-1'
            },
            lineItems: [],
            custom: {
              fields: {
                isQuote: true
              }
            }
          })
        };
        resolvers = makeResolvers({ CartRepository, CustomObjectRepository });
        response = await resolvers.Mutation.createQuote(
          {},
          {
            draft: {
              employeeId: '124',
              companyId: 'cg-1',
              currency: 'USD'
            }
          }
        );
      });

      it('should call to CartRepository.create', () => {
        expect(CartRepository.create).toHaveBeenCalledWith(
          {
            currency: 'USD',
            custom: {
              fields: {
                isQuote: true,
                quoteState: 'initial',
                quoteNumber: '0000000005'
              },
              type: { key: 'quote-type', typeId: 'type' }
            },
            customerId: '124',
            store: { key: 'cg-1', typeId: 'store' }
          },
          { expand: ['customerGroup'] }
        );
      });

      it('should return the quote', () => {
        expect(response).toEqual({
          company: { id: 'cg-1', name: 'company name' },
          currency: 'USD',
          customerGroup: { key: 'cg-1', typeId: undefined },
          employeeId: '124',
          id: 'quote-id',
          lineItems: [],
          originalTotalPrice: undefined,
          store: { key: 'cg-1', typeId: 'store' }
        });
      });
    });

    describe('when error', () => {
      beforeEach(() => {
        CustomObjectRepository = {
          find: jest.fn().mockResolvedValue({
            results: [
              {
                value: 4
              }
            ]
          }),
          update: jest.fn().mockResolvedValue({
            value: 5
          })
        };
        CartRepository = {
          create: jest.fn().mockRejectedValue({
            errors: 'Error1'
          })
        };
        resolvers = makeResolvers({ CartRepository, CustomObjectRepository });
      });

      it('should throw  error', async () => {
        await expect(
          resolvers.Mutation.createQuote(
            {},
            {
              draft: {
                employeeId: '124',
                companyId: 'cg-1',
                currency: 'USD'
              }
            }
          )
        ).rejects.toEqual({ errors: 'Error1' });
      });
    });
  });

  describe('mutation update quote', () => {
    describe('when success', () => {
      beforeEach(async () => {
        CartRepository = {
          update: jest.fn().mockResolvedValue({
            id: 'quote-id',
            version: 2,
            customerId: '124',
            currency: 'USD',
            customerGroup: { obj: { key: 'cg-1', name: 'company name' } },
            store: {
              typeId: 'store',
              key: 'cg-1'
            },
            lineItems: [],
            custom: {
              fields: {
                isQuote: true
              }
            }
          }),
          get: jest.fn().mockResolvedValue({
            id: 'quote-id',
            version: 1,
            customerId: '124',
            currency: 'USD',
            customerGroup: { obj: { key: 'cg-1', name: 'company name' } },
            store: {
              typeId: 'store',
              key: 'cg-1'
            },
            lineItems: [],
            custom: {
              fields: {
                isQuote: true
              }
            }
          })
        };
        TaxCategoryRepository = {
          get: jest.fn().mockResolvedValue({
            id: 'no-tax-category-id'
          })
        };
        resolvers = makeResolvers({ CartRepository, TaxCategoryRepository });
        response = await resolvers.Mutation.updateQuote(
          {},
          {
            id: 'id-1',
            version: 1,
            actions: [
              {
                addLineItem: {
                  sku: 'sku1',
                  quantity: 1
                }
              }
            ]
          }
        );
      });

      it('should call to CartRepository.update', () => {
        expect(CartRepository.update).toHaveBeenCalledWith(
          'id-1',
          1,
          [{ action: 'addLineItem', quantity: 1, sku: 'sku1' }],
          { expand: ['customerGroup'] }
        );
      });

      it('should return the quote', () => {
        expect(response).toEqual({
          company: { id: 'cg-1', name: 'company name' },
          currency: 'USD',
          customerGroup: { key: 'cg-1', typeId: undefined },
          employeeId: '124',
          id: 'quote-id',
          lineItems: [],
          originalTotalPrice: undefined,
          store: { key: 'cg-1', typeId: 'store' },
          version: 2
        });
      });
    });
  });

  describe('mutation addComment', () => {
    describe('when success', () => {
      describe('when dont have comments', () => {
        beforeEach(async () => {
          jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('date');
          CartRepository = {
            get: jest.fn().mockResolvedValue({
              id: 'quoteId',
              lineItems: [],
              customerGroup: { obj: { key: 'cg-1', name: 'company name' } }
            })
          };
          CustomObjectRepository = {
            create: jest.fn().mockResolvedValue({}),
            find: jest.fn().mockResolvedValue({ total: 0 })
          };
          resolvers = makeResolvers({ CartRepository, CustomObjectRepository });
          response = await resolvers.Mutation.addComment(
            {},
            {
              quoteId: 'quoteId',
              text: 'foo',
              email: 'foo@foo.com'
            }
          );
        });
        it('should call CartRepository.get with correct values', () => {
          expect(CartRepository.get).toHaveBeenCalledWith('quoteId', {
            expand: ['customerGroup']
          });
        });
        it('should call CustomObjectRepository.create with correct values', () => {
          expect(CustomObjectRepository.create).toHaveBeenCalledWith({
            container: 'quote-comments',
            key: 'quoteId',
            value: [
              { createdAt: 'date', email: 'foo@foo.com', id: 'id', text: 'foo' }
            ]
          });
        });
      });
      describe('when have comments', () => {
        beforeEach(async () => {
          jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('date');
          CartRepository = {
            get: jest.fn().mockResolvedValue({
              id: 'quoteId',
              lineItems: [],
              customerGroup: { obj: { key: 'cg-1', name: 'company name' } }
            })
          };
          CustomObjectRepository = {
            create: jest.fn().mockResolvedValue({}),
            find: jest.fn().mockResolvedValue({
              total: 1,
              results: [
                {
                  value: [
                    {
                      createdAt: 'date',
                      email: 'bar@bar.com',
                      id: 'id-bar',
                      text: 'bar'
                    }
                  ]
                }
              ]
            })
          };
          resolvers = makeResolvers({ CartRepository, CustomObjectRepository });
          response = await resolvers.Mutation.addComment(
            {},
            {
              quoteId: 'quoteId',
              text: 'foo',
              email: 'foo@foo.com'
            }
          );
        });
        it('should call CustomObjectRepository.create with correct values', () => {
          expect(CustomObjectRepository.create).toHaveBeenCalledWith({
            container: 'quote-comments',
            key: 'quoteId',
            value: [
              {
                createdAt: 'date',
                email: 'bar@bar.com',
                id: 'id-bar',
                text: 'bar'
              },
              { createdAt: 'date', email: 'foo@foo.com', id: 'id', text: 'foo' }
            ]
          });
        });
      });
    });
  });

  describe('resolve comments', () => {
    describe('when have comments', () => {
      beforeEach(async () => {
        CustomObjectRepository = {
          find: jest.fn().mockResolvedValue({
            total: 1,
            results: [{ value: [{ id: 'foo', text: 'test' }] }]
          })
        };
        resolvers = makeResolvers({ CustomObjectRepository });
        response = await resolvers.Quote.comments({ id: 'quoteId' });
      });
      it('should call CustomObjectRepository.find with correct values', () => {
        expect(CustomObjectRepository.find).toHaveBeenCalledWith({
          where: ['key = "quoteId" and container="quote-comments"']
        });
      });
      it('should return the correct response', () => {
        expect(response).toEqual([{ id: 'foo', text: 'test' }]);
      });
    });
    describe('when dont have comments', () => {
      beforeEach(async () => {
        CustomObjectRepository = {
          find: jest.fn().mockResolvedValue({
            total: 0,
            results: []
          })
        };
        resolvers = makeResolvers({ CustomObjectRepository });
        response = await resolvers.Quote.comments({ id: 'quoteId' });
      });
      it('should return the correct response', () => {
        expect(response).toEqual([]);
      });
    });
  });
});
