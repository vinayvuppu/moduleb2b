import { PropTypes } from 'prop-types';
import React from 'react';
import { shallow } from 'enzyme';
import { IconButton } from '@commercetools-frontend/ui-kit';
import { intlMock } from '@commercetools-local/test-utils';
import QuantitySelector from '../quantity-selector';
import OrderItemTableProductCell from '../order-item-table-product-cell';
import OrderItemTableUnitPriceCell from '../order-item-table-unit-price-cell';
import OrderItemTableUnitNetPriceCell from '../order-item-table-unit-net-price-cell';
import OrderItemTableUnitGrossPriceCell from '../order-item-table-unit-gross-price-cell';
import OrderItemTableTotalPriceCell from '../order-item-table-total-price-cell';
import OrderItemTableSubtotalPriceCell from '../order-item-table-subtotal-price-cell';
import OrderItemTableTaxRateCell from '../order-item-table-tax-rate-cell';
import {
  OrderCreateItemsTable,
  checkIfTaxIsIncludedInPrice,
} from './order-create-items-table';
import OrderCreateConnector from '../order-create-connector';

const lineItems = [
  {
    id: 'line-item-id-1',
    name: {
      de: 'Ein Produkt',
      en: 'A Product',
    },
    price: {
      value: {
        centAmount: 1000,
        currencyCode: 'EUR',
      },
    },
    taxRate: {
      amount: 0.19,
      includedInPrice: true,
    },
    variant: {
      images: [],
      sku: 'sku123',
    },
    quantity: 2,
    totalPrice: {
      centAmount: 2000,
      currencyCode: 'EUR',
    },
    discountedPricePerQuantity: [],
  },
  {
    id: 'line-item-id-2',
    name: {
      de: 'Zweites Produkt ohne taxRate',
      en: 'Second Product without taxRate',
    },
    price: {
      value: {
        centAmount: 8400,
        currencyCode: 'EUR',
      },
      id: '76e47bcb-9a48-4c1c-85b6-9a331990a19b',
      discounted: {
        value: {
          currencyCode: 'EUR',
          centAmount: 5880,
        },
        discount: {
          obj: {
            value: {
              type: 'relative',
              permyriad: 3000,
            },
            name: {
              en: '30% off on athletics',
            },
          },
        },
      },
    },
    variant: {
      images: [],
      sku: 'sku321',
    },
    quantity: 2,
    discountedPricePerQuantity: [],
    totalPrice: {
      centAmount: 11760,
      currencyCode: 'EUR',
    },
  },
];

const customLineItems = [
  {
    id: 'line-item-id-3',
    name: {
      de: 'Erstes Custom Line Item ohne taxRate',
      en: 'First Custom Line Item taxRate',
    },
    money: {
      centAmount: 999,
      currencyCode: 'EUR',
    },
    quantity: 2,
    totalPrice: {
      centAmount: 2000,
      currencyCode: 'EUR',
    },
    discountedPricePerQuantity: [],
  },
  {
    id: 'line-item-id-4',
    name: {
      de: 'Zweites Custom Line Item ohne taxRate',
      en: 'Second Custom Line Item taxRate',
    },
    money: {
      centAmount: 1100,
      currencyCode: 'EUR',
    },
    quantity: 2,
    discountedPricePerQuantity: [],
    taxRate: {
      amount: 0.1,
      includedInPrice: true,
    },
    totalPrice: {
      centAmount: 2200,
      currencyCode: 'EUR',
    },
    taxedPrice: {
      totalNet: {
        centAmount: 2000,
      },
      totalGross: {
        centAmount: 2200,
      },
    },
  },
  {
    id: 'line-item-id-5',
    name: {
      de: 'Drites Custom Line Item ohne taxRate',
      en: 'Third Custom Line Item taxRate',
    },
    money: {
      centAmount: 1000,
      currencyCode: 'EUR',
    },
    quantity: 2,
    taxRate: {
      amount: 0.1,
      includedInPrice: false,
    },
    discountedPricePerQuantity: [],
    totalPrice: {
      centAmount: 2200,
      currencyCode: 'EUR',
    },
    taxedPrice: {
      totalNet: {
        centAmount: 2000,
      },
      totalGross: {
        centAmount: 2200,
      },
    },
  },
];

const createTestProps = props => ({
  isEditable: false,
  onRemoveItem: jest.fn(),
  onChangeQuantity: jest.fn(),
  intl: intlMock,
  locale: 'en',
  currencies: {
    EUR: {
      label: 'EUR',
      symbol: '€',
    },
  },
  tracking: {
    trackDeleteLineItem: jest.fn(),
  },
  ...props,
});

