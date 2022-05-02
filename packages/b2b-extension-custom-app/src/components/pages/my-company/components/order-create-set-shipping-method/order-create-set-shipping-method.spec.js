import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';
import { RadioInput } from '@commercetools-frontend/ui-kit';
import { intlMock } from '@commercetools-local/test-utils';
import { OrderCreateSetShippingMethod } from './order-create-set-shipping-method';

const shippingMethods = [
  {
    id: 'shipping-method-1',
    name: 'shipping method 1',
    description: 'some shipping method',
    isDefault: true,
    rate: {
      isMatching: true,
      price: {
        currencyCode: 'EUR',
        centAmount: 500,
      },
      freeAbove: {
        currencyCode: 'EUR',
        centAmount: 200,
      },
    },
  },
  {
    id: 'shipping-method-2',
    name: 'shipping method 2',
    description: 'some shipping method 2',
    isDefault: false,
    rate: {
      isMatching: true,
      price: {
        currencyCode: 'EUR',
        centAmount: 500,
      },
    },
  },
];

const createTestProps = props => ({
  renderSaveToolbarStep: jest.fn(),
  shippingMethodsByCartFetcher: {
    isLoading: false,
    shippingMethodsByCart: shippingMethods,
  },
  cartDraft: {
    id: 'cart-id',
    version: 1,
    shippingAddress: {
      country: 'DE',
    },
    shippingInfo: {
      shippingMethod: {
        id: 'shipping-method-1',
      },
    },
  },
  cartUpdater: {
    hasErrors: false,
    isLoading: false,
    execute: jest.fn(() => Promise.resolve()),
  },
  onActionError: jest.fn(),
  showNotification: jest.fn(),
  intl: intlMock,
  ...props,
});

describe('lifecycle', () => {
  let props;
  let wrapper;

  describe('when component is updated', () => {
    describe('when one of the shipping methods is the default one', () => {
      describe('when there is no shipping method set for the order yet', () => {
        beforeEach(() => {
          props = createTestProps();
          wrapper = shallow(<OrderCreateSetShippingMethod {...props} />);
          wrapper.instance().componentDidUpdate();
        });

        it('should not call `execute` from `cartUpdater`', () => {
          expect(props.cartUpdater.execute).not.toHaveBeenCalled();
        });
      });
      describe('when there is a shipping method set for the order', () => {
        beforeEach(() => {
          props = createTestProps({
            cartDraft: {
              id: 'cart-id',
              version: 1,
              shippingAddress: {
                country: 'DE',
              },
              shippingInfo: null,
            },
            shippingMethodsByCartFetcher: {
              isLoading: false,
              shippingMethodsByCart: shippingMethods,
              defaultShippingMethod: {
                id: 'default',
              },
            },
          });
          wrapper = shallow(<OrderCreateSetShippingMethod {...props} />);
          wrapper.instance().componentDidUpdate();
        });
        it('should call `execute` from `cartUpdater`', () => {
          expect(props.cartUpdater.execute).toHaveBeenCalled();
        });
      });
    });
  });
});

