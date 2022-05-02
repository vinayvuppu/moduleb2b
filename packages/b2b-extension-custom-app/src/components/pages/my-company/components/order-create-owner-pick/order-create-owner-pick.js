import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';

import {
  Spacings,
  Table,
  Text,
  LoadingSpinner,
  Card,
  PrimaryButton,
  CheckBoldIcon,
} from '@commercetools-frontend/ui-kit';
import { NO_VALUE_FALLBACK, DOMAINS } from '@commercetools-frontend/constants';
import * as globalActions from '@commercetools-frontend/actions-global';
import SearchInput from '@commercetools-local/core/components/fields/search-input';
import Pagination from '@commercetools-local/core/components/search/pagination';
import PageBottomSpacer from '@commercetools-local/core/components/page-bottom-spacer';
import { selectDefaultAddress } from '../../utils/address-selection';
import EmployeeDetailWrapper from '../employee-detail-wrapper';
import replaceLocationWhenDraftIsMissing from '../../utils/replace-location-when-draft-is-missing';

import messages from './messages';
import { OWNER_TYPES } from './constants';

import OrderCreateOwnerPickConnector from '../order-create-owner-pick-connector';
import createColumnsDefinition from './column-definitions';
import B2BApolloClientContext from '../../../../common/b2b-apollo-client-context';

export const ORDER_SET_CUSTOMER_TAB_NAMES = {
  ADDRESSES: 'addresses',
};

export class OrderCreateOwnerPick extends React.PureComponent {
  static displayName = 'OrderCreateOwnerPick';

  static propTypes = {
    title: PropTypes.string.isRequired,
    goToAddressSelection: PropTypes.func.isRequired,
    projectKey: PropTypes.string.isRequired,
    employeesFetcher: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      searchQuery: PropTypes.shape({
        set: PropTypes.func.isRequired,
        value: PropTypes.shape({
          perPage: PropTypes.number.isRequired,
          page: PropTypes.number.isRequired,
          searchText: PropTypes.string,
        }),
      }),
      employees: PropTypes.shape({
        results: PropTypes.array.isRequired,
        total: PropTypes.number.isRequired,
      }),
    }),
    cartDraftState: PropTypes.shape({
      value: PropTypes.shape({
        id: PropTypes.string.isRequired,
        currency: PropTypes.string.isRequired,
      }),
      update: PropTypes.func.isRequired,
    }),
    storeState: PropTypes.shape({
      value: PropTypes.shape({
        id: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired,
        nameAllLocales: PropTypes.arrayOf(
          PropTypes.shape({
            locale: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
          })
        ).isRequired,
      }),
      update: PropTypes.func.isRequired,
    }),
    initialSelectionModalState: PropTypes.shape({
      isOpen: PropTypes.bool.isRequired,
      close: PropTypes.func.isRequired,
    }),
    ownerState: PropTypes.shape({
      owner: PropTypes.shape({
        type: PropTypes.string,
        company: PropTypes.object,
      }).isRequired,
      update: PropTypes.func.isRequired,
    }),
    company: PropTypes.object.isRequired,
    employee: PropTypes.object.isRequired,

    // HoC
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,

    // Connected
    showNotification: PropTypes.func.isRequired,
  };

  // This function sets by default the shipping and billing addresses of the
  // cartDraft depending on the default properties. In case the there are no
  // default addresses, the first address will be the selected one for the cartDraft
  changeCustomerDraft = (customer, owner) => {
    if (customer.stores.length) {
      this.props.cartDraftState.update({
        customerId: customer.id,
        customerEmail: customer.email,
        ...selectDefaultAddress(owner),
        store: {
          key: customer.stores[0].key,
          typeId: 'store',
        },
      });
    } else {
      // TODO
      this.props.showNotification({
        kind: 'error',
        domain: DOMAINS.GLOBAL,
        text: this.props.intl.formatMessage(messages.userWithoutStore),
      });
    }
  };

  handleSearchInputChange = searchText =>
    this.props.employeesFetcher.searchQuery.set({
      ...this.props.employeesFetcher.searchQuery.value,
      searchText,
    });

  handlePerPageChange = perPage =>
    this.props.employeesFetcher.searchQuery.set({
      ...this.props.employeesFetcher.searchQuery.value,
      perPage,
    });

  handlePageChange = page =>
    this.props.employeesFetcher.searchQuery.set({
      ...this.props.employeesFetcher.searchQuery.value,
      page,
    });

  renderItem = ({ rowIndex, columnKey }) => {
    const value = this.props.employeesFetcher.employees.results[rowIndex][
      columnKey
    ];

    return value || NO_VALUE_FALLBACK;
  };

  handleRowClick = rowIndex => {
    this.handleSelectOwner({
      type: OWNER_TYPES.OWNER_EMPLOYEE,
      company: undefined,
      employeeId: this.props.employeesFetcher.employees.results[rowIndex].id,
    });

    this.changeCustomerDraft(
      this.props.employee,
      this.props.employeesFetcher.employees.results[rowIndex]
    );
    this.props.goToAddressSelection(
      this.props.employeesFetcher.employees.results[rowIndex].id
    );
  };

  handleSelectOwner = owner => {
    this.props.ownerState.update(owner);
  };

  handleSelectOwnerMe = () => {
    this.handleSelectOwner({
      type: OWNER_TYPES.OWNER_ME,
      company: undefined,
      employeeId: this.props.employee.id,
    });

    this.changeCustomerDraft(this.props.employee, this.props.employee);
    this.props.goToAddressSelection(this.props.employee.id);
  };

  handleSelectOwnerEmployee = () => {
    this.handleSelectOwner({
      type: OWNER_TYPES.OWNER_EMPLOYEE,
      company: undefined,
      employeeId: undefined,
    });
  };
  handleSelectOwnerCompany = () => {
    this.handleSelectOwner({
      type: OWNER_TYPES.OWNER_COMPANY,
      company: this.props.company,
      employeeId: undefined,
    });

    this.changeCustomerDraft(this.props.employee, this.props.company);

    this.props.goToAddressSelection();
  };

  render() {
    if (this.props.employeesFetcher.isLoading) return <LoadingSpinner />;
    return (
      <Fragment>
        {this.props.ownerState.owner.type === undefined && (
          <Spacings.Inline>
            <Card>
              <Spacings.Inline
                justifyContent="space-between"
                alignItems="center"
              >
                <Text.Body>
                  <FormattedMessage {...messages.ownerMe} />
                </Text.Body>
                <PrimaryButton
                  data-testid="ownerMeButton"
                  iconLeft={<CheckBoldIcon />}
                  size="small"
                  label={this.props.intl.formatMessage(
                    messages.ownerSelectButton
                  )}
                  onClick={this.handleSelectOwnerMe}
                />
              </Spacings.Inline>
            </Card>
            <Card>
              <Spacings.Inline
                justifyContent="space-between"
                alignItems="center"
              >
                <Text.Body>
                  <FormattedMessage {...messages.ownerEmployee} />
                </Text.Body>
                <PrimaryButton
                  data-testid="ownerEmployeeButton"
                  iconLeft={<CheckBoldIcon />}
                  size="small"
                  label={this.props.intl.formatMessage(
                    messages.ownerSelectButton
                  )}
                  onClick={this.handleSelectOwnerEmployee}
                />
              </Spacings.Inline>
            </Card>
            <Card>
              <Spacings.Inline
                justifyContent="space-between"
                alignItems="center"
              >
                <Text.Body>
                  <FormattedMessage {...messages.ownerCompany} />
                </Text.Body>
                <PrimaryButton
                  data-testid="ownerCompanyButton"
                  iconLeft={<CheckBoldIcon />}
                  size="small"
                  label={this.props.intl.formatMessage(
                    messages.ownerSelectButton
                  )}
                  onClick={this.handleSelectOwnerCompany}
                />
              </Spacings.Inline>
            </Card>
          </Spacings.Inline>
        )}
        {this.props.ownerState.owner.type === OWNER_TYPES.OWNER_EMPLOYEE && (
          <Spacings.Stack scale="m">
            <Text.Headline as="h2">{this.props.title}</Text.Headline>
            <Text.Subheadline as="h5">
              {this.props.intl.formatMessage(messages.subTitle)}
            </Text.Subheadline>
            <SearchInput
              initialValue={
                this.props.employeesFetcher.searchQuery.value.searchText
              }
              onSubmit={this.handleSearchInputChange}
              placeholder={this.props.intl.formatMessage(
                messages.searchPlaceholder
              )}
            />
            {this.props.employeesFetcher.employees.results.length > 0 ? (
              <Table
                columns={createColumnsDefinition(this.props.intl)}
                rowCount={this.props.employeesFetcher.employees.results.length}
                itemRenderer={this.renderItem}
                onRowClick={(_, rowIndex) => this.handleRowClick(rowIndex)}
                shouldFillRemainingVerticalSpace={true}
                items={this.props.employeesFetcher.employees.results}
                data-testid="customer-list"
              >
                <Pagination
                  totalItems={this.props.employeesFetcher.employees.total}
                  perPage={
                    this.props.employeesFetcher.searchQuery.value.perPage
                  }
                  onPerPageChange={this.handlePerPageChange}
                  page={this.props.employeesFetcher.searchQuery.value.page}
                  onPageChange={this.handlePageChange}
                />
                <PageBottomSpacer />
              </Table>
            ) : (
              <Text.Body>
                {this.props.intl.formatMessage(messages.noSearchResults)}
              </Text.Body>
            )}
          </Spacings.Stack>
        )}
      </Fragment>
    );
  }
}

