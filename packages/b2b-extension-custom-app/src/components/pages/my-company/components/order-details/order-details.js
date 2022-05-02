import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import classnames from 'classnames';
import {
  LoadingSpinner,
  CollapsiblePanel,
  Spacings,
  Text,
  MailIcon,
  Card,
  Table,
} from '@commercetools-frontend/ui-kit';
import View from '@commercetools-local/core/components/view';
import ViewHeader from '@commercetools-local/core/components/view-header';
import {
  useApplicationContext,
  ProjectExtensionProviderForImageRegex,
} from '@commercetools-frontend/application-shell-connectors';
import {
  GRAPHQL_TARGETS,
  NO_VALUE_FALLBACK,
} from '@commercetools-frontend/constants';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import BackToList from '@commercetools-local/core/components/back-to-list';

import messages from './messages';
import styles from './order-details.mod.css';
import AddressSimpleDetailsCard from '../../../../common/AddressSimpleDetailsCard';
import {
  getGrossPriceWithoutShipping,
  getNetPriceWithoutShipping,
  getAllNonShippingTaxes,
  getShippingPrices,
} from '../../utils/order-prices';
import OrderItemTableProductCell from '../order-item-table-product-cell';
import columnDefinition from './column-definitions';
import OrderQuery from './OrderQuery.graphql';

const renderTableItems = ({ rowIndex, columnKey }, lineItems, intl) => {
  const lineItem = lineItems[rowIndex];

  switch (columnKey) {
    case 'product':
      return (
        <OrderItemTableProductCell
          lineItem={lineItem}
          isCustomLineItem={false}
        />
      );
    case 'quantity':
      return lineItem.quantity;
    case 'taxRate':
      return `${lineItem.taxRate.amount * 100}%`;
    case 'unitPrice':
      return formatMoney(lineItem.price.value, intl);
    case 'subtotal':
      return formatMoney(lineItem.taxedPrice.totalNet, intl);
    case 'total':
      return formatMoney(lineItem.taxedPrice.totalGross, intl);
    default:
      return NO_VALUE_FALLBACK;
  }
};

export const OrderDetails = ({ order, backUrl }) => {
  const { formatMessage, formatNumber } = useIntl();

  return (
    <View>
      <ViewHeader
        title={formatMessage(messages.title)}
        backToList={
          <BackToList to={backUrl} label={formatMessage(messages.backToList)} />
        }
      />
      <Spacings.Inset>
        <Spacings.Stack>
          <CollapsiblePanel
            header={
              <CollapsiblePanel.Header>
                {formatMessage(messages.summaryTitle)}
              </CollapsiblePanel.Header>
            }
          >
            <Spacings.Inline>
              <Card className={styles.card}>
                <Spacings.Stack>
                  <Spacings.Inline justifyContent="space-between">
                    <Text.Body isBold intlMessage={messages.orderStateLabel} />
                    <Text.Body>{order.orderState}</Text.Body>
                  </Spacings.Inline>
                  <Spacings.Inline justifyContent="space-between">
                    <Text.Body
                      isBold
                      intlMessage={messages.paymentStateLabel}
                    />
                    <Text.Body>{order.paymentState}</Text.Body>
                  </Spacings.Inline>
                  <Spacings.Inline justifyContent="space-between">
                    <Text.Body
                      isBold
                      intlMessage={messages.shipmentStateLabel}
                    />
                    <Text.Body>{order.shipmentState}</Text.Body>
                  </Spacings.Inline>
                </Spacings.Stack>
              </Card>
              <Card className={classnames(styles.card, styles['card-prices'])}>
                <Spacings.Stack>
                  <Spacings.Inline justifyContent="space-between">
                    <Text.Body
                      isBold
                      intlMessage={messages.subTotalWithoutDiscountLabel}
                    />
                    <Text.Body isBold>
                      {formatMoney(getNetPriceWithoutShipping(order), {
                        formatNumber,
                      })}
                    </Text.Body>
                  </Spacings.Inline>
                  {getAllNonShippingTaxes(order).map(({ amount, name }) => (
                    <Spacings.Inline justifyContent="space-between" key={name}>
                      <Text.Body tone="secondary">{name}</Text.Body>
                      <Text.Body tone="secondary">
                        +{' '}
                        {formatMoney(amount, {
                          formatNumber,
                        })}
                      </Text.Body>
                    </Spacings.Inline>
                  ))}
                  <Spacings.Inline justifyContent="space-between">
                    <Text.Body
                      isBold
                      intlMessage={messages.subTotalGrossLabel}
                    />
                    <Text.Body isBold>
                      {formatMoney(getGrossPriceWithoutShipping(order), {
                        formatNumber,
                      })}
                    </Text.Body>
                  </Spacings.Inline>
                  <Spacings.Inline justifyContent="space-between">
                    <Text.Body tone="secondary">
                      {formatMessage(messages.shippingInclLabel)}{' '}
                      {order.shippingInfo.shippingMethodName}
                    </Text.Body>
                    <Text.Body tone="secondary">
                      +{' '}
                      {formatMoney(getShippingPrices(order).gross, {
                        formatNumber,
                      })}
                    </Text.Body>
                  </Spacings.Inline>
                  <Spacings.Inline
                    justifyContent="space-between"
                    className={styles['last-item-prices']}
                  >
                    <Text.Subheadline
                      isBold
                      as="h4"
                      intlMessage={messages.totalGross}
                    />
                    <Text.Subheadline isBold as="h4">
                      {formatMoney(order.totalPrice, { formatNumber })}
                    </Text.Subheadline>
                  </Spacings.Inline>
                </Spacings.Stack>
              </Card>
            </Spacings.Inline>
          </CollapsiblePanel>
          <CollapsiblePanel
            header={
              <CollapsiblePanel.Header>
                {formatMessage(messages.customerTitle)}
              </CollapsiblePanel.Header>
            }
          >
            <Spacings.Stack alignItems="stretch">
              <Spacings.Inline alignItems="center">
                <Text.Detail>
                  {`${formatMessage(messages.customerEmailLabel)} ${
                    order.employee.email
                  }`}
                </Text.Detail>
                <MailIcon />
              </Spacings.Inline>
              <Spacings.Inline>
                <AddressSimpleDetailsCard
                  type="shipping"
                  address={order.shippingAddress}
                />
                <AddressSimpleDetailsCard
                  type="billing"
                  address={order.billingAddress}
                />
              </Spacings.Inline>
            </Spacings.Stack>
          </CollapsiblePanel>
          <CollapsiblePanel
            header={
              <CollapsiblePanel.Header>
                {formatMessage(messages.orderItemsTitle)}
              </CollapsiblePanel.Header>
            }
          >
            <div className={styles['order-items']}>
              <Spacings.Stack>
                <Table
                  columns={columnDefinition(formatMessage)}
                  itemRenderer={row =>
                    renderTableItems(row, order.lineItems, { formatNumber })
                  }
                  rowCount={order.lineItems.length}
                  items={order.lineItems}
                />
                <Spacings.Inline justifyContent="flex-end">
                  <Text.Body isBold>
                    {formatMessage(messages.totalLabel)}
                  </Text.Body>
                  <Text.Body isBold>
                    {formatMoney(getGrossPriceWithoutShipping(order), {
                      formatNumber,
                    })}
                  </Text.Body>
                </Spacings.Inline>
              </Spacings.Stack>
            </div>
          </CollapsiblePanel>
        </Spacings.Stack>
      </Spacings.Inset>
    </View>
  );
};