const createContextProps = customProps => ({
  cartDraftState: {
    update: jest.fn(),
    reset: jest.fn(),
    value: {
      lineItems,
      customLineItems,
      discountCodes: [],
      totalPrice: {
        currencyCode: 'EUR',
      },
    },
  },
  ...customProps,
});

const TestRowItem = ({ children }) => <div>{children}</div>;
TestRowItem.propTypes = {
  children: PropTypes.any.isRequired,
};

describe('checkIfTaxIncludedInPrice', () => {
  describe('when tax is included in price', () => {
    it('should return true when tax is included in price', () => {
      expect(
        checkIfTaxIsIncludedInPrice([{ taxRate: { includedInPrice: true } }])
      ).toBe(true);
    });
  });
  describe('when tax is not included in price', () => {
    it('should return false when tax is not included in price', () => {
      expect(
        checkIfTaxIsIncludedInPrice([{ taxRate: { includedInPrice: false } }])
      ).toBe(false);
    });
  });
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<OrderCreateItemsTable {...props} />);
    wrapper = wrapper
      .find(OrderCreateConnector.Consumer)
      .renderProp('children')(createContextProps());
  });

  it('should render a table', () => {
    expect(wrapper).toRender('Table');
  });

  describe('table columns', () => {
    describe('isEditable', () => {
      describe('when the table is not editable', () => {
        beforeEach(() => {
          props = createTestProps();
          wrapper = shallow(<OrderCreateItemsTable {...props} />);
          wrapper = wrapper
            .find(OrderCreateConnector.Consumer)
            .renderProp('children')(createContextProps());
        });
        it('should pass columns map', () => {
          expect(
            wrapper
              .find('Table')
              .prop('columns')
              .map(column => column.key)
          ).toEqual([
            'name',
            'grossPrice',
            'netPrice',
            'quantity',
            'subtotalPrice',
            'originalPrice',
            'taxRate',
            'totalPrice',
          ]);
        });
      });
      describe('when the table is editable', () => {
        beforeEach(() => {
          props = createTestProps({ isEditable: true });
          wrapper = shallow(<OrderCreateItemsTable {...props} />);
          wrapper = wrapper
            .find(OrderCreateConnector.Consumer)
            .renderProp('children')(createContextProps());
        });
        it('should pass columns map', () => {
          expect(
            wrapper
              .find('Table')
              .prop('columns')
              .map(column => column.key)
          ).toEqual([
            'name',
            'grossPrice',
            'netPrice',
            'quantity',
            'subtotalPrice',
            'originalPrice',
            'taxRate',
            'totalPrice',
            'actions',
          ]);
        });
      });
    });
    describe('isTaxIncludedInPrice', () => {
      describe('when tax is included in price', () => {
        beforeEach(() => {
          props = createTestProps();
          wrapper = shallow(<OrderCreateItemsTable {...props} />);
          wrapper = wrapper
            .find(OrderCreateConnector.Consumer)
            .renderProp('children')(createContextProps());
        });
        it('should pass columns map', () => {
          expect(
            wrapper
              .find('Table')
              .prop('columns')
              .map(column => column.key)
          ).toEqual([
            'name',
            'grossPrice',
            'netPrice',
            'quantity',
            'subtotalPrice',
            'originalPrice',
            'taxRate',
            'totalPrice',
          ]);
        });
      });
      describe('when tax is not included in price', () => {
        beforeEach(() => {
          props = createTestProps();
          wrapper = shallow(<OrderCreateItemsTable {...props} />);
          wrapper = wrapper
            .find(OrderCreateConnector.Consumer)
            .renderProp('children')(
            createContextProps({
              cartDraftState: {
                value: {
                  discountCodes: [],
                  totalPrice: {
                    currencyCode: 'EUR',
                  },
                  lineItems: [
                    {
                      id: 'line-item-id-1',
                      name: {
                        de: 'Ein Produkt',
                        en: 'A Product',
                      },
                      price: {
                        value: {
                          centAmount: 1000,
                          currencyCode: 'EUR',
                        },
                      },
                      taxRate: {
                        amount: 0.19,
                        includedInPrice: false,
                      },
                      variant: {
                        images: [],
                        sku: 'sku123',
                      },
                      quantity: 2,
                      totalPrice: {
                        centAmount: 2000,
                        currencyCode: 'EUR',
                      },
                      discountedPricePerQuantity: [],
                    },
                  ],
                  customLineItems: [],
                },
              },
            })
          );
        });
        it('should pass columns map', () => {
          expect(
            wrapper
              .find('Table')
              .prop('columns')
              .map(column => column.key)
          ).toEqual([
            'name',
            'price',
            'quantity',
            'subtotalPrice',
            'originalPrice',
            'taxRate',
            'totalPrice',
          ]);
        });
      });
    });
  });

  describe('should render table rows', () => {
    let instance;
    let wrapperRow;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateItemsTable {...props} />);
      instance = wrapper.instance();
    });

    const allItems = [...lineItems, ...customLineItems];
    const contextProps = createContextProps();

    describe('rendering the name column', () => {
      beforeEach(() => {
        wrapperRow = shallow(
          <TestRowItem>
            {instance.renderItem(allItems, contextProps.cartDraftState.value, {
              rowIndex: 0,
              columnKey: 'name',
            })}
          </TestRowItem>
        );
      });
      it('should not render the Link to the product', () => {
        expect(wrapperRow).not.toRender('Link');
      });
      it('should render the product cell component', () => {
        expect(wrapperRow).toRender(OrderItemTableProductCell);
      });
      it('should pass the line item to the product cell component', () => {
        expect(wrapperRow.find(OrderItemTableProductCell)).toHaveProp(
          'lineItem',
          allItems[0]
        );
      });
      it('should not be a custom line item', () => {
        expect(wrapperRow.find(OrderItemTableProductCell)).toHaveProp(
          'isCustomLineItem',
          false
        );
      });
      describe('when item is a custom line item', () => {
        beforeEach(() => {
          wrapperRow = shallow(
            <TestRowItem>
              {instance.renderItem(
                allItems,
                contextProps.cartDraftState.value,
                {
                  rowIndex: 2,
                  columnKey: 'name',
                }
              )}
            </TestRowItem>
          );
        });
        it('should be a custom line item', () => {
          expect(wrapperRow.find(OrderItemTableProductCell)).toHaveProp(
            'isCustomLineItem',
            true
          );
        });
      });
    });

    describe('rendering the unit price column', () => {
      beforeEach(() => {
        wrapperRow = shallow(
          <TestRowItem>
            {instance.renderItem(allItems, contextProps.cartDraftState.value, {
              rowIndex: 0,
              columnKey: 'price',
            })}
          </TestRowItem>
        );
      });
      it('should render the unit price cell component', () => {
        expect(wrapperRow).toRender(OrderItemTableUnitPriceCell);
      });

      it('should pass the line item to the unit price cell component', () => {
        expect(wrapperRow.find(OrderItemTableUnitPriceCell)).toHaveProp(
          'lineItem',
          allItems[0]
        );
      });
      it('should pass the isCustomLineItem flag to the unit price cell component', () => {
        expect(wrapperRow.find(OrderItemTableUnitPriceCell)).toHaveProp(
          'isCustomLineItem',
          false
        );
      });
      describe('when item is a custom line item', () => {
        beforeEach(() => {
          wrapperRow = shallow(
            <TestRowItem>
              {instance.renderItem(
                allItems,
                contextProps.cartDraftState.value,
                {
                  rowIndex: 2,
                  columnKey: 'price',
                }
              )}
            </TestRowItem>
          );
        });
        it('should pass the isCustomLineItem flag to the unit price cell component', () => {
          expect(wrapperRow.find(OrderItemTableUnitPriceCell)).toHaveProp(
            'isCustomLineItem',
            true
          );
        });
      });
    });

    describe('rendering the gross unit price column', () => {
      beforeEach(() => {
        wrapperRow = shallow(
          <TestRowItem>
            {instance.renderItem(allItems, contextProps.cartDraftState.value, {
              rowIndex: 0,
              columnKey: 'grossPrice',
            })}
          </TestRowItem>
        );
      });
      it('should render the gross unit price cell component', () => {
        expect(wrapperRow).toRender(OrderItemTableUnitGrossPriceCell);
      });
      it('should pass the line item to the gross unit price cell component', () => {
        expect(wrapperRow.find(OrderItemTableUnitGrossPriceCell)).toHaveProp(
          'lineItem',
          allItems[0]
        );
      });
      it('should pass the isCustomLineItem flag to the gross unit price cell component', () => {
        expect(wrapperRow.find(OrderItemTableUnitGrossPriceCell)).toHaveProp(
          'isCustomLineItem',
          false
        );
      });
      describe('when item is a custom line item', () => {
        beforeEach(() => {
          wrapperRow = shallow(
            <TestRowItem>
              {instance.renderItem(
                allItems,
                contextProps.cartDraftState.value,
                {
                  rowIndex: 2,
                  columnKey: 'grossPrice',
                }
              )}
            </TestRowItem>
          );
        });
        it('should pass the isCustomLineItem flag to the gross unit price cell component', () => {
          expect(wrapperRow.find(OrderItemTableUnitGrossPriceCell)).toHaveProp(
            'isCustomLineItem',
            true
          );
        });
      });
    });

    describe('rendering the net unit price column', () => {
      beforeEach(() => {
        wrapperRow = shallow(
          <TestRowItem>
            {instance.renderItem(allItems, contextProps.cartDraftState.value, {
              rowIndex: 0,
              columnKey: 'netPrice',
            })}
          </TestRowItem>
        );
      });
      it('should render the net unit price cell component', () => {
        expect(wrapperRow).toRender(OrderItemTableUnitNetPriceCell);
      });
      it('should pass the line item to the net unit price cell component', () => {
        expect(wrapperRow.find(OrderItemTableUnitNetPriceCell)).toHaveProp(
          'lineItem',
          allItems[0]
        );
      });
      it('should pass the isCustomLineItem flag to the net unit price cell component', () => {
        expect(wrapperRow.find(OrderItemTableUnitNetPriceCell)).toHaveProp(
          'isCustomLineItem',
          false
        );
      });
      describe('when item is a custom line item', () => {
        beforeEach(() => {
          wrapperRow = shallow(
            <TestRowItem>
              {instance.renderItem(
                allItems,
                contextProps.cartDraftState.value,
                {
                  rowIndex: 2,
                  columnKey: 'netPrice',
                }
              )}
            </TestRowItem>
          );
        });
        it('should pass the isCustomLineItem flag to the net unit price cell component', () => {
          expect(wrapperRow.find(OrderItemTableUnitNetPriceCell)).toHaveProp(
            'isCustomLineItem',
            true
          );
        });
      });
    });

    describe('rendering the quantity column', () => {
      beforeEach(() => {
        wrapperRow = shallow(
          <TestRowItem>
            {instance.renderItem(allItems, contextProps.cartDraftState.value, {
              rowIndex: 0,
              columnKey: 'quantity',
            })}
          </TestRowItem>
        );
      });
      it('should render the quantity value', () => {
        expect(wrapperRow).toHaveText('2');
      });
      describe('when the table is editable', () => {
        beforeEach(() => {
          props = createTestProps({ isEditable: true });
          wrapper = shallow(<OrderCreateItemsTable {...props} />);
          instance = wrapper.instance();
          wrapperRow = shallow(
            <TestRowItem>
              {instance.renderItem(
                allItems,
                contextProps.cartDraftState.value,
                { rowIndex: 0, columnKey: 'quantity' }
              )}
            </TestRowItem>
          );
        });
        it('should render the QuantitySelector component', () => {
          expect(wrapperRow).toRender(QuantitySelector);
        });
        it('should pass the quantity value to the QuantitySelector component', () => {
          expect(wrapperRow.find(QuantitySelector)).toHaveProp(
            'quantity',
            String(allItems[0].quantity)
          );
        });
      });
    });
    describe('rendering the tax rate column', () => {
      beforeEach(() => {
        wrapperRow = shallow(
          <TestRowItem>
            {instance.renderItem(allItems, contextProps.cartDraftState.value, {
              rowIndex: 0,
              columnKey: 'taxRate',
            })}
          </TestRowItem>
        );
      });
      it('should render the tax rate cell component', () => {
        expect(wrapperRow).toRender(OrderItemTableTaxRateCell);
      });
      it('should pass the tax rate to the tax rate cell component', () => {
        expect(wrapperRow.find(OrderItemTableTaxRateCell)).toHaveProp(
          'taxRate',
          allItems[0].taxRate
        );
      });
    });
    describe('rendering subtotal price column', () => {
      beforeEach(() => {
        wrapperRow = shallow(
          <TestRowItem>
            {instance.renderItem(allItems, contextProps.cartDraftState.value, {
              rowIndex: 0,
              columnKey: 'subtotalPrice',
            })}
          </TestRowItem>
        );
      });
      it('should render the subtotal price cell component', () => {
        expect(wrapperRow).toRender(OrderItemTableSubtotalPriceCell);
      });
      it('should pass the line item to the subtotal price cell component', () => {
        expect(wrapperRow.find(OrderItemTableSubtotalPriceCell)).toHaveProp(
          'lineItem',
          allItems[0]
        );
      });
      it('should pass the isCustomLineItem flag to the subtotal price cell component', () => {
        expect(wrapperRow.find(OrderItemTableSubtotalPriceCell)).toHaveProp(
          'isCustomLineItem',
          false
        );
      });
      describe('when item is a custom line item', () => {
        beforeEach(() => {
          wrapperRow = shallow(
            <TestRowItem>
              {instance.renderItem(
                allItems,
                contextProps.cartDraftState.value,
                {
                  rowIndex: 2,
                  columnKey: 'subtotalPrice',
                }
              )}
            </TestRowItem>
          );
        });
        it('should pass the isCustomLineItem flag to the subtotal price cell component', () => {
          expect(wrapperRow.find(OrderItemTableSubtotalPriceCell)).toHaveProp(
            'isCustomLineItem',
            true
          );
        });
      });
    });
    describe('rendering total price column', () => {
      beforeEach(() => {
        wrapperRow = shallow(
          <TestRowItem>
            {instance.renderItem(allItems, contextProps.cartDraftState.value, {
              rowIndex: 0,
              columnKey: 'totalPrice',
            })}
          </TestRowItem>
        );
      });
      it('should render the total price cell component', () => {
        expect(wrapperRow).toRender(OrderItemTableTotalPriceCell);
      });
      it('should pass the line item to the total price cell component', () => {
        expect(wrapperRow.find(OrderItemTableTotalPriceCell)).toHaveProp(
          'lineItem',
          allItems[0]
        );
      });
      it('should pass the isCustomLineItem flag to the total price cell component', () => {
        expect(wrapperRow.find(OrderItemTableTotalPriceCell)).toHaveProp(
          'isCustomLineItem',
          false
        );
      });
      describe('when item is a custom line item', () => {
        beforeEach(() => {
          wrapperRow = shallow(
            <TestRowItem>
              {instance.renderItem(
                allItems,
                contextProps.cartDraftState.value,
                { rowIndex: 2, columnKey: 'totalPrice' }
              )}
            </TestRowItem>
          );
        });
        it('should pass the isCustomLineItem flag to the total price cell component', () => {
          expect(wrapperRow.find(OrderItemTableTotalPriceCell)).toHaveProp(
            'isCustomLineItem',
            true
          );
        });
      });
    });
    describe('rendering the actions column', () => {
      beforeEach(() => {
        props = createTestProps({ isEditable: true });
        wrapper = shallow(<OrderCreateItemsTable {...props} />);
        instance = wrapper.instance();
        wrapperRow = shallow(
          <TestRowItem>
            {instance.renderItem(allItems, contextProps.cartDraftState.value, {
              rowIndex: 0,
              columnKey: 'actions',
            })}
          </TestRowItem>
        );
      });
      it('should render the delete IconButton', () => {
        expect(wrapperRow).toRender(IconButton);
      });
    });
  });
});

