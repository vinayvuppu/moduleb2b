const {
  convertLineItem,
  generateFindParams,
  convertRestCartToQuote,
  generateCartDraft,
  convertGraphqlActionToRestAction,
  getOriginalTotalPrice,
  getQuoteNumber,
  restrictActionsByState
} = require('../utils');

const { QUOTE_TYPES } = require('../constants');

describe('converters', () => {
  describe('convertLineItem', () => {
    it('should return the converted lineItem', () => {
      expect(
        convertLineItem({
          id: 'lineItemid1',
          name: { en: 'name1', es: 'name2' },
          custom: {
            fields: {
              originalPrice: {
                fractionDigits: 2,
                currency: 'USD',
                centAmount: 100
              }
            }
          }
        })
      ).toEqual({
        id: 'lineItemid1',
        nameAllLocales: [
          {
            locale: 'en',
            value: 'name1'
          },
          {
            locale: 'es',
            value: 'name2'
          }
        ],
        originalPrice: {
          fractionDigits: 2,
          currency: 'USD',
          centAmount: 100
        }
      });
    });
  });

  describe('convertRestCartToQuote', () => {
    let cart;
    let response;
    beforeEach(() => {
      cart = {
        id: 'cart-id-1',
        customerId: 'customer-id-1',
        customerEmail: 'foo@bar.com',
        customerGroup: {
          typeId: 'customerGroup',
          obj: {
            key: 'customer-group-key',
            name: 'company name'
          }
        },
        lineItems: [
          {
            id: 'lineItemid1',
            name: { en: 'name1', es: 'name2' },
            totalPrice: { centAmount: 10 }
          },
          {
            id: 'lineItemid1',
            name: { en: 'name1', es: 'name2' },
            quantity: 2,
            totalPrice: {
              centAmount: 10
            },
            custom: {
              fields: {
                originalPrice: {
                  centAmount: 20
                }
              }
            }
          }
        ],
        totalPrice: {
          fractionDigits: 2,
          currencyCode: 'USD',
          centAmount: 10
        },
        custom: {
          fields: {
            isQuote: true,
            quoteNumber: '123',
            quoteState: 'requested'
          }
        }
      };
      response = convertRestCartToQuote(cart);
    });
    it('should return the converted quote', () => {
      expect(response).toEqual({
        company: { id: 'customer-group-key', name: 'company name' },
        customerGroup: { key: 'customer-group-key', typeId: 'customerGroup' },
        employeeEmail: 'foo@bar.com',
        employeeId: 'customer-id-1',
        id: 'cart-id-1',
        lineItems: [
          {
            id: 'lineItemid1',
            nameAllLocales: [
              { locale: 'en', value: 'name1' },
              { locale: 'es', value: 'name2' }
            ],
            totalPrice: { centAmount: 10 }
          },
          {
            id: 'lineItemid1',
            nameAllLocales: [
              { locale: 'en', value: 'name1' },
              { locale: 'es', value: 'name2' }
            ],
            originalPrice: { centAmount: 20 },
            quantity: 2,
            totalPrice: { centAmount: 10 }
          }
        ],
        originalTotalPrice: {
          centAmount: 50,
          currencyCode: 'USD',
          fractionDigits: 2
        },
        quoteState: 'requested',
        quoteNumber: '123',
        totalPrice: { centAmount: 10, currencyCode: 'USD', fractionDigits: 2 }
      });
    });
  });
});

describe('generateFindParams', () => {
  it('should generate the find params', () => {
    expect(
      generateFindParams({
        limit: 40,
        offset: 20,
        quoteState: ['state1', 'state2'],
        employeeId: 'employee-id-1',
        employeeEmail: 'employee@company.com',
        quoteNumber: '123',
        searchTerm: 'term-to-search',
        comanyId: 'company-id-1',
        expand: ['expand-field']
      })
    ).toEqual({
      expand: ['expand-field'],
      page: 1,
      perPage: 40,
      sortBy: 'createdAt',
      sortDirection: 'desc',
      where: [
        'custom(fields(isQuote=true))',
        'custom(fields(quoteState in ("state1","state2")))',
        'custom(fields(quoteNumber="123"))',
        'customerId="employee-id-1"',
        'customerEmail="employee@company.com"',
        'customerEmail="term-to-search" or custom(fields(quoteNumber="term-to-search"))'
      ]
    });
  });
});

describe('generateCartDraft', () => {
  it('should return a cart draft', () => {
    expect(
      generateCartDraft({
        quoteNumber: '12345',
        quoteDraft: {
          employeeId: 'employee-id-1',
          employeeEmail: 'employee@company.com',
          companyId: 'company-id-1',
          currency: 'USD',
          lineItems: [
            {
              sku: 'sku1',
              quantity: 20
            }
          ]
        }
      })
    ).toEqual({
      currency: 'USD',
      custom: {
        fields: { isQuote: true, quoteState: 'initial', quoteNumber: '12345' },
        type: { key: 'quote-type', typeId: 'type' }
      },
      customerId: 'employee-id-1',
      customerEmail: 'employee@company.com',
      lineItems: [{ quantity: 20, sku: 'sku1' }],
      store: { key: 'company-id-1', typeId: 'store' }
    });
  });
});

