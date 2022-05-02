import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import union from 'lodash.union';
import { defaultMemoize } from 'reselect';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  IconButton,
  CopyIcon,
  LoadingSpinner,
  Spacings,
  Table,
  ReviewIcon,
  CheckInactiveIcon,
  Text,
} from '@commercetools-frontend/ui-kit';
import { DOMAINS, NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import * as globalActions from '@commercetools-frontend/actions-global';

import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { transformLocalizedFieldToString } from '@commercetools-local/utils/graphql';
import localize from '@commercetools-local/utils/localize';
import FormattedDateTime from '@commercetools-local/core/components/formatted-date-time';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import { formatCustomField } from '@commercetools-local/utils/formats';
import {
  orderStateMessages,
  paymentStateMessages,
  shipmentStateMessages,
} from '@commercetools-local/core/messages/order-states';
import SearchViewControlledContainer from '@commercetools-local/core/components/search/search-view-controlled-container';
import ColumnManager from '@commercetools-local/core/components/column-manager';
import PageBottomSpacer from '@commercetools-local/core/components/page-bottom-spacer';
import CustomFieldDefinitionsConnector from '@commercetools-local/core/components/custom-field-definitions-connector';
import { omitNestedFieldDefinitions } from '@commercetools-local/utils/type-definitions';
import QuickFilters from '@commercetools-local/core/components/search/quick-filters';
import CompanyOrdersListConnector from '../company-orders-list-connector';
import { injectTracking } from '../../hocs/inject-tracking';
import CompanyOrdersListCustomViewsConnector from '../company-orders-list-custom-views-connector';
import ProjectExtensionOrderStatesVisibilityConnector from '../project-extension-order-states-visibility-connector';
import { DEFAULT_PAGE_SIZES } from '../../../../constants/pagination';
import { FIELD_TYPES } from '../../../../constants/misc';
import CompanyOrdersViewLayout from '../company-orders-view-layout/company-orders-view-layout';
import EmployeeDetailWrapper from '../employee-detail-wrapper';
import messages from './messages';
import createColumnDefinitions from './column-definitions';
import {
  createFilterDefinitions,
  createCustomFieldFilterDefinitions,
} from './filter-definitions';
import createQuickFilterDefinitions from './quick-filter-definitions';

const HIDE_TYPES = [FIELD_TYPES.Set, FIELD_TYPES.Reference];

const ORDER_ACTIONS = {
  APPROVE: 'approve',
  REJECT: 'reject',
};
const ORDER_STATES = {
  CONFIRM: 'confirmed',
  CANCEL: 'canceled',
};

export const getAvailableColumns = defaultMemoize(
  ({
    orderStatesVisibility,
    hasOrderStates,
    customFieldDefinitions,
    isNamesIncluded,
    areAddressesIncludedInEmail,
    language,
    languages,
    areStoresIncluded,
    includeActionsColumn,
    restrictToState,
  }) => {
    const defaultColumnDefinitions = createColumnDefinitions({
      includeStatesColumn: hasOrderStates,
      orderStatesVisibility,
      isNamesIncluded,
      areAddressesIncludedInEmail,
      areStoresIncluded,
      includeActionsColumn,
      restrictToState,
    });

    // Filtering out field definitions that are nested (Set of Sets)
    const omittedNestedFieldDefinitions = customFieldDefinitions
      ? omitNestedFieldDefinitions(customFieldDefinitions).map(
          fieldDefinition => ({
            key: fieldDefinition.name,
            label: localize({
              obj: fieldDefinition,
              key: 'label',
              language,
              fallbackOrder: languages,
              fallback: fieldDefinition.name,
            }),
          })
        )
      : [];

    return defaultColumnDefinitions.concat(omittedNestedFieldDefinitions);
  }
);

export const getColumns = defaultMemoize(
  (
    hasOrderStates,
    orderStatesVisibility,
    customFieldDefinitions,
    visibleColumnsOfView,
    language,
    languages,
    includeActionsColumn,
    restrictToState
  ) => {
    const defaultVisibleColumns = createColumnDefinitions({
      includeStatesColumn: hasOrderStates,
      orderStatesVisibility,
      isNamesIncluded: false,
      areAddressesIncludedInEmail: false,
      areStoresIncluded: visibleColumnsOfView?.some(
        columnOfView => columnOfView.key === 'store'
      ),
      includeActionsColumn,
      restrictToState,
    });
    const availableColumns = getAvailableColumns({
      orderStatesVisibility,
      hasOrderStates,
      customFieldDefinitions,
      isNamesIncluded: true,
      areAddressesIncludedInEmail: true,
      areStoresIncluded: true,
      language,
      languages,
      includeActionsColumn,
      restrictToState,
    });

    const visibleColumns = visibleColumnsOfView
      ? visibleColumnsOfView
          .map(visibleColumn =>
            availableColumns.find(
              availableColumn => availableColumn.key === visibleColumn
            )
          )
          .filter(Boolean)
      : defaultVisibleColumns;

    return {
      visible: visibleColumns,
      available: availableColumns,
    };
  }
);

export const isApproverEmployee = (employee, company) =>
  Boolean(
    employee?.roles?.find(rol => company.approverRoles.find(r => r === rol))
  );

export class CompanyOrdersList extends React.Component {
  static displayName = 'CompanyOrdersList';

  static propTypes = {
    projectKey: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    restrictToState: PropTypes.shape({
      id: PropTypes.string.isRequired,
      nameAllLocales: PropTypes.arrayOf(
        PropTypes.shape({
          locale: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        })
      ),
      descriptionAllLocales: PropTypes.arrayOf(
        PropTypes.shape({
          locale: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        })
      ),
    }),
    orderUpdater: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      execute: PropTypes.func.isRequired,
    }),
    // withRouter
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.shape({ url: PropTypes.string.isRequired }).isRequired,

    // injectIntl
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
    showNotification: PropTypes.func.isRequired,

    // withApplicationContext
    userId: PropTypes.string.isRequired,
    locale: PropTypes.string,
    language: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    orderSpecificStoreDataFences: PropTypes.shape({
      canViewOrders: PropTypes.shape({
        values: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
      canManageOrders: PropTypes.shape({
        values: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
    }),
    canViewAllOrders: PropTypes.bool.isRequired,

    // withProps
    orderSpecificStores: PropTypes.arrayOf(PropTypes.string.isRequired)
      .isRequired,
    filterDefinitions: PropTypes.object,
    quickFilterDefinitions: PropTypes.array,
    // injectTracking
    tracking: PropTypes.shape({
      trackGoToOrderDetails: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    isDialogOpen: false,
    orderId: undefined,
    orderNumber: undefined,
    action: undefined,
  };

  handleSelectOrder = (order, action) =>
    this.setState({
      isDialogOpen: true,
      order,
      action,
    });

  handleCloseDialog = () =>
    this.setState({
      isDialogOpen: false,
      order: undefined,
      action: undefined,
    });

  handleActionOrder = defaultMemoize(
    ({ id, version, action }, execute, refetch) => async () => {
      let actions = [];

      if (action === ORDER_ACTIONS.APPROVE) {
        actions = [
          {
            action: 'changeOrderState',
            orderState: 'Confirmed',
          },
          {
            action: 'transitionState',
            state: {
              typeId: 'state',
              key: ORDER_STATES.CONFIRM,
            },
          },
        ];
      } else {
        actions = [
          {
            action: 'changeOrderState',
            orderState: 'Cancelled',
          },
          {
            action: 'transitionState',
            state: {
              typeId: 'state',
              key: ORDER_STATES.CANCEL,
            },
          },
        ];
      }

      try {
        await execute({ id, version }, actions);
        this.handleCloseDialog();
        this.props.showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: this.props.intl.formatMessage(
            action === ORDER_ACTIONS.APPROVE
              ? messages.orderApprovedSuccess
              : messages.orderRejectedSuccess
          ),
        });
        await refetch();
      } catch (error) {
        this.props.showNotification({
          kind: 'error',
          domain: DOMAINS.SIDE,
          text: error.message || error[0].message,
        });
      }
    }
  );

  handleRowClick = (rowIndex, results) => {
    const order = results[rowIndex];

    this.props.tracking.trackGoToOrderDetails();

    this.props.history.push(`${this.props.match.url}/${order.id}`);
  };

  renderItem = (results, { rowIndex, columnKey }, customFieldDefinitions) => {
    const value = results[rowIndex][columnKey];
    let formattedValue;

    switch (columnKey) {
      case 'totalPrice':
        formattedValue = formatMoney(value, this.props.intl);
        break;
      case 'totalLineItemCount':
        formattedValue =
          results[rowIndex].lineItems.length +
          results[rowIndex].customLineItems.length;
        break;
      case 'state': {
        if (!value) return <div />;

        const name = transformLocalizedFieldToString(value.nameAllLocales);

        // If the order state has a name try to localize it.
        // If not fall back to using the key.
        // NOTE: localize() itself does not support these two types
        // of fallbacks.
        formattedValue = localize({
          obj: { name },
          key: 'name',
          language: this.props.language,
          fallbackOrder: this.props.languages,
          fallback: value.key,
        });
        break;
      }
      case 'orderState':
        formattedValue = value
          ? this.props.intl.formatMessage(orderStateMessages[value])
          : '';
        break;
      case 'paymentState':
        formattedValue = value
          ? this.props.intl.formatMessage(paymentStateMessages[value])
          : '';
        break;
      case 'shipmentState':
        formattedValue = value
          ? this.props.intl.formatMessage(shipmentStateMessages[value])
          : '';
        break;
      case 'createdAt':
      case 'lastModifiedAt':
        formattedValue = <FormattedDateTime type="datetime" value={value} />;
        break;
      case 'firstNameBilling':
        formattedValue =
          (results[rowIndex].billingAddress &&
            results[rowIndex].billingAddress.firstName) ||
          NO_VALUE_FALLBACK;
        break;
      case 'lastNameBilling':
        formattedValue =
          (results[rowIndex].billingAddress &&
            results[rowIndex].billingAddress.lastName) ||
          NO_VALUE_FALLBACK;
        break;
      case 'emailBilling':
        formattedValue =
          (results[rowIndex].billingAddress &&
            results[rowIndex].billingAddress.email) ||
          NO_VALUE_FALLBACK;
        break;
      case 'firstNameShipping':
        formattedValue =
          (results[rowIndex].shippingAddress &&
            results[rowIndex].shippingAddress.firstName) ||
          NO_VALUE_FALLBACK;
        break;
      case 'lastNameShipping':
        formattedValue =
          (results[rowIndex].shippingAddress &&
            results[rowIndex].shippingAddress.lastName) ||
          NO_VALUE_FALLBACK;
        break;
      case 'emailShipping':
        formattedValue =
          (results[rowIndex].shippingAddress &&
            results[rowIndex].shippingAddress.email) ||
          NO_VALUE_FALLBACK;
        break;
      case 'customerEmail':
      case 'orderNumber':
        formattedValue = value || NO_VALUE_FALLBACK;
        break;
      case 'duplicate':
        return (
          <IconButton
            icon={<CopyIcon />}
            label={this.props.intl.formatMessage(messages.copyButton)}
            onClick={() => {
              const order = results[rowIndex];
              this.props.history.push({
                pathname: oneLineTrim`
                /${this.props.projectKey}/orders/${order.id}
                /duplicate
                `,
                state: {
                  previousPathname: `/${this.props.projectKey}/orders`,
                },
              });
            }}
            data-track-component=""
            data-track-label="Create copy of order"
            data-track-event="click"
          />
        );
      case 'store': {
        if (!value) return <div />;
        const name = transformLocalizedFieldToString(value.nameAllLocales);
        return (
          name[this.props.language] || (
            <FormattedMessage
              {...messages.storeKeyValueFallback}
              values={{
                key: value.key,
              }}
            />
          )
        );
      }
      case 'actions': {
        return (
          <Spacings.Inline scale="m">
            <IconButton
              icon={<ReviewIcon />}
              label={this.props.intl.formatMessage(messages.approvalButton)}
              onClick={event => {
                event.stopPropagation();
                event.nativeEvent.stopImmediatePropagation();
                this.handleSelectOrder(
                  results[rowIndex],
                  ORDER_ACTIONS.APPROVE
                );
              }}
            />
            <IconButton
              icon={<CheckInactiveIcon />}
              label={this.props.intl.formatMessage(messages.rejectButton)}
              onClick={event => {
                event.stopPropagation();
                event.nativeEvent.stopImmediatePropagation();
                this.handleSelectOrder(results[rowIndex], ORDER_ACTIONS.REJECT);
              }}
            />
          </Spacings.Inline>
        );
      }

      default: {
        // The key that identifies the custom field
        const customFieldDefinitionsOfColumnKey =
          customFieldDefinitions &&
          customFieldDefinitions.find(
            fieldDefinition => fieldDefinition.name === columnKey
          );

        const customFieldsOfColumnKey = results[
          rowIndex
        ].custom?.customFieldsRaw?.find(
          customField =>
            customField.name === customFieldDefinitionsOfColumnKey?.name
        );

        return customFieldDefinitionsOfColumnKey && customFieldsOfColumnKey
          ? formatCustomField({
              value: customFieldsOfColumnKey.value,
              type: customFieldDefinitionsOfColumnKey.type,
              intl: this.props.intl,
              language: this.props.language,
              languages: this.props.languages,
            })
          : NO_VALUE_FALLBACK;
      }
    }

    return formattedValue;
  };

  // company.key should be equal to store.key PRE-REQUISTE
  generateSearchQuery = (activeView, storeKey) => ({
    ...activeView,
    filters: {
      ...activeView.filters,
      'store.key': [
        {
          type: 'equalTo',
          value: [storeKey],
        },
      ],
      ...(!!this.props.restrictToState && {
        'state.id': [
          {
            type: 'equalTo',
            value: [this.props.restrictToState.id],
          },
        ],
      }),
    },
  });

  render() {
    const stateName = this.props.restrictToState?.nameAllLocales
      ? transformLocalizedFieldToString(
          this.props.restrictToState?.nameAllLocales
        )[this.props.locale]
      : undefined;
    return (
      <EmployeeDetailWrapper projectKey={this.props.projectKey}>
        {({ company, employee }) => (
          <CompanyOrdersListCustomViewsConnector.Consumer>
            {({ activeView, setActiveView }) => (
              <CompanyOrdersListConnector
                projectKey={this.props.projectKey}
                searchQuery={this.generateSearchQuery(
                  activeView,
                  company.store.key
                )}
              >
                {({ ordersFetcher, statesFetcher }) => (
                  <React.Fragment>
                    {this.state.isDialogOpen && (
                      <ConfirmationDialog
                        zIndex={1100}
                        title={this.props.intl.formatMessage(
                          this.state.action === ORDER_ACTIONS.APPROVE
                            ? messages.confirmApprovalTittle
                            : messages.confirmRejectTittle
                        )}
                        isOpen={this.state.isDialogOpen}
                        onClose={this.handleCloseDialog}
                        onCancel={this.handleCloseDialog}
                        onConfirm={this.handleActionOrder(
                          {
                            id: this.state.order.id,
                            version: this.state.order.version,
                            action: this.state.action,
                          },
                          this.props.orderUpdater.execute,
                          ordersFetcher.refetch
                        )}
                      >
                        <Text.Body
                          intlMessage={{
                            ...(this.state.action === ORDER_ACTIONS.APPROVE
                              ? messages.confirmApproval
                              : messages.confirmReject),
                            values: {
                              orderId:
                                this.state.order.orderNumber ||
                                this.state.order.id,
                            },
                          }}
                        />
                      </ConfirmationDialog>
                    )}

                    <ProjectExtensionOrderStatesVisibilityConnector>
                      {({
                        isLoading: isOrderStatesVisibilityLoading,
                        orderStatesVisibility,
                      }) => (
                        <CustomFieldDefinitionsConnector
                          resources={['order']}
                          isDisabled={!this.props.canViewAllOrders}
                        >
                          {({
                            customFieldDefinitionsFetcher: customFieldDefinitionsFetcherForOrders,
                          }) => (
                            <CustomFieldDefinitionsConnector
                              resources={['payment']}
                              isDisabled={!this.props.canViewAllOrders}
                            >
                              {({
                                customFieldDefinitionsFetcher: customFieldDefinitionsFetcherForPayments,
                              }) => {
                                const customFieldFilterDefinitions = createCustomFieldFilterDefinitions(
                                  this.props.intl,
                                  {
                                    orders:
                                      customFieldDefinitionsFetcherForOrders.customFieldDefinitions,
                                    payments:
                                      customFieldDefinitionsFetcherForPayments.customFieldDefinitions,
                                  },
                                  HIDE_TYPES
                                );

                                return (
                                  <CompanyOrdersViewLayout
                                    projectKey={this.props.projectKey}
                                    companyName={company.name}
                                    state={stateName}
                                    total={ordersFetcher.orders.total}
                                  >
                                    <SearchViewControlledContainer
                                      key={activeView.id}
                                      trackingPrefix="Orders List"
                                      pageSizes={DEFAULT_PAGE_SIZES}
                                      page={activeView.page}
                                      perPage={activeView.perPage}
                                      areFiltersVisible={true}
                                      filterDefinitions={{
                                        ...this.props.filterDefinitions,
                                        ...customFieldFilterDefinitions,
                                      }}
                                      count={ordersFetcher.orders.count}
                                      total={ordersFetcher.orders.total}
                                      results={ordersFetcher.orders.results}
                                      onChange={nextFilters => {
                                        setActiveView({
                                          ...activeView,
                                          ...nextFilters,
                                        });
                                      }}
                                      value={activeView}
                                      noResultsText={this.props.intl.formatMessage(
                                        messages.noResultsTitle
                                      )}
                                      searchInputPlaceholder={this.props.intl.formatMessage(
                                        messages.searchPlaceholder
                                      )}
                                      renderQuickFilters={quickFilterProps => (
                                        <QuickFilters
                                          onChange={
                                            quickFilterProps.onUpdateQuickFilterForField
                                          }
                                          onRemove={
                                            quickFilterProps.onRemoveFilterTagFromField
                                          }
                                          definitions={
                                            this.props.quickFilterDefinitions
                                          }
                                          values={activeView.filters}
                                        />
                                      )}
                                    >
                                      {({
                                        rowCount,
                                        results,
                                        sorting,
                                        onSortChange: setSorting,
                                        measurementResetter,
                                        footer,
                                      }) => {
                                        if (
                                          ordersFetcher.isLoading ||
                                          this.props.orderUpdater?.isLoading ||
                                          customFieldDefinitionsFetcherForOrders.isLoading ||
                                          customFieldDefinitionsFetcherForPayments.isLoading ||
                                          isOrderStatesVisibilityLoading
                                        ) {
                                          return (
                                            <Spacings.Stack
                                              scale="m"
                                              alignItems="center"
                                            >
                                              <LoadingSpinner />
                                            </Spacings.Stack>
                                          );
                                        }
                                        const columns = getColumns(
                                          statesFetcher.hasOrderStates,
                                          orderStatesVisibility,
                                          customFieldDefinitionsFetcherForOrders.customFieldDefinitions,
                                          activeView.visibleColumns,
                                          this.props.language,
                                          this.props.languages,
                                          !!this.props.restrictToState &&
                                            isApproverEmployee(
                                              employee,
                                              company
                                            ),
                                          !!this.props.restrictToState
                                        );

                                        return (
                                          <Spacings.Stack scale="m">
                                            <ColumnManager
                                              availableColumns={
                                                columns.available
                                              }
                                              selectedColumns={columns.visible}
                                              onUpdateColumns={nextVisibleColumns => {
                                                const keysOfVisibleColumns = nextVisibleColumns.map(
                                                  visibleColumn =>
                                                    visibleColumn.key
                                                );

                                                setActiveView({
                                                  ...activeView,
                                                  visibleColumns: keysOfVisibleColumns,
                                                });
                                              }}
                                            />
                                            <Table
                                              columns={columns.visible}
                                              itemRenderer={item =>
                                                this.renderItem(results, item, [
                                                  ...customFieldDefinitionsFetcherForOrders.customFieldDefinitions,
                                                  ...customFieldDefinitionsFetcherForPayments.customFieldDefinitions,
                                                ])
                                              }
                                              rowCount={rowCount}
                                              onRowClick={(_, rowIndex) =>
                                                this.handleRowClick(
                                                  rowIndex,
                                                  results
                                                )
                                              }
                                              onSortChange={setSorting}
                                              sortBy={sorting.key}
                                              sortDirection={sorting.order.toUpperCase()}
                                              measurementResetter={
                                                measurementResetter
                                              }
                                              shouldFillRemainingVerticalSpace={
                                                true
                                              }
                                              items={results}
                                            >
                                              {footer}
                                              <PageBottomSpacer />
                                            </Table>
                                          </Spacings.Stack>
                                        );
                                      }}
                                    </SearchViewControlledContainer>
                                  </CompanyOrdersViewLayout>
                                );
                              }}
                            </CustomFieldDefinitionsConnector>
                          )}
                        </CustomFieldDefinitionsConnector>
                      )}
                    </ProjectExtensionOrderStatesVisibilityConnector>
                  </React.Fragment>
                )}
              </CompanyOrdersListConnector>
            )}
          </CompanyOrdersListCustomViewsConnector.Consumer>
        )}
      </EmployeeDetailWrapper>
    );
  }
}

const mapDispatchToProps = {
  showNotification: globalActions.showNotification,
};

export default compose(
  connect(null, mapDispatchToProps),
  withApplicationContext(applicationContext => ({
    userId: applicationContext.user.id,
    language: applicationContext.dataLocale,
    languages: applicationContext.project.languages,
    canViewAllOrders:
      applicationContext.permissions.canViewOrders ||
      applicationContext.permissions.canManageOrders,
    orderSpecificStoreDataFences: applicationContext.dataFences?.store?.orders,
    locale: applicationContext.user.locale,
  })),
  injectIntl,
  injectTracking(),
  withProps(ownProps => {
    // if we have project level ViewOrders or ManageOrders permission
    // then we can see all the orders in the list
    const shouldFilterListByStores = !ownProps.canViewAllOrders;

    const canManageOrdersStoreValues =
      ownProps.orderSpecificStoreDataFences?.canManageOrders?.values ?? [];

    const canViewOrdersStoreValues =
      ownProps.orderSpecificStoreDataFences?.canViewOrders?.values ?? [];

    // we create an array with the unique store keys to pass to the filter
    const orderSpecificStores = union(
      canManageOrdersStoreValues,
      canViewOrdersStoreValues
    );
    const filterDefinitions = shouldFilterListByStores
      ? createFilterDefinitions(
          ownProps.intl,
          orderSpecificStores,
          !!ownProps.restrictToState
        )
      : createFilterDefinitions(
          ownProps.intl,
          undefined,
          !!ownProps.restrictToState
        );

    const quickFilterDefinitions = createQuickFilterDefinitions(ownProps.intl);

    return {
      orderSpecificStores,
      filterDefinitions,
      quickFilterDefinitions,
    };
  }),
  withRouter
)(CompanyOrdersList);
