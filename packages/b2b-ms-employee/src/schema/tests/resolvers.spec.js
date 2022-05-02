const {
  rolesResolver,
  amountRemainingResolver,
  amountExpendedResolver,
  makeResolvers
} = require('../resolvers');

describe('rolesResolver', () => {
  it('should return the roles value', () => {
    expect(
      rolesResolver({
        id: 'employee-1',
        custom: { fields: { roles: ['rol1'] } }
      })
    ).toEqual(['rol1']);
  });
});

describe('amountExpendedResolver', () => {
  it('should return the amount expent value', () => {
    expect(
      amountExpendedResolver({
        id: 'employee-1',
        custom: {
          fields: {
            amountExpent: {
              currencyCode: 'USD',
              centAmount: 100000,
              type: 'centPrecision',
              fractionDigits: 2
            }
          }
        }
      })
    ).toEqual({
      currencyCode: 'USD',
      centAmount: 100000,
      type: 'centPrecision',
      fractionDigits: 2
    });
  });
});

describe('amountRemainingResolver', () => {
  let employee;
  let dataSources;
  let company;
  let response;
  beforeEach(() => {
    employee = {
      id: 'employee-id1',
      customerGroup: { key: 'company-id' },
      custom: { fields: { roles: ['rol1'] } }
    };
  });
  describe('when the company does not exist', () => {
    beforeEach(async () => {
      dataSources = {
        CompanyApi: {
          getCompany: jest.fn().mockResolvedValue(undefined)
        }
      };
      response = await amountRemainingResolver(employee, null, { dataSources });
    });
    it('should return null', () => {
      expect(response).toBeNull();
    });
  });
  describe('when the company exits', () => {
    describe('when the company has not defined budgets', () => {
      beforeEach(async () => {
        company = {
          id: 'company-id1',
          budget: []
        };
        dataSources = {
          CompanyApi: {
            getCompany: jest.fn().mockResolvedValue(company)
          }
        };
        response = await amountRemainingResolver(employee, null, {
          dataSources
        });
      });
      it('should return null', () => {
        expect(response).toBeNull();
      });
    });
    describe('when the company has defined budgets', () => {
      describe('when the company has not defined rol for employee rol', () => {
        beforeEach(async () => {
          company = {
            id: 'company-id1',
            budget: [{ rol: 'rol2', amount: {} }]
          };
          dataSources = {
            CompanyApi: {
              getCompany: jest.fn().mockResolvedValue(company)
            }
          };
          response = await amountRemainingResolver(employee, null, {
            dataSources
          });
        });
        it('should return null', () => {
          expect(response).toBeNull();
        });
      });
      describe('when the company has defined rol for employee rol', () => {
        beforeEach(() => {
          company = {
            id: 'company-id1',
            budget: [
              {
                rol: 'rol1',
                amount: {
                  currencyCode: 'USD',
                  centAmount: 10,
                  type: 'centPrecision',
                  fractionDigits: 2
                }
              },
              {
                rol: 'rol2',
                amount: {
                  currencyCode: 'USD',
                  centAmount: 20,
                  type: 'centPrecision',
                  fractionDigits: 2
                }
              }
            ]
          };
          dataSources = {
            CompanyApi: {
              getCompany: jest.fn().mockResolvedValue(company)
            }
          };
        });
        describe('when multiple roles match', () => {
          beforeEach(async () => {
            employee = {
              id: 'employee-id1',
              customerGroup: { key: 'company-id' },
              custom: {
                fields: {
                  roles: ['rol1', 'rol2'],
                  amountExpent: {
                    currencyCode: 'USD',
                    centAmount: 5,
                    type: 'centPrecision',
                    fractionDigits: 2
                  }
                }
              }
            };

            response = await amountRemainingResolver(employee, null, {
              dataSources
            });
          });
          it('should return the amount remain with the max value of the budget rol ', () => {
            expect(response).toEqual({
              currencyCode: 'USD',
              centAmount: 15,
              type: 'centPrecision',
              fractionDigits: 2
            });
          });
        });
        describe('when a single role match', () => {
          beforeEach(async () => {
            employee = {
              id: 'employee-id1',
              customerGroup: { key: 'company-id' },
              custom: {
                fields: {
                  roles: ['rol1'],
                  amountExpent: {
                    currencyCode: 'USD',
                    centAmount: 5,
                    type: 'centPrecision',
                    fractionDigits: 2
                  }
                }
              }
            };

            response = await amountRemainingResolver(employee, null, {
              dataSources
            });
          });
          it('should return the amount remain with the max value of the budget rol ', () => {
            expect(response).toEqual({
              currencyCode: 'USD',
              centAmount: 5,
              type: 'centPrecision',
              fractionDigits: 2
            });
          });
        });
      });
    });
  });
});

