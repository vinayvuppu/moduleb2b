import { PropTypes } from 'prop-types';
import React from 'react';
import { compose } from 'recompose';
import { FormattedMessage, injectIntl } from 'react-intl';
import { defaultMemoize } from 'reselect';
import {
  BinFilledIcon,
  IconButton,
  Table,
} from '@commercetools-frontend/ui-kit';
import {
  getSymbolFromCurrency,
  withCurrencies,
} from '@commercetools-frontend/l10n';
import {
  ProjectExtensionProviderForImageRegex,
  withApplicationContext,
} from '@commercetools-frontend/application-shell-connectors';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import { injectTracking } from '../../hocs/inject-tracking';
import OrderItemTableProductCell from '../order-item-table-product-cell';
import OrderItemTableUnitPriceCell from '../order-item-table-unit-price-cell';
import OrderItemTableUnitNetPriceCell from '../order-item-table-unit-net-price-cell';
import OrderItemTableUnitGrossPriceCell from '../order-item-table-unit-gross-price-cell';
import OrderItemTableTotalPriceCell from '../order-item-table-total-price-cell';
import OrderItemTableSubtotalPriceCell from '../order-item-table-subtotal-price-cell';
import OrderItemTableTaxRateCell from '../order-item-table-tax-rate-cell';
import QuantitySelector from '../quantity-selector';
import OrderCreateConnector from '../order-create-connector';
import { selectAllLineItems } from '../../utils/cart-selectors';
import messages from './messages';

export const checkIfTaxIsIncludedInPrice = allLineItems =>
  allLineItems.some(
    lineItem => lineItem.taxRate && lineItem.taxRate.includedInPrice
  );

export const createColumnsDefinition = defaultMemoize(
  ({ currencySymbol, isTaxIncludedInPrice, isEditable, omitColumns }) =>
    [
      {
        key: 'name',
        label: <FormattedMessage {...messages.columnProduct} />,
        flexGrow: 1,
      },
      isTaxIncludedInPrice && {
        key: 'grossPrice',
        label: (
          <FormattedMessage
            {...messages.columnGrossUnitPrice}
            values={{ currencySymbol }}
          />
        ),
        align: 'right',
      },
      isTaxIncludedInPrice && {
        key: 'netPrice',
        label: (
          <FormattedMessage
            {...messages.columnNetUnitPrice}
            values={{ currencySymbol }}
          />
        ),
        align: 'right',
      },
      !isTaxIncludedInPrice && {
        key: 'price',
        label: (
          <FormattedMessage
            {...messages.columnNetUnitPrice}
            values={{ currencySymbol }}
          />
        ),
        align: 'right',
        flexGrow: isEditable ? 1 : undefined,
      },
      {
        key: 'quantity',
        label: <FormattedMessage {...messages.columnQuantity} />,
        align: !isEditable ? 'right' : undefined,
        flexGrow: isEditable ? 1 : undefined,
      },
      {
        key: 'subtotalPrice',
        label: (
          <FormattedMessage
            {...messages.columnSubtotalPrice}
            values={{ currencySymbol }}
          />
        ),
        align: 'right',
        flexGrow: 1,
      },
      {
        key: 'originalPrice',
        label: <FormattedMessage {...messages.columnOriginalPrice} />,
      },
      {
        key: 'taxRate',
        label: <FormattedMessage {...messages.columnTax} />,
        align: 'right',
      },
      {
        key: 'totalPrice',
        label: (
          <FormattedMessage
            {...messages.columnTotalPrice}
            values={{ currencySymbol }}
          />
        ),
        align: 'right',
        flexGrow: isEditable ? 1 : undefined,
      },
      isEditable && {
        key: 'actions',
        label: '',
      },
    ]
      .filter(column => column)
      .filter(column => !omitColumns.includes(column.key))
);