describe('callbacks', () => {
  const allItems = [...lineItems, ...customLineItems];
  const contextProps = createContextProps();
  describe('when clicking the remove item button', () => {
    let props;
    let wrapper;
    let instance;
    let wrapperRow;
    beforeEach(() => {
      props = createTestProps({ isEditable: true });
      wrapper = shallow(<OrderCreateItemsTable {...props} />);
      instance = wrapper.instance();
      wrapperRow = shallow(
        <TestRowItem>
          {instance.renderItem(allItems, contextProps.cartDraftState.value, {
            rowIndex: 0,
            columnKey: 'actions',
          })}
        </TestRowItem>
      );
      wrapperRow.find(IconButton).simulate('click');
    });
    it('should call the onRemoveItem function', () => {
      expect(props.onRemoveItem).toHaveBeenCalledTimes(1);
    });
    it('should call the onRemoveItem function with the line item info', () => {
      expect(props.onRemoveItem).toHaveBeenCalledWith(allItems[0].id, false);
    });
  });
  describe('when changing the QuantitySelector value', () => {
    let props;
    let wrapper;
    let instance;
    let wrapperRow;
    beforeEach(() => {
      props = createTestProps({ isEditable: true });
      wrapper = shallow(<OrderCreateItemsTable {...props} />);
      instance = wrapper.instance();
      wrapperRow = shallow(
        <TestRowItem>
          {instance.renderItem(allItems, contextProps.cartDraftState.value, {
            rowIndex: 0,
            columnKey: 'quantity',
          })}
        </TestRowItem>
      );
      wrapperRow.find(QuantitySelector).prop('onChange')(5);
    });
    it('should call the onChangeQuantity function', () => {
      expect(props.onChangeQuantity).toHaveBeenCalledTimes(1);
    });
    it('should call the onChangeQuantity function with the line item info and new quantity', () => {
      expect(props.onChangeQuantity).toHaveBeenCalledWith({
        quantity: 5,
        id: allItems[0].id,
        isCustomLineItem: false,
      });
    });
  });
});