describe('convertGraphqlActionToRestAction', () => {
  let graphqlAction;
  let restAction;
  let response;

  describe('changeState', () => {
    beforeEach(() => {
      graphqlAction = {
        changeState: {
          state: 'state1'
        }
      };
      restAction = [
        {
          action: 'setCustomField',
          name: 'quoteState',
          value: 'state1'
        }
      ];
      response = convertGraphqlActionToRestAction(graphqlAction);
    });
    it('should return the rest action', () => {
      expect(response).toEqual(restAction);
    });
  });
  describe('removeLineItem', () => {
    beforeEach(() => {
      graphqlAction = {
        removeLineItem: {
          lineItemId: 'item-id-1',
          quantity: 1
        }
      };
      restAction = [
        {
          action: 'removeLineItem',
          lineItemId: 'item-id-1',
          quantity: 1
        }
      ];
      response = convertGraphqlActionToRestAction(graphqlAction);
    });
    it('should return the rest action', () => {
      expect(response).toEqual(restAction);
    });
  });

  describe('addLineItem', () => {
    beforeEach(() => {
      graphqlAction = {
        addLineItem: {
          sku: 'sku1',
          quantity: 1
        }
      };
      restAction = [
        {
          action: 'addLineItem',
          sku: 'sku1',
          quantity: 1
        }
      ];
      response = convertGraphqlActionToRestAction(graphqlAction);
    });
    it('should return the rest action', () => {
      expect(response).toEqual(restAction);
    });
  });

  describe('changeLineItemQuantity', () => {
    describe('with all the optional fields', () => {
      beforeEach(() => {
        graphqlAction = {
          changeLineItemQuantity: {
            lineItemId: 'item-id-1',
            quantity: 1,
            externalPrice: {
              centPrecision: {
                currencyCode: 'USD',
                centAmount: 10
              }
            },
            externalTotalPrice: {
              currencyCode: 'USD',
              centAmount: 10
            }
          }
        };
        restAction = [
          {
            action: 'changeLineItemQuantity',
            lineItemId: 'item-id-1',
            quantity: 1,
            externalPrice: {
              currencyCode: 'USD',
              centAmount: 10
            },
            externalTotalPrice: {
              currencyCode: 'USD',
              centAmount: 10
            }
          }
        ];
        response = convertGraphqlActionToRestAction(graphqlAction);
      });
      it('should return the rest action', () => {
        expect(response).toEqual(restAction);
      });
    });
    describe('with mandatory fields', () => {
      beforeEach(() => {
        graphqlAction = {
          changeLineItemQuantity: {
            lineItemId: 'item-id-1',
            quantity: 1
          }
        };
        restAction = [
          {
            action: 'changeLineItemQuantity',
            lineItemId: 'item-id-1',
            quantity: 1
          }
        ];
        response = convertGraphqlActionToRestAction(graphqlAction);
      });
      it('should return the rest action', () => {
        expect(response).toEqual(restAction);
      });
    });
  });

  describe('setLineItemPrice', () => {
    let oldCart;

    beforeAll(() => {
      graphqlAction = {
        setLineItemPrice: {
          lineItemId: 'item-id-1',
          externalPrice: {
            centPrecision: {
              currencyCode: 'USD',
              centAmount: 10
            }
          }
        }
      };
    });

    describe('when is the first time that change the item price', () => {
      beforeEach(() => {
        oldCart = {
          lineItems: [
            {
              id: 'item-id-1',
              price: {
                value: {
                  currencyCode: 'USD',
                  centAmount: 10000
                }
              }
            }
          ],
          totalPrice: {
            currencyCode: 'USD',
            centAmount: 10000
          },
          custom: {
            fields: {}
          }
        };
        restAction = [
          {
            action: 'setLineItemPrice',
            lineItemId: 'item-id-1',
            externalPrice: {
              currencyCode: 'USD',
              centAmount: 10
            }
          },
          {
            action: 'setLineItemCustomType',
            type: {
              typeId: 'type',
              key: 'line-item-quote-type'
            },
            lineItemId: 'item-id-1',
            fields: {
              originalPrice: {
                currencyCode: 'USD',
                centAmount: 10000
              },
              percentageDiscountApplied: false
            }
          },
          {
            action: 'setCustomField',
            name: 'percentageDiscountApplied',
            value: undefined
          }
        ];
        response = convertGraphqlActionToRestAction(graphqlAction, oldCart);
      });
      it('should return the rest action for line item "setLineItemPrice" ', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[0]]));
      });

      it('should return the rest action for line item "setLineItemCustomType" ', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[1]]));
      });

      it('should not return the rest action for remove other percentage discount applied', () => {
        expect(response).not.toEqual(expect.arrayContaining([restAction[2]]));
      });
    });

    describe('when is not the first time that change the item price', () => {
      beforeEach(() => {
        oldCart = {
          lineItems: [
            {
              id: 'item-id-1',
              price: {
                value: {
                  currencyCode: 'USD',
                  centAmount: 10
                }
              },
              custom: {
                fields: {
                  originalPrice: {
                    currencyCode: 'USD',
                    centAmount: 10000
                  }
                }
              }
            }
          ],
          totalPrice: {
            currencyCode: 'USD',
            centAmount: 10
          },
          custom: {
            fields: {
              originalTotalPrice: {
                currencyCode: 'USD',
                centAmount: 10000
              }
            }
          }
        };
        restAction = [
          {
            action: 'setLineItemPrice',
            lineItemId: 'item-id-1',
            externalPrice: {
              currencyCode: 'USD',
              centAmount: 10
            }
          },
          {
            action: 'setLineItemCustomType',
            type: {
              typeId: 'type',
              key: 'line-item-quote-type'
            },
            lineItemId: 'item-id-1',
            fields: {
              originalPrice: {
                currencyCode: 'USD',
                centAmount: 10
              },
              percentageDiscountApplied: false
            }
          },
          {
            action: 'setLineItemCustomField',
            lineItemId: 'item-id-1',
            name: 'originalPrice',
            value: { currencyCode: 'USD', centAmount: 10000 }
          },
          {
            action: 'setLineItemCustomField',
            lineItemId: 'item-id-1',
            name: 'percentageDiscountApplied',
            value: false
          }
        ];
        response = convertGraphqlActionToRestAction(graphqlAction, oldCart);
      });
      it('should return the rest action for line item "setLineItemPrice" ', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[0]]));
      });

      it('should not return the rest action for line item "setLineItemCustomType" ', () => {
        expect(response).not.toEqual(expect.arrayContaining([restAction[1]]));
      });

      it('should return the rest action for line item "setLineItemCustomField" originalPrice', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[2]]));
      });

      it('should return the rest action for line item "setLineItemCustomField" percentageDiscountApplied', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[3]]));
      });
    });

    describe('when the quote has an amount discount applied', () => {
      beforeEach(() => {
        oldCart = {
          lineItems: [
            {
              id: 'item-id-1',
              price: {
                value: {
                  currencyCode: 'USD',
                  centAmount: 10
                }
              },
              custom: {
                fields: {
                  originalPrice: {
                    currencyCode: 'USD',
                    centAmount: 10000
                  }
                }
              }
            }
          ],
          customLineItems: [
            {
              id: 'custom-line-item-id'
            }
          ],
          totalPrice: {
            currencyCode: 'USD',
            centAmount: 10
          },
          custom: {
            fields: {
              originalTotalPrice: {
                currencyCode: 'USD',
                centAmount: 10000
              }
            }
          }
        };
        restAction = [
          {
            action: 'removeCustomLineItem',
            customLineItemId: 'custom-line-item-id'
          },
          {
            action: 'setLineItemPrice',
            lineItemId: 'item-id-1',
            externalPrice: {
              currencyCode: 'USD',
              centAmount: 10
            }
          },
          {
            action: 'setLineItemCustomType',
            type: {
              typeId: 'type',
              key: 'line-item-quote-type'
            },
            lineItemId: 'item-id-1',
            fields: {
              originalPrice: {
                currencyCode: 'USD',
                centAmount: 10
              },
              percentageDiscountApplied: false
            }
          },
          {
            action: 'setLineItemCustomField',
            lineItemId: 'item-id-1',
            name: 'originalPrice',
            value: { currencyCode: 'USD', centAmount: 10000 }
          },
          {
            action: 'setLineItemCustomField',
            lineItemId: 'item-id-1',
            name: 'percentageDiscountApplied',
            value: false
          }
        ];
        response = convertGraphqlActionToRestAction(graphqlAction, oldCart);
      });
      it('should return the rest action for custom line item "removeCustomLineItem" ', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[0]]));
      });

      it('should return the rest action for line item "setLineItemPrice" ', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[1]]));
      });

      it('should not return the rest action for line item "setLineItemCustomType" ', () => {
        expect(response).not.toEqual(expect.arrayContaining([restAction[2]]));
      });

      it('should return the rest action for line item "setLineItemCustomField" originalPrice', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[3]]));
      });

      it('should return the rest action for line item "setLineItemCustomField" percentageDiscountApplied', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[4]]));
      });
    });

    describe('when the quote has an percentage discount applied', () => {
      beforeEach(() => {
        oldCart = {
          lineItems: [
            {
              id: 'item-id-1',
              price: {
                value: {
                  currencyCode: 'USD',
                  centAmount: 10
                }
              },
              custom: {
                fields: {
                  originalPrice: {
                    currencyCode: 'USD',
                    centAmount: 10000
                  }
                }
              }
            },
            {
              id: 'item-id-2',
              price: {
                value: {
                  currencyCode: 'USD',
                  centAmount: 10
                }
              },
              custom: {
                fields: {
                  percentageDiscountApplied: true,
                  originalPrice: {
                    currencyCode: 'USD',
                    centAmount: 10000
                  }
                }
              }
            }
          ],
          totalPrice: {
            currencyCode: 'USD',
            centAmount: 10
          },
          custom: {
            fields: {
              originalTotalPrice: {
                currencyCode: 'USD',
                centAmount: 10000
              }
            }
          }
        };

        restAction = [
          {
            action: 'setLineItemCustomField',
            lineItemId: 'item-id-2',
            name: 'originalPrice',
            value: { currencyCode: 'USD', centAmount: 10000 }
          },
          {
            action: 'setLineItemCustomField',
            lineItemId: 'item-id-2',
            name: 'percentageDiscountApplied',
            value: false
          },
          {
            action: 'setLineItemPrice',
            lineItemId: 'item-id-1',
            externalPrice: {
              currencyCode: 'USD',
              centAmount: 10
            }
          },
          {
            action: 'setLineItemCustomField',
            lineItemId: 'item-id-1',
            name: 'originalPrice',
            value: { currencyCode: 'USD', centAmount: 10000 }
          },
          {
            action: 'setLineItemCustomField',
            lineItemId: 'item-id-1',
            name: 'percentageDiscountApplied',
            value: false
          }
        ];
        response = convertGraphqlActionToRestAction(graphqlAction, oldCart);
      });

      it('should return the rest action for remove percentageDiscountApplied for the others line items ', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[0]]));
      });

      it('should return the rest action for restore price for the other line items ', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[1]]));
      });

      it('should return the rest action for line item "setLineItemPrice" ', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[2]]));
      });

      it('should return the rest action for line item "setLineItemCustomField" originalPrice', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[3]]));
      });

      it('should return the rest action for line item "setLineItemCustomField" percentageDiscountApplied', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[4]]));
      });
    });
  });

  describe('setLineItemTotalPrice', () => {
    let oldCart;

    beforeAll(() => {
      graphqlAction = {
        setLineItemTotalPrice: {
          lineItemId: 'item-id-1',
          externalTotalPrice: {
            price: {
              centPrecision: {
                currencyCode: 'USD',
                centAmount: 10
              }
            },
            totalPrice: {
              currencyCode: 'USD',
              centAmount: 20
            }
          }
        }
      };
    });

    describe('when is the first time that change the item total price', () => {
      beforeEach(() => {
        oldCart = {
          lineItems: [
            {
              id: 'item-id-1',
              price: {
                value: {
                  currencyCode: 'USD',
                  centAmount: 10000
                }
              }
            }
          ],
          totalPrice: {
            currencyCode: 'USD',
            centAmount: 10000
          },
          custom: {
            fields: {}
          }
        };
        restAction = [
          {
            action: 'setLineItemTotalPrice',
            lineItemId: 'item-id-1',
            externalTotalPrice: {
              price: {
                currencyCode: 'USD',
                centAmount: 10
              },
              totalPrice: {
                currencyCode: 'USD',
                centAmount: 20
              }
            }
          },
          {
            action: 'setLineItemCustomType',
            type: {
              typeId: 'type',
              key: 'line-item-quote-type'
            },
            lineItemId: 'item-id-1',
            fields: {
              originalPrice: {
                currencyCode: 'USD',
                centAmount: 10000
              },
              percentageDiscountApplied: false
            }
          },
          {
            action: 'setCustomField',
            name: 'percentageDiscountApplied',
            value: undefined
          }
        ];
        response = convertGraphqlActionToRestAction(graphqlAction, oldCart);
      });

      it('should return the rest action for line item "setLineItemTotalPrice" ', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[0]]));
      });

      it('should return the rest action for line item "setLineItemCustomType" ', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[1]]));
      });

      it('should not return the rest action remove old percentage discount applied', () => {
        expect(response).not.toEqual(expect.arrayContaining([restAction[2]]));
      });
    });

    describe('when is not the first time that change the item price', () => {
      beforeEach(() => {
        oldCart = {
          lineItems: [
            {
              id: 'item-id-1',
              price: {
                value: {
                  currencyCode: 'USD',
                  centAmount: 10000
                }
              },
              custom: {
                fields: {
                  originalPrice: {
                    currencyCode: 'USD',
                    centAmount: 10000
                  }
                }
              }
            }
          ],
          totalPrice: {
            currencyCode: 'USD',
            centAmount: 10000
          },
          custom: {
            fields: {
              originalTotalPrice: {
                currencyCode: 'USD',
                centAmount: 10000
              }
            }
          }
        };
        restAction = [
          {
            action: 'setLineItemTotalPrice',
            lineItemId: 'item-id-1',
            externalTotalPrice: {
              price: {
                currencyCode: 'USD',
                centAmount: 10
              },
              totalPrice: {
                currencyCode: 'USD',
                centAmount: 20
              }
            }
          },
          {
            action: 'setLineItemCustomType',
            type: {
              typeId: 'type',
              key: 'line-item-quote-type'
            },
            lineItemId: 'item-id-1',
            fields: {
              originalPrice: {
                currencyCode: 'USD',
                centAmount: 10000
              }
            }
          }
        ];
        response = convertGraphqlActionToRestAction(graphqlAction, oldCart);
      });

      it('should return the rest action for line item "setLineItemTotalPrice" ', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[0]]));
      });
      it('should not return the rest action for line item "setLineItemCustomType" ', () => {
        expect(response).not.toEqual(expect.arrayContaining([restAction[1]]));
      });
    });

    describe('when the quote has an amount discount applied', () => {
      beforeEach(() => {
        oldCart = {
          lineItems: [
            {
              id: 'item-id-1',
              price: {
                value: {
                  currencyCode: 'USD',
                  centAmount: 10000
                }
              },
              custom: {
                fields: {
                  originalPrice: {
                    currencyCode: 'USD',
                    centAmount: 10000
                  }
                }
              }
            }
          ],
          customLineItems: [
            {
              id: 'custom-line-item-id'
            }
          ],
          totalPrice: {
            currencyCode: 'USD',
            centAmount: 10000
          },
          custom: {
            fields: {
              originalTotalPrice: {
                currencyCode: 'USD',
                centAmount: 10000
              }
            }
          }
        };
        restAction = [
          {
            action: 'removeCustomLineItem',
            customLineItemId: 'custom-line-item-id'
          },
          {
            action: 'setLineItemTotalPrice',
            lineItemId: 'item-id-1',
            externalTotalPrice: {
              price: {
                currencyCode: 'USD',
                centAmount: 10
              },
              totalPrice: {
                currencyCode: 'USD',
                centAmount: 20
              }
            }
          },
          {
            action: 'setLineItemCustomType',
            type: {
              typeId: 'type',
              key: 'line-item-quote-type'
            },
            lineItemId: 'item-id-1',
            fields: {
              originalPrice: {
                currencyCode: 'USD',
                centAmount: 10000
              }
            }
          }
        ];
        response = convertGraphqlActionToRestAction(graphqlAction, oldCart);
      });
      it('should return the rest action for custom line item "removeCustomLineItem" ', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[0]]));
      });

      it('should return the rest action for line item "setLineItemTotalPrice" ', () => {
        expect(response).toEqual(expect.arrayContaining([restAction[1]]));
      });
      it('should not return the rest action for line item "setLineItemCustomType" ', () => {
        expect(response).not.toEqual(expect.arrayContaining([restAction[2]]));
      });
    });
  });

  describe('setAmountDiscount', () => {
    let oldCart;
    let taxCategory;

    beforeAll(() => {
      taxCategory = {
        id: 'no-tax-category-id'
      };
    });

    describe('when there is not other discounts applied', () => {
      beforeEach(() => {
        oldCart = {
          customLineItems: [],
          lineItems: [
            {
              id: 'item-id-1',
              price: {
                value: {
                  currencyCode: 'USD',
                  centAmount: 10
                }
              }
            }
          ],
          totalPrice: {
            centAmount: 2000,
            currencyCode: 'USD'
          }
        };
        graphqlAction = {
          setAmountDiscount: {
            amountDiscount: {
              centAmount: 200,
              currencyCode: 'USD'
            },
            taxCategoryId: 'no-tax-category-id'
          }
        };
        restAction = [
          {
            action: 'addCustomLineItem',
            name: {
              en: 'quote-amount-discount'
            },
            taxCategory: {
              typeId: 'tax-category',
              id: 'no-tax-category-id'
            },
            quantity: 1,
            slug: 'quote-amount-discount',
            money: {
              centAmount: -200,
              currencyCode: 'USD'
            }
          }
        ];
        response = convertGraphqlActionToRestAction(
          graphqlAction,
          oldCart,
          taxCategory
        );
      });
      it('should return the rest action', () => {
        expect(response).toEqual(restAction);
      });
    });

    describe('when there is another amount discounts applied', () => {
      beforeEach(() => {
        oldCart = {
          totalPrice: {
            centAmount: 2000,
            currencyCode: 'USD'
          },
          customLineItems: [
            {
              id: 'custom-line-item-id'
            }
          ],
          lineItems: [
            {
              id: 'item-id-1',
              price: {
                value: {
                  currencyCode: 'USD',
                  centAmount: 200
                }
              },
              totalPrice: {
                centAmount: 200,
                currencyCode: 'USD'
              }
            }
          ]
        };
        graphqlAction = {
          setAmountDiscount: {
            amountDiscount: {
              centAmount: 200,
              currencyCode: 'USD'
            },
            taxCategoryId: 'no-tax-category-id'
          }
        };
        restAction = [
          {
            action: 'removeCustomLineItem',
            customLineItemId: 'custom-line-item-id'
          },
          {
            action: 'addCustomLineItem',
            name: {
              en: 'quote-amount-discount'
            },
            taxCategory: {
              typeId: 'tax-category',
              id: 'no-tax-category-id'
            },
            quantity: 1,
            slug: 'quote-amount-discount',
            money: {
              centAmount: -200,
              currencyCode: 'USD'
            }
          }
        ];
        response = convertGraphqlActionToRestAction(
          graphqlAction,
          oldCart,
          taxCategory
        );
      });
      it('should return the rest action', () => {
        expect(response).toEqual(restAction);
      });
    });

    describe('when there is items price discount applied', () => {
      beforeEach(() => {
        oldCart = {
          totalPrice: {
            currencyCode: 'USD',
            centAmount: 10000
          },
          customLineItems: [],
          lineItems: [
            {
              id: 'item-id-1',
              price: {
                value: {
                  currencyCode: 'USD',
                  centAmount: 10
                }
              },
              custom: {
                fields: {
                  originalPrice: {
                    currencyCode: 'USD',
                    centAmount: 100
                  }
                }
              }
            }
          ]
        };
        graphqlAction = {
          setAmountDiscount: {
            amountDiscount: {
              centAmount: 200,
              currencyCode: 'USD'
            },
            taxCategoryId: 'no-tax-category-id'
          }
        };
        restAction = [
          {
            action: 'addCustomLineItem',
            name: {
              en: 'quote-amount-discount'
            },
            taxCategory: {
              typeId: 'tax-category',
              id: 'no-tax-category-id'
            },
            quantity: 1,
            slug: 'quote-amount-discount',
            money: {
              centAmount: -200,
              currencyCode: 'USD'
            }
          },
          {
            action: 'setLineItemPrice',
            lineItemId: 'item-id-1',
            externalPrice: {
              currencyCode: 'USD',
              centAmount: 100
            }
          },
          {
            action: 'setLineItemCustomField',
            lineItemId: 'item-id-1',
            name: 'originalPrice',
            value: undefined
          }
        ];
        response = convertGraphqlActionToRestAction(
          graphqlAction,
          oldCart,
          taxCategory
        );
      });
      it('should return the rest action', () => {
        expect(response).toEqual(restAction);
      });
    });

    describe('setAmountDiscount', () => {
      test('amount discount is 0', () => {
        const actual = convertGraphqlActionToRestAction(
          { setAmountDiscount: { amountDiscount: { centAmount: 0 } } },
          {
            totalPrice: {
              currencyCode: 'USD',
              centAmount: 10000
            },
            lineItems: []
          },
          { id: 'foo' }
        );
        expect(actual).toEqual([
          {
            action: 'addCustomLineItem',
            money: { centAmount: -0 },
            name: { en: 'quote-amount-discount' },
            quantity: 1,
            slug: 'quote-amount-discount',
            taxCategory: { id: 'foo', typeId: 'tax-category' }
          }
        ]);
      });

      test('amount discount is negative', () => {
        let actualError;
        try {
          convertGraphqlActionToRestAction(
            { setAmountDiscount: { amountDiscount: { centAmount: -100 } } },
            {
              totalPrice: {
                currencyCode: 'USD',
                centAmount: 10000
              },
              lineItems: []
            },
            { id: 'foo' }
          );
        } catch (error) {
          actualError = error;
        }
        expect(actualError).toEqual(
          new Error('The discount must be 0 or bigger')
        );
      });
    });

    describe('setPercentageDiscount', () => {
      test('percentage is 0', () => {
        const actual = convertGraphqlActionToRestAction(
          { setPercentageDiscount: { percentage: 0 } },
          {
            totalPrice: {
              currencyCode: 'USD',
              centAmount: 10000
            },
            lineItems: []
          },
          { id: 'foo' }
        );

        expect(actual).toEqual([
          {
            action: 'setCustomField',
            name: 'percentageDiscountApplied',
            value: 0
          }
        ]);
      });
      test('percentage is negative', () => {
        let actualError;
        try {
          convertGraphqlActionToRestAction(
            { setPercentageDiscount: { percentage: -0.76 } },
            {
              totalPrice: {
                currencyCode: 'USD',
                centAmount: 10000
              },
              lineItems: []
            },
            { id: 'foo' }
          );
        } catch (error) {
          actualError = error;
        }
        expect(actualError).toEqual(
          new Error('The percentage must be between 0 and 1')
        );
      });
      test('percentage is more than 1', () => {
        let actualError;
        try {
          convertGraphqlActionToRestAction(
            { setPercentageDiscount: { percentage: 2.32 } },
            {
              totalPrice: {
                currencyCode: 'USD',
                centAmount: 10000
              },
              lineItems: []
            },
            { id: 'foo' }
          );
        } catch (error) {
          actualError = error;
        }
        expect(actualError).toEqual(
          new Error('The percentage must be between 0 and 1')
        );
      });
    });
  });

  describe('setPercentageDiscount', () => {
    let oldCart;
    let taxCategory;

    beforeAll(() => {
      taxCategory = {
        id: 'no-tax-category-id'
      };
    });

    describe('when there is not other discounts applied', () => {
      beforeEach(() => {
        oldCart = {
          customLineItems: [],
          lineItems: [
            {
              id: 'item-id-1',
              price: {
                value: {
                  currencyCode: 'USD',
                  centAmount: 10000
                }
              }
            }
          ],
          totalPrice: {
            centAmount: 2000,
            currencyCode: 'USD'
          }
        };
        graphqlAction = {
          setPercentageDiscount: {
            percentage: 0.5,
            taxCategoryId: 'no-tax-category-id'
          }
        };
        restAction = [
          {
            action: 'setLineItemPrice',
            lineItemId: 'item-id-1',
            externalPrice: {
              currencyCode: 'USD',
              centAmount: 5000
            }
          },
          {
            action: 'setLineItemCustomType',
            type: {
              typeId: 'type',
              key: 'line-item-quote-type'
            },
            lineItemId: 'item-id-1',
            fields: {
              originalPrice: { currencyCode: 'USD', centAmount: 10000 },
              percentageDiscountApplied: true
            }
          },
          {
            action: 'setCustomField',
            name: 'percentageDiscountApplied',
            value: 0.5
          }
        ];
        response = convertGraphqlActionToRestAction(
          graphqlAction,
          oldCart,
          taxCategory
        );
      });
      it('should return the rest action', () => {
        expect(response).toEqual(restAction);
      });
    });

    describe('when there is another amount discounts applied', () => {
      beforeEach(() => {
        oldCart = {
          totalPrice: {
            centAmount: 200,
            currencyCode: 'USD'
          },
          customLineItems: [
            {
              id: 'custom-line-item-id'
            }
          ],
          lineItems: [
            {
              id: 'item-id-1',
              price: {
                value: {
                  currencyCode: 'USD',
                  centAmount: 200
                }
              },
              totalPrice: {
                centAmount: 200,
                currencyCode: 'USD'
              }
            }
          ]
        };
        graphqlAction = {
          setPercentageDiscount: {
            percentage: 0.5,
            taxCategoryId: 'no-tax-category-id'
          }
        };
        restAction = [
          {
            action: 'removeCustomLineItem',
            customLineItemId: 'custom-line-item-id'
          },
          {
            action: 'setLineItemPrice',
            lineItemId: 'item-id-1',
            externalPrice: {
              currencyCode: 'USD',
              centAmount: 100
            }
          },
          {
            action: 'setLineItemCustomType',
            type: {
              typeId: 'type',
              key: 'line-item-quote-type'
            },
            lineItemId: 'item-id-1',
            fields: {
              originalPrice: { currencyCode: 'USD', centAmount: 200 },
              percentageDiscountApplied: true
            }
          },
          {
            action: 'setCustomField',
            name: 'percentageDiscountApplied',
            value: 0.5
          }
        ];
        response = convertGraphqlActionToRestAction(
          graphqlAction,
          oldCart,
          taxCategory
        );
      });
      it('should return the rest action', () => {
        expect(response).toEqual(restAction);
      });
    });

    describe('when there is items price discount applied', () => {
      beforeEach(() => {
        oldCart = {
          totalPrice: {
            currencyCode: 'USD',
            centAmount: 10000
          },
          customLineItems: [],
          lineItems: [
            {
              id: 'item-id-1',
              quantity: 1,
              price: {
                value: {
                  currencyCode: 'USD',
                  centAmount: 10
                }
              },
              custom: {
                fields: {
                  originalPrice: {
                    currencyCode: 'USD',
                    centAmount: 100
                  }
                }
              }
            }
          ]
        };
        graphqlAction = {
          setPercentageDiscount: {
            percentage: 0.5,
            taxCategoryId: 'no-tax-category-id'
          }
        };
        restAction = [
          {
            action: 'setLineItemPrice',
            lineItemId: 'item-id-1',
            externalPrice: {
              currencyCode: 'USD',
              centAmount: 50
            }
          },
          {
            action: 'setLineItemCustomField',
            lineItemId: 'item-id-1',
            name: 'originalPrice',
            value: {
              currencyCode: 'USD',
              centAmount: 100
            }
          },
          {
            action: 'setLineItemCustomField',
            lineItemId: 'item-id-1',
            name: 'percentageDiscountApplied',
            value: true
          },
          {
            action: 'setCustomField',
            name: 'percentageDiscountApplied',
            value: 0.5
          }
        ];
        response = convertGraphqlActionToRestAction(
          graphqlAction,
          oldCart,
          taxCategory
        );
      });
      it('should return the rest action', () => {
        expect(response).toEqual(restAction);
      });
    });
  });
});