export class OrderCreateItemsTable extends React.PureComponent {
  static displayName = 'OrderCreateItemsTable';
  static propTypes = {
    isEditable: PropTypes.bool,
    onRemoveItem: PropTypes.func,
    onChangeQuantity: PropTypes.func,
    omitColumns: PropTypes.arrayOf(PropTypes.string),

    // withApplicationContext
    locale: PropTypes.string.isRequired,

    // injectIntl
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }),
    // withCurrencies
    currencies: PropTypes.objectOf(
      PropTypes.shape({ label: PropTypes.string, symbol: PropTypes.string })
    ),
    tracking: PropTypes.shape({
      trackDeleteLineItem: PropTypes.func.isRequired,
    }).isRequired,
  };
  static defaultProps = {
    isEditable: false,
    omitColumns: [],
  };

  renderItem = (allItems, cartDraft, { rowIndex, columnKey }) => {
    const lineItem = allItems[rowIndex];
    const isCustomLineItem = !cartDraft.lineItems.find(
      item => lineItem === item
    );

    switch (columnKey) {
      case 'name':
        return (
          <OrderItemTableProductCell
            lineItem={lineItem}
            isCustomLineItem={isCustomLineItem}
          />
        );
      case 'price':
        return (
          <OrderItemTableUnitPriceCell
            lineItem={lineItem}
            isCustomLineItem={isCustomLineItem}
          />
        );
      case 'grossPrice':
        return (
          <OrderItemTableUnitGrossPriceCell
            lineItem={lineItem}
            isCustomLineItem={isCustomLineItem}
          />
        );
      case 'netPrice':
        return (
          <OrderItemTableUnitNetPriceCell
            lineItem={lineItem}
            isCustomLineItem={isCustomLineItem}
          />
        );
      case 'quantity':
        return this.props.isEditable ? (
          <QuantitySelector
            onChange={quantity => {
              this.props.onChangeQuantity({
                quantity: parseFloat(quantity),
                id: lineItem.id,
                isCustomLineItem,
              });
            }}
            quantity={String(lineItem.quantity)}
            menuPortalTarget={document.body}
          />
        ) : (
          lineItem.quantity
        );
      case 'taxRate':
        return <OrderItemTableTaxRateCell taxRate={lineItem.taxRate} />;
      case 'subtotalPrice':
        return (
          <OrderItemTableSubtotalPriceCell
            lineItem={lineItem}
            isCustomLineItem={isCustomLineItem}
          />
        );
      case 'totalPrice':
        return (
          <OrderItemTableTotalPriceCell
            lineItem={lineItem}
            isCustomLineItem={isCustomLineItem}
          />
        );
      case 'originalPrice':
        const originalPrice = lineItem.custom?.customFieldsRaw?.find(
          ({ name }) => name === 'originalPrice'
        )?.value;
        return originalPrice
          ? formatMoney(originalPrice, this.props.intl)
          : '- - - -';
      case 'actions':
        return (
          <IconButton
            label={this.props.intl.formatMessage(messages.deleteItemLabel)}
            icon={<BinFilledIcon />}
            onClick={() => {
              this.props.tracking.trackDeleteLineItem();
              this.props.onRemoveItem(lineItem.id, isCustomLineItem);
            }}
          />
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <OrderCreateConnector.Consumer>
        {({ cartDraftState }) => {
          const currencySymbol = getSymbolFromCurrency(
            cartDraftState.value.totalPrice.currencyCode,
            this.props.currencies
          );
          const allItems = selectAllLineItems(cartDraftState.value);
          const isTaxIncludedInPrice = checkIfTaxIsIncludedInPrice(allItems);
          return (
            <ProjectExtensionProviderForImageRegex>
              <Table
                items={allItems}
                columns={createColumnsDefinition({
                  isTaxIncludedInPrice,
                  currencySymbol,
                  isEditable: this.props.isEditable,
                  omitColumns: this.props.omitColumns,
                })}
                rowCount={allItems.length}
                itemRenderer={({ rowIndex, columnKey }) =>
                  this.renderItem(allItems, cartDraftState.value, {
                    rowIndex,
                    columnKey,
                  })
                }
              />
            </ProjectExtensionProviderForImageRegex>
          );
        }}
      </OrderCreateConnector.Consumer>
    );
  }
}

export default compose(
  withApplicationContext(applicationContext => ({
    locale: applicationContext.dataLocale,
  })),
  injectIntl,
  injectTracking(),
  withCurrencies(ownProps => ownProps.locale)
)(OrderCreateItemsTable);