describe('query and mutation resolvers', () => {
  let resolvers;
  let CustomerRepository;
  let response;
  describe('query employee resolver', () => {
    describe('when success', () => {
      beforeEach(async () => {
        CustomerRepository = {
          get: jest.fn().mockResolvedValue({
            id: 'customer-id',
            customerNumber: '124',
            customerGroup: { obj: { id: 'cg-1' } },
            addresses: []
          })
        };
        resolvers = makeResolvers({ CustomerRepository });
        response = await resolvers.Query.employee({}, { id: 'customer-id' });
      });

      it('should call to CustomerRepository.get', () => {
        expect(CustomerRepository.get).toHaveBeenCalled();
      });

      it('should return the employee', () => {
        expect(response).toEqual({
          id: 'customer-id',
          employeeNumber: '124',
          customerGroup: { id: 'cg-1' },
          addresses: [],
          billingAddresses: [],
          shippingAddresses: []
        });
      });
    });

    describe('when error', () => {
      beforeEach(() => {
        CustomerRepository = {
          get: jest.fn().mockRejectedValue({
            errors: 'Error1'
          })
        };
        resolvers = makeResolvers({ CustomerRepository });
      });

      it('should throw  error', async () => {
        await expect(
          resolvers.Query.employee({}, { id: 'customer-id' })
        ).rejects.toEqual({ errors: 'Error1' });
      });
    });
  });

  describe('mutation updateEmployee resolver', () => {
    describe('when success', () => {
      beforeEach(async () => {
        CustomerRepository = {
          update: jest.fn().mockResolvedValue({
            id: 'customer-id',
            customerNumber: '124',
            customerGroup: { obj: { id: 'cg-1' } },
            addresses: []
          })
        };
        resolvers = makeResolvers({ CustomerRepository });
        response = await resolvers.Mutation.updateEmployee(
          {},
          {
            id: 'customer-id',
            version: 1,
            actions: [{ action1: { field1: 'value1' } }]
          }
        );
      });

      it('should call to CustomerRepository.update', () => {
        expect(CustomerRepository.update).toHaveBeenCalled();
      });

      it('should return the employee updated', () => {
        expect(response).toEqual({
          id: 'customer-id',
          employeeNumber: '124',
          customerGroup: { id: 'cg-1' },
          addresses: [],
          billingAddresses: [],
          shippingAddresses: []
        });
      });
    });

    describe('when error', () => {
      beforeEach(() => {
        CustomerRepository = {
          update: jest.fn().mockRejectedValue({
            errors: 'Error1'
          })
        };
        resolvers = makeResolvers({ CustomerRepository });
      });

      it('should throw  error', async () => {
        await expect(
          resolvers.Mutation.updateEmployee(
            {},
            {
              id: 'customer-id',
              version: 1,
              actions: [{ action1: { field1: 'value1' } }]
            }
          )
        ).rejects.toEqual({ errors: 'Error1' });
      });
    });
  });

  describe('mutation employeeSignUp resolver', () => {
    describe('when success', () => {
      beforeEach(async () => {
        CustomerRepository = {
          create: jest.fn().mockResolvedValue({
            customer: {
              id: 'customer-id',
              customerNumber: '124',
              customerGroup: { obj: { id: 'cg-1' } },
              addresses: []
            }
          })
        };
        resolvers = makeResolvers({ CustomerRepository });
        response = await resolvers.Mutation.employeeSignUp(
          {},
          {
            draft: { email: 'foo@bar.com', roles: ['rol1'] }
          }
        );
      });

      it('should call to CustomerRepository.create', () => {
        expect(CustomerRepository.create).toHaveBeenCalled();
      });

      it('should return the employee crated', () => {
        expect(response.employee).toEqual({
          id: 'customer-id',
          employeeNumber: '124',
          customerGroup: { id: 'cg-1' },
          addresses: [],
          billingAddresses: [],
          shippingAddresses: []
        });
      });
    });

    describe('when error', () => {
      beforeEach(() => {
        CustomerRepository = {
          create: jest.fn().mockRejectedValue({
            errors: 'Error1'
          })
        };
        resolvers = makeResolvers({ CustomerRepository });
      });

      it('should throw  error', async () => {
        await expect(
          resolvers.Mutation.employeeSignUp(
            {},
            {
              draft: { email: 'foo@bar.com', roles: ['rol1'] }
            }
          )
        ).rejects.toEqual({ errors: 'Error1' });
      });
    });
  });

  describe('mutation deleteEmployee resolver', () => {
    describe('when success', () => {
      beforeEach(async () => {
        CustomerRepository = {
          delete: jest.fn().mockResolvedValue({
            id: 'customer-id',
            customerNumber: '124',
            customerGroup: { obj: { id: 'cg-1' } },
            addresses: []
          })
        };
        resolvers = makeResolvers({ CustomerRepository });
        response = await resolvers.Mutation.deleteEmployee(
          {},
          {
            id: 'customer-id',
            version: 1
          }
        );
      });

      it('should call to CustomerRepository.create', () => {
        expect(CustomerRepository.delete).toHaveBeenCalled();
      });

      it('should return the employee removed', () => {
        expect(response).toEqual({
          id: 'customer-id',
          employeeNumber: '124',
          customerGroup: { id: 'cg-1' },
          addresses: [],
          billingAddresses: [],
          shippingAddresses: []
        });
      });
    });

    describe('when error', () => {
      beforeEach(() => {
        CustomerRepository = {
          delete: jest.fn().mockRejectedValue({
            errors: 'Error1'
          })
        };
        resolvers = makeResolvers({ CustomerRepository });
      });

      it('should throw  error', async () => {
        await expect(
          resolvers.Mutation.deleteEmployee(
            {},
            {
              id: 'customer-id',
              version: 1
            }
          )
        ).rejects.toEqual({ errors: 'Error1' });
      });
    });
  });

  describe('mutation employeeResetPassword resolver', () => {
    describe('when success', () => {
      beforeEach(async () => {
        CustomerRepository = {
          passwordReset: jest.fn().mockResolvedValue({
            id: 'customer-id',
            customerNumber: '124',
            customerGroup: { obj: { id: 'cg-1' } },
            addresses: []
          }),
          get: jest.fn().mockResolvedValue({
            id: 'customer-id',
            customerNumber: '124',
            customerGroup: { obj: { id: 'cg-1' } },
            addresses: []
          })
        };
        resolvers = makeResolvers({ CustomerRepository });
        response = await resolvers.Mutation.employeeResetPassword(
          {},
          {
            tokenValue: 'token',
            version: 1,
            newPassword: 'new-password'
          }
        );
      });

      it('should call to CustomerRepository.passwordReset', () => {
        expect(CustomerRepository.passwordReset).toHaveBeenCalledWith({
          newPassword: 'new-password',
          tokenValue: 'token',
          version: 1
        });
      });

      it('should call to CustomerRepository.get', () => {
        expect(CustomerRepository.get).toHaveBeenCalledWith('customer-id', {
          expand: ['customerGroup', 'stores[*]']
        });
      });

      it('should return the employee', () => {
        expect(response).toEqual({
          id: 'customer-id',
          employeeNumber: '124',
          customerGroup: { id: 'cg-1' },
          addresses: [],
          billingAddresses: [],
          shippingAddresses: []
        });
      });
    });
  });

  describe('employeeResetAmountExpent', () => {
    describe('when success', () => {
      beforeEach(async () => {
        CustomerRepository = {
          get: jest.fn().mockResolvedValue({
            id: 'customer-id',
            version: 1,
            customerNumber: '124',
            customerGroup: { obj: { id: 'cg-1' } },
            addresses: [],
            custom: { fields: {} }
          }),
          update: jest.fn().mockResolvedValue({
            id: 'customer-id',
            version: 2,
            customerNumber: '124',
            customerGroup: { obj: { id: 'cg-1' } },
            addresses: [],
            custom: {
              fields: { amountExpent: { currencyCode: 'USD', centAmount: 0 } }
            }
          })
        };
        resolvers = makeResolvers({ CustomerRepository });
        response = await resolvers.Mutation.employeeResetAmountExpent(
          {},
          {
            id: 'customer-id'
          }
        );
      });

      it('should call to CustomerRepository.get', () => {
        expect(CustomerRepository.get).toHaveBeenCalledWith('customer-id', {
          expand: ['customerGroup', 'stores[*]']
        });
      });

      it('should call to CustomerRepository.update', () => {
        expect(CustomerRepository.update).toHaveBeenCalledWith(
          'customer-id',
          1,
          [
            {
              action: 'setCustomField',
              name: 'amountExpent',
              value: { centAmount: 0, currencyCode: 'USD' }
            }
          ],
          { expand: ['customerGroup', 'stores[*]'] }
        );
      });

      it('should return the employee', () => {
        expect(response).toEqual({
          addresses: [],
          billingAddresses: [],
          custom: {
            fields: { amountExpent: { centAmount: 0, currencyCode: 'USD' } }
          },
          customerGroup: { id: 'cg-1' },
          employeeNumber: '124',
          id: 'customer-id',
          shippingAddresses: [],
          version: 2
        });
      });
    });
  });

  describe('employeesResetAmountExpent', () => {
    let dataSources;
    describe('when success', () => {
      beforeEach(async () => {
        CustomerRepository = {
          find: jest.fn().mockResolvedValue({
            results: [
              {
                id: 'customer-id',
                version: 1,
                customerNumber: '124',
                customerGroup: { obj: { id: 'cg-1' } },
                addresses: [],
                custom: { fields: {} }
              }
            ]
          }),
          update: jest.fn().mockResolvedValue({
            id: 'customer-id',
            version: 2,
            customerNumber: '124',
            customerGroup: { obj: { id: 'cg-1' } },
            addresses: [],
            custom: {
              fields: { amountExpent: { currencyCode: 'USD', centAmount: 0 } }
            }
          })
        };
        dataSources = {
          CompanyApi: {
            getCompany: jest.fn().mockResolvedValue({
              id: 'companyId-1',
              customerGroup: { id: 'cg-1' }
            })
          }
        };
        resolvers = makeResolvers({ CustomerRepository });
        response = await resolvers.Mutation.employeesResetAmountExpent(
          {},
          {
            companyId: 'companyId-1'
          },
          { dataSources }
        );
      });

      it('should call to dataSources.CompanyApi.getCompany', () => {
        expect(dataSources.CompanyApi.getCompany).toHaveBeenCalledWith(
          'companyId-1'
        );
      });

      it('should call to CustomerRepository.find', () => {
        expect(CustomerRepository.find).toHaveBeenCalledWith({
          perPage: 500,
          where: ['customerGroup(id="cg-1")']
        });
      });

      it('should call to CustomerRepository.update', () => {
        expect(CustomerRepository.update).toHaveBeenCalledWith(
          'customer-id',
          1,
          [
            {
              action: 'setCustomField',
              name: 'amountExpent',
              value: { centAmount: 0, currencyCode: 'USD' }
            }
          ],
          { expand: ['customerGroup', 'stores[*]'] }
        );
      });

      it('should return the employee', () => {
        expect(response).toEqual([
          {
            addresses: [],
            billingAddresses: [],
            custom: {
              fields: { amountExpent: { centAmount: 0, currencyCode: 'USD' } }
            },
            customerGroup: { id: 'cg-1' },
            employeeNumber: '124',
            id: 'customer-id',
            shippingAddresses: [],
            version: 2
          }
        ]);
      });
    });
  });
});