describe('getOriginalTotalPrice', () => {
  describe('when the quote has not been updated', () => {
    expect(
      getOriginalTotalPrice({
        totalPrice: {
          fractionDigits: 2,
          centAmount: 10,
          currencyCode: 'USD'
        },
        lineItems: [{ totalPrice: { centAmount: 10 }, quantity: 1 }]
      })
    ).toEqual(undefined);
  });

  describe('when the quote has been updated', () => {
    describe('when not discount custom line items ', () => {
      expect(
        getOriginalTotalPrice({
          totalPrice: {
            fractionDigits: 2,
            centAmount: 100,
            currencyCode: 'USD'
          },
          lineItems: [
            {
              totalPrice: { centAmount: 10 },
              quantity: 1,
              custom: { fields: { originalPrice: { centAmount: 100 } } }
            }
          ]
        })
      ).toEqual({ centAmount: 100, currencyCode: 'USD', fractionDigits: 2 });
    });

    describe('when discount custom line items ', () => {
      expect(
        getOriginalTotalPrice({
          totalPrice: {
            fractionDigits: 2,
            centAmount: 100,
            currencyCode: 'USD'
          },
          lineItems: [
            {
              totalPrice: { centAmount: 200 },
              quantity: 1
            }
          ],
          customLineItems: [
            {
              totalPrice: { centAmount: -100 }
            }
          ]
        })
      ).toEqual({ centAmount: 200, currencyCode: 'USD', fractionDigits: 2 });
    });
  });
});