// This wrapping component is needed so we check the new results for
// redirecting automatically to th addresses step if only 1 customer is in the search
export const ConnectedOrderCreateOwnerPick = props => (
  <EmployeeDetailWrapper projectKey={props.projectKey}>
    {({ company, employee }) => (
      <B2BApolloClientContext.Consumer>
        {({ apolloClient }) => {
          return (
            <OrderCreateOwnerPickConnector
              projectKey={props.projectKey}
              storeKey={props.storeState?.value?.key}
              company={company}
              apolloClient={apolloClient}
            >
              {({ employeesFetcher }) => (
                <OrderCreateOwnerPick
                  {...props}
                  company={company}
                  employee={employee}
                  employeesFetcher={employeesFetcher}
                />
              )}
            </OrderCreateOwnerPickConnector>
          );
        }}
      </B2BApolloClientContext.Consumer>
    )}
  </EmployeeDetailWrapper>
);
ConnectedOrderCreateOwnerPick.displayName = ConnectedOrderCreateOwnerPick;
ConnectedOrderCreateOwnerPick.propTypes = {
  projectKey: PropTypes.string.isRequired,
  storeState: PropTypes.shape({
    value: PropTypes.shape({
      id: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      nameAllLocales: PropTypes.arrayOf(
        PropTypes.shape({
          locale: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        })
      ).isRequired,
    }),
    update: PropTypes.func.isRequired,
  }),
};

const mapDispatchToProps = {
  showNotification: globalActions.showNotification,
};

export default compose(
  connect(null, mapDispatchToProps),
  replaceLocationWhenDraftIsMissing,
  injectIntl
)(ConnectedOrderCreateOwnerPick);