const TestRowItem = ({ children }) => <div>{children}</div>;
TestRowItem.propTypes = {
  children: PropTypes.any.isRequired,
};

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<OrderCreateSetShippingMethod {...props} />);
  });

  it('should render a `TextHeadline` component', () => {
    expect(wrapper).toRender('TextHeadline');
  });

  it('should render a `CollapsiblePanel` component', () => {
    expect(wrapper).toRender('CollapsiblePanel');
  });

  it('should call `renderSaveToolbarStep`', () => {
    expect(props.renderSaveToolbarStep).toHaveBeenCalled();
  });
  describe('rendering results', () => {
    describe('when no shipping methods available', () => {
      beforeEach(() => {
        props = createTestProps({
          shippingMethodsByCartFetcher: {
            isLoading: false,
            shippingMethodsByCart: [],
          },
        });
        wrapper = shallow(<OrderCreateSetShippingMethod {...props} />);
      });
      it('should not render a table', () => {
        expect(wrapper).not.toRender('Table');
      });
      it('should render a `TextBody` component to show the no results message', () => {
        expect(wrapper).toRender('TextBody');
      });
    });

    describe('when shipping methods available', () => {
      let instance;
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<OrderCreateSetShippingMethod {...props} />);
        instance = wrapper.instance();
      });
      it('should render a table', () => {
        expect(wrapper).toRender('Table');
      });

      it('should pass columns map', () => {
        expect(
          wrapper
            .find('Table')
            .prop('columns')
            .map(_ => _.key)
        ).toEqual([
          'check',
          'name',
          'description',
          'shippingRate',
          'taxCategory',
          'freeAbove',
          'isDefault',
        ]);
      });
      describe('rendering the table rows', () => {
        describe('rendering check column', () => {
          describe('when checked', () => {
            let wrapperRow;
            beforeEach(() => {
              wrapperRow = shallow(
                <TestRowItem>
                  {instance.renderItem({
                    rowIndex: 0,
                    columnKey: 'check',
                  })}
                </TestRowItem>
              );
            });
            it('should render a `Option` component', () => {
              expect(wrapperRow).toRender(RadioInput.Option);
            });
            it('should be checked', () => {
              expect(wrapperRow.find(RadioInput.Option)).toHaveProp(
                'isChecked',
                true
              );
            });
          });
          describe('when not checked', () => {
            let wrapperRow;
            beforeEach(() => {
              wrapperRow = shallow(
                <TestRowItem>
                  {instance.renderItem({
                    rowIndex: 1,
                    columnKey: 'check',
                  })}
                </TestRowItem>
              );
            });
            it('should render a `Option` component', () => {
              expect(wrapperRow).toRender(RadioInput.Option);
            });
            it('should not be checked', () => {
              expect(wrapperRow.find(RadioInput.Option)).toHaveProp(
                'isChecked',
                false
              );
            });
          });
        });

        describe('rendering name column', () => {
          let wrapperRow;
          beforeEach(() => {
            wrapperRow = shallow(
              <TestRowItem>
                {instance.renderItem({
                  rowIndex: 0,
                  columnKey: 'name',
                })}
              </TestRowItem>
            );
          });
          it('should render the shipping method name', () => {
            expect(wrapperRow).toHaveText('shipping method 1');
          });
        });

        describe('rendering description column', () => {
          let wrapperRow;
          beforeEach(() => {
            wrapperRow = shallow(
              <TestRowItem>
                {instance.renderItem({
                  rowIndex: 0,
                  columnKey: 'description',
                })}
              </TestRowItem>
            );
          });
          it('should render the shipping method description', () => {
            expect(wrapperRow).toHaveText('some shipping method');
          });
        });
        describe('rendering shipping method price column', () => {
          let wrapperRow;
          beforeEach(() => {
            wrapperRow = shallow(
              <TestRowItem>
                {instance.renderItem({
                  rowIndex: 0,
                  columnKey: 'shippingRate',
                })}
              </TestRowItem>
            );
          });
          it('should render the shipping method price', () => {
            expect(wrapperRow).toHaveText('EUR 5');
          });
        });
        describe('rendering shipping method free above column', () => {
          describe('when free above value is available', () => {
            let wrapperRow;
            beforeEach(() => {
              wrapperRow = shallow(
                <TestRowItem>
                  {instance.renderItem({
                    rowIndex: 0,
                    columnKey: 'freeAbove',
                  })}
                </TestRowItem>
              );
            });
            it('should render the shipping method free above value', () => {
              expect(wrapperRow).toHaveText('EUR 2');
            });
          });

          describe('when free above value is not available', () => {
            let wrapperRow;
            beforeEach(() => {
              wrapperRow = shallow(
                <TestRowItem>
                  {instance.renderItem({
                    rowIndex: 1,
                    columnKey: 'freeAbove',
                  })}
                </TestRowItem>
              );
            });
            it('should render a hyphen when no value set', () => {
              expect(wrapperRow).toHaveText('-');
            });
          });
        });
        describe('rendering shipping method is default column', () => {
          describe('when the shipping method is default', () => {
            let wrapperRow;
            beforeEach(() => {
              wrapperRow = shallow(
                <TestRowItem>
                  {instance.renderItem({
                    rowIndex: 0,
                    columnKey: 'isDefault',
                  })}
                </TestRowItem>
              );
            });
            it('should render yes', () => {
              expect(wrapperRow.find(FormattedMessage)).toHaveProp(
                'id',
                'Orders.Create.Step.ShippingMethod.Default.yes'
              );
            });
          });
          describe('when the shipping method is not default', () => {
            let wrapperRow;
            beforeEach(() => {
              wrapperRow = shallow(
                <TestRowItem>
                  {instance.renderItem({
                    rowIndex: 1,
                    columnKey: 'isDefault',
                  })}
                </TestRowItem>
              );
            });
            it('should render no', () => {
              expect(wrapperRow.find(FormattedMessage)).toHaveProp(
                'id',
                'Orders.Create.Step.ShippingMethod.Default.no'
              );
            });
          });
        });
      });
    });
  });
});