describe('getQuoteNumber', () => {
  let customObjectRepository;
  let response;
  describe('when the custom object does not exist', () => {
    beforeEach(async () => {
      customObjectRepository = {
        find: jest.fn().mockResolvedValue({
          results: []
        }),
        update: jest.fn().mockResolvedValue({
          value: 1
        })
      };

      response = await getQuoteNumber(customObjectRepository);
    });

    it('should return the initial value', () => {
      expect(response).toEqual('0000000001');
    });

    it('should call to find method 1 time', () => {
      expect(customObjectRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should call to update method with params', () => {
      expect(customObjectRepository.update).toHaveBeenCalledWith({
        container: 'quote-order-number',
        key: 'quote-order-number',
        value: 1
      });
    });
  });

  describe('when the custom object exists', () => {
    beforeEach(async () => {
      customObjectRepository = {
        find: jest.fn().mockResolvedValue({
          results: [
            {
              value: 1
            }
          ]
        }),
        update: jest.fn().mockResolvedValue({
          value: 2
        })
      };

      response = await getQuoteNumber(customObjectRepository);
    });

    it('should return the initial value', () => {
      expect(response).toEqual('0000000002');
    });

    it('should call to find method 1 time', () => {
      expect(customObjectRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should call to update method with params', () => {
      expect(customObjectRepository.update).toHaveBeenCalledWith({
        container: 'quote-order-number',
        key: 'quote-order-number',
        value: 2
      });
    });
  });

  describe('when concurrent exception', () => {
    beforeEach(async () => {
      customObjectRepository = {
        find: jest
          .fn()
          .mockResolvedValueOnce({
            results: [
              {
                value: 1
              }
            ]
          })
          .mockResolvedValueOnce({
            results: [
              {
                value: 2
              }
            ]
          }),
        update: jest
          .fn()
          .mockRejectedValueOnce()
          .mockResolvedValue({
            value: 3
          })
      };

      response = await getQuoteNumber(customObjectRepository);
    });

    it('should return the initial value', () => {
      expect(response).toEqual('0000000003');
    });

    it('should call to find method 2 time', () => {
      expect(customObjectRepository.find).toHaveBeenCalledTimes(2);
    });

    it('should call to update method with params', () => {
      expect(customObjectRepository.update).toHaveBeenCalledWith({
        container: 'quote-order-number',
        key: 'quote-order-number',
        value: 3
      });
    });
  });
});

describe('restrictActionsByState', () => {
  describe('when `Initial` state', () => {
    const allowedActions = [
      'removeLineItem',
      'addLineItem',
      'changeState',
      'changeLineItemQuantity',
      'setLineItemPrice',
      'setLineItemTotalPrice',
      'setAmountDiscount',
      'setPercentageDiscount'
    ];
    allowedActions.forEach(allowedAction => {
      it(`should allow ${allowedAction} action`, () => {
        expect(
          restrictActionsByState({
            state: QUOTE_TYPES.INITIAL,
            updateAction: { [allowedActions]: {} }
          })
        ).toEqual(undefined);
      });
    });
  });

  describe('when `Placed` state', () => {
    const notAllowedActions = [
      'removeLineItem',
      'addLineItem',
      'changeState',
      'changeLineItemQuantity',
      'setLineItemPrice',
      'setLineItemTotalPrice',
      'setAmountDiscount',
      'setPercentageDiscount'
    ];
    notAllowedActions.forEach(notAllowedAction => {
      it(`should not allow ${notAllowedAction} action`, () => {
        expect(() => {
          restrictActionsByState({
            state: QUOTE_TYPES.PLACED,
            updateAction: { [notAllowedAction]: {} }
          });
        }).toThrow();
      });
    });
  });

  describe('when `Declined` state', () => {
    const notAllowedActions = [
      'removeLineItem',
      'addLineItem',
      'changeState',
      'changeLineItemQuantity',
      'setLineItemPrice',
      'setLineItemTotalPrice',
      'setAmountDiscount',
      'setPercentageDiscount'
    ];
    notAllowedActions.forEach(notAllowedAction => {
      it(`should not allow ${notAllowedAction} action`, () => {
        expect(() => {
          restrictActionsByState({
            state: QUOTE_TYPES.DECLINED,
            updateAction: { [notAllowedAction]: {} }
          });
        }).toThrow();
      });
    });
  });

  describe('when `Expired` state', () => {
    const notAllowedActions = [
      'removeLineItem',
      'addLineItem',
      'changeState',
      'changeLineItemQuantity',
      'setLineItemPrice',
      'setLineItemTotalPrice',
      'setAmountDiscount',
      'setPercentageDiscount'
    ];
    notAllowedActions.forEach(notAllowedAction => {
      it(`should not allow ${notAllowedAction} action`, () => {
        expect(() => {
          restrictActionsByState({
            state: QUOTE_TYPES.EXPIRED,
            updateAction: { [notAllowedAction]: {} }
          });
        }).toThrow();
      });
    });
  });

  describe('when `Closed` state', () => {
    const notAllowedActions = [
      'removeLineItem',
      'addLineItem',
      'changeState',
      'changeLineItemQuantity',
      'setLineItemPrice',
      'setLineItemTotalPrice',
      'setAmountDiscount',
      'setPercentageDiscount'
    ];
    notAllowedActions.forEach(notAllowedAction => {
      it(`should not allow ${notAllowedAction} action`, () => {
        expect(() => {
          restrictActionsByState({
            state: QUOTE_TYPES.CLOSED,
            updateAction: { [notAllowedAction]: {} }
          });
        }).toThrow();
      });
    });
  });

  describe('when `Approved` state', () => {
    const notAllowedActions = [
      'removeLineItem',
      'addLineItem',
      'changeLineItemQuantity',
      'setLineItemPrice',
      'setLineItemTotalPrice',
      'setAmountDiscount',
      'setPercentageDiscount'
    ];
    notAllowedActions.forEach(notAllowedAction => {
      it(`should not allow ${notAllowedAction} action`, () => {
        expect(() => {
          restrictActionsByState({
            state: QUOTE_TYPES.APPROVED,
            updateAction: { [notAllowedAction]: {} }
          });
        }).toThrow();
      });
    });

    describe('when `changeState` action', () => {
      [
        QUOTE_TYPES.APPROVED,
        QUOTE_TYPES.INITIAL,
        QUOTE_TYPES.SUBMITTED
      ].forEach(state => {
        it(`should not allow change to ${state}`, () => {
          expect(() => {
            restrictActionsByState({
              state: QUOTE_TYPES.APPROVED,
              updateAction: { changeState: { state } }
            });
          }).toThrow();
        });
      });

      [
        QUOTE_TYPES.PLACED,
        QUOTE_TYPES.DECLINED,
        QUOTE_TYPES.EXPIRED,
        QUOTE_TYPES.CLOSED
      ].forEach(state => {
        it(`should allow change to ${state}`, () => {
          expect(
            restrictActionsByState({
              state: QUOTE_TYPES.APPROVED,
              updateAction: { changeState: { state } }
            })
          ).toEqual(undefined);
        });
      });
    });
  });

  describe('when `Submitted` state', () => {
    const notAllowedActions = [
      'removeLineItem',
      'addLineItem',
      'changeLineItemQuantity'
    ];

    const allowedActions = [
      'setLineItemPrice',
      'setLineItemTotalPrice',
      'setAmountDiscount',
      'setPercentageDiscount'
    ];

    notAllowedActions.forEach(notAllowedAction => {
      it(`should not allow ${notAllowedAction} action`, () => {
        expect(() => {
          restrictActionsByState({
            state: QUOTE_TYPES.SUBMITTED,
            updateAction: { [notAllowedAction]: {} }
          });
        }).toThrow();
      });
    });

    allowedActions.forEach(allowedAction => {
      it(`should allow ${allowedAction} action`, () => {
        expect(
          restrictActionsByState({
            state: QUOTE_TYPES.INITIAL,
            updateAction: { [allowedAction]: {} }
          })
        ).toEqual(undefined);
      });
    });

    describe('when `changeState` action', () => {
      [QUOTE_TYPES.PLACED, QUOTE_TYPES.INITIAL, QUOTE_TYPES.SUBMITTED].forEach(
        state => {
          it(`should not allow change to ${state}`, () => {
            expect(() => {
              restrictActionsByState({
                state: QUOTE_TYPES.SUBMITTED,
                updateAction: { changeState: { state } }
              });
            }).toThrow();
          });
        }
      );

      [
        QUOTE_TYPES.APPROVED,
        QUOTE_TYPES.DECLINED,
        QUOTE_TYPES.EXPIRED,
        QUOTE_TYPES.CLOSED
      ].forEach(state => {
        it(`should allow change to ${state}`, () => {
          expect(
            restrictActionsByState({
              state: QUOTE_TYPES.SUBMITTED,
              updateAction: { changeState: { state } }
            })
          ).toEqual(undefined);
        });
      });
    });
  });
});
