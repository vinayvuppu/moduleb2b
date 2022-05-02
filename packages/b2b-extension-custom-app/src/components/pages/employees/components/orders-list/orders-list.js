import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import flowRight from 'lodash.flowright';
import {
  LoadingSpinner,
  Spacings,
  Table,
  Constraints,
} from '@commercetools-frontend/ui-kit';
import { branchOnPermissions } from '@commercetools-frontend/permissions';

import FormattedDateTime from '@commercetools-local/core/components/formatted-date-time';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import PageBottomSpacer from '@commercetools-local/core/components/page-bottom-spacer';
import TabContentLayout from '@commercetools-local/core/components/tab-content-layout';
import Pagination from '@commercetools-local/core/components/search/pagination';
import {
  orderStateMessages,
  paymentStateMessages,
  shipmentStateMessages,
} from '@commercetools-local/core/messages/order-states';
import { PERMISSIONS } from '../../../../../constants';

import OrdersListConnector from '../orders-list-connector';
import messages from './messages';

const columnDefinitions = [
  {
    key: 'orderNumber',
    label: <FormattedMessage {...messages.columnOrderNumber} />,
    flexGrow: 1,
  },
  {
    key: 'orderState',
    label: <FormattedMessage {...messages.columnOrderStatus} />,
    flexGrow: 1,
  },
  {
    key: 'paymentState',
    label: <FormattedMessage {...messages.columnPaymentState} />,
    flexGrow: 1,
  },
  {
    key: 'shipmentState',
    label: <FormattedMessage {...messages.columnShipmentState} />,
    flexGrow: 1,
  },
  {
    key: 'totalPrice',
    label: <FormattedMessage {...messages.columnOrderTotal} />,
    flexGrow: 1,
  },
  {
    key: 'createdAt',
    label: <FormattedMessage {...messages.columnCreatedAt} />,
    flexGrow: 1,
  },
];

export class OrdersList extends React.PureComponent {
  static displayName = 'OrdersList';

  static propTypes = {
    // regular props
    projectKey: PropTypes.string.isRequired,
    employeeId: PropTypes.string.isRequired,
    goToOrderDetails: PropTypes.func.isRequired,

    // HOC
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired }),
  };

  renderOrdersRow = ({ rowIndex, columnKey }, orders) => {
    const order = orders[rowIndex];
    let formattedValue = order[columnKey];

    if (columnKey === 'createdAt')
      formattedValue = (
        <FormattedDateTime type="datetime" value={formattedValue} />
      );
    else if (columnKey === 'totalPrice')
      formattedValue = formatMoney(formattedValue, this.props.intl);
    else if (columnKey === 'orderState')
      formattedValue = formattedValue ? (
        <FormattedMessage {...orderStateMessages[formattedValue]} />
      ) : (
        ''
      );
    else if (columnKey === 'paymentState')
      formattedValue = formattedValue ? (
        <FormattedMessage {...paymentStateMessages[formattedValue]} />
      ) : (
        ''
      );
    else if (columnKey === 'shipmentState')
      formattedValue = formattedValue ? (
        <FormattedMessage {...shipmentStateMessages[formattedValue]} />
      ) : (
        ''
      );

    return formattedValue;
  };

  handleOrderClick = orderId => this.props.goToOrderDetails(orderId);

  handleSortChange = (sortBy, sortDirection, searchQuery) => {
    searchQuery.set({
      ...searchQuery.value,
      page: 1,
      sorting: {
        key: sortBy,
        order: sortDirection.toLowerCase(),
      },
    });
  };

  render() {
    return (
      <OrdersListConnector
        employeeId={this.props.employeeId}
        projectKey={this.props.projectKey}
      >
        {({ ordersFetcher, searchQuery }) => {
          if (ordersFetcher.isLoading)
            return (
              <Spacings.Stack scale="m" alignItems="center">
                <LoadingSpinner>
                  <FormattedMessage {...messages.fetchingOrdersTitle} />
                </LoadingSpinner>
              </Spacings.Stack>
            );
          if (ordersFetcher.orders.results.length === 0)
            return <FormattedMessage {...messages.noOrdersTitle} />;

          return (
            <TabContentLayout
              data-testid="employee-details-orders-tab"
              data-track-component="EmployeesOrders"
            >
              <Constraints.Horizontal>
                <Table
                  columns={columnDefinitions}
                  rowCount={ordersFetcher.orders.results.length}
                  items={ordersFetcher.orders.results}
                  itemRenderer={rowData =>
                    this.renderOrdersRow(rowData, ordersFetcher.orders.results)
                  }
                  shouldFillRemainingVerticalSpace={true}
                  onSortChange={(sortBy, sortDirection) => {
                    this.handleSortChange(sortBy, sortDirection, searchQuery);
                  }}
                  sortBy={searchQuery.value.sorting.key}
                  sortDirection={searchQuery.value.sorting.order.toUpperCase()}
                  onRowClick={(e, index) =>
                    this.handleOrderClick(
                      ordersFetcher.orders.results[index].id
                    )
                  }
                >
                  <Pagination
                    totalItems={ordersFetcher.orders.total}
                    perPage={searchQuery.value.perPage}
                    page={searchQuery.value.page}
                    onPerPageChange={nextPerPage =>
                      searchQuery.set({
                        ...searchQuery.value,
                        perPage: nextPerPage,
                      })
                    }
                    onPageChange={nextPage =>
                      searchQuery.set({
                        ...searchQuery.value,
                        page: nextPage,
                      })
                    }
                  />
                </Table>
              </Constraints.Horizontal>
              <PageBottomSpacer />
            </TabContentLayout>
          );
        }}
      </OrdersListConnector>
    );
  }
}

export default flowRight(
  branchOnPermissions([PERMISSIONS.ViewOrders]),
  injectIntl
)(OrdersList);