describe('interactions', () => {
  describe('when selecting a shipping method in the table', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateSetShippingMethod {...props} />);
    });
    describe('when the shipping method is already selected', () => {
      beforeEach(async () => {
        await wrapper.instance().handleSetShippingMethod(0);
      });
      it('should not call `execute` from `cartUpdater`', () => {
        expect(props.cartUpdater.execute).not.toHaveBeenCalled();
      });
      it('should not call the `showNotification` function', () => {
        expect(props.showNotification).not.toHaveBeenCalled();
      });
    });

    describe('when selecting a different shipping method', () => {
      beforeEach(async () => {
        await wrapper.instance().handleSetShippingMethod(1);
      });
      it('should call `execute` from `cartUpdater`', () => {
        expect(props.cartUpdater.execute).toHaveBeenCalled();
      });
      it('should show the confirmation notification', () => {
        expect(props.showNotification).toHaveBeenCalledTimes(1);
      });
      describe('when rejecting', () => {
        describe('when there is a `MissingTaxRateForCountry` error', () => {
          beforeEach(async () => {
            props = createTestProps({
              cartUpdater: {
                hasErrors: false,
                isLoading: false,
                execute: jest.fn(() =>
                  Promise.reject([
                    {
                      code: 'MissingTaxRateForCountry',
                    },
                  ])
                ),
              },
            });
            wrapper = shallow(<OrderCreateSetShippingMethod {...props} />);
            await wrapper.instance().handleSetShippingMethod(1);
          });
          it('should show message for `MissingTaxRateForCountry` error', () => {
            expect(props.showNotification).toHaveBeenCalledWith({
              domain: 'side',
              kind: 'error',
              text:
                'Orders.Create.Step.ShippingMethod.setShippingMethodFailure',
            });
          });
        });
        describe('when there is an unknown error', () => {
          beforeEach(async () => {
            props = createTestProps({
              cartUpdater: {
                hasErrors: false,
                isLoading: false,
                execute: jest.fn(() =>
                  Promise.reject(new Error('something wrong happened'))
                ),
              },
            });
            wrapper = shallow(<OrderCreateSetShippingMethod {...props} />);
            await wrapper.instance().handleSetShippingMethod(1);
          });

          it('should call the `onActionError` function', () => {
            expect(props.onActionError).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });
});

describe('callback', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<OrderCreateSetShippingMethod {...props} />);
  });
  describe('when selecting a shipping method', () => {
    let wrapperRow;
    beforeEach(async () => {
      wrapperRow = shallow(
        <TestRowItem>
          {wrapper.instance().renderItem({
            rowIndex: 1,
            columnKey: 'check',
          })}
        </TestRowItem>
      );
      await wrapperRow.find(RadioInput.Option).prop('onChange')();
    });
    it('should call `execute` from `cartUpdater`', () => {
      expect(props.cartUpdater.execute).toHaveBeenCalled();
    });
    it('should show the confirmation notification', () => {
      expect(props.showNotification).toHaveBeenCalledTimes(1);
    });
    it('should show the confirmation notification with the correct data', () => {
      expect(props.showNotification).toHaveBeenCalledWith({
        domain: 'side',
        kind: 'success',
        text: 'Orders.Create.Step.ShippingMethod.shippingMethodUpdated',
      });
    });
  });
});