OrderDetails.displayName = 'OrderDetails';

OrderDetails.propTypes = {
  order: PropTypes.shape({
    orderState: PropTypes.string.isRequired,
    paymentState: PropTypes.string.isRequired,
    shipmentState: PropTypes.string.isRequired,
    shippingInfo: PropTypes.shape({
      shippingMethodName: PropTypes.string.isRequired,
    }).isRequired,
    employee: PropTypes.shape({
      email: PropTypes.string.isRequired,
    }).isRequired,
    totalPrice: PropTypes.shape({
      type: PropTypes.string.isRequired,
      currencyCode: PropTypes.string.isRequired,
      centAmount: PropTypes.number.isRequired,
      fractionDigits: PropTypes.number.isRequired,
    }).isRequired,
    shippingAddress: PropTypes.shape({
      additionalStreetInfo: PropTypes.string,
      country: PropTypes.string.isRequired,
      additionalAddressInfo: PropTypes.string,
    }).isRequired,
    billingAddress: PropTypes.shape({
      additionalStreetInfo: PropTypes.string,
      country: PropTypes.string.isRequired,
      additionalAddressInfo: PropTypes.string,
    }),
    lineItems: PropTypes.arrayOf(
      PropTypes.shape({
        quantity: PropTypes.number.isRequired,
        taxRate: PropTypes.shape({
          amount: PropTypes.number.isRequired,
        }).isRequired,
        variant: PropTypes.shape({
          images: PropTypes.arrayOf(PropTypes.shape({ url: PropTypes.string }))
            .isRequired,
        }).isRequired,
      })
    ),
  }).isRequired,
  backUrl: PropTypes.string.isRequired,
};

const OrderDetailsWrapper = ({ backUrl }) => {
  const { orderId } = useParams();

  const { dataLocale } = useApplicationContext();

  const { data, loading } = useQuery(OrderQuery, {
    variables: {
      orderId,
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      locale: dataLocale,
    },
    fetchPolicy: 'no-cache',
  });
  return loading ? (
    <LoadingSpinner />
  ) : (
    <ProjectExtensionProviderForImageRegex>
      <OrderDetails order={data.order} backUrl={backUrl} />
    </ProjectExtensionProviderForImageRegex>
  );
};

OrderDetailsWrapper.displayName = 'OrderDetailsWrapper';
OrderDetailsWrapper.propTypes = {
  backUrl: PropTypes.string.isRequired,
};

export default OrderDetailsWrapper;
