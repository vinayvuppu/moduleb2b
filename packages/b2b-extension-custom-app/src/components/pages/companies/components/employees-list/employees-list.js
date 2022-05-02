import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import flowRight from 'lodash.flowright';

import { branchOnPermissions } from '@commercetools-frontend/permissions';
import {
  LoadingSpinner,
  Spacings,
  Table,
  Constraints,
} from '@commercetools-frontend/ui-kit';

import TabContentLayout from '@commercetools-local/core/components/tab-content-layout';
import Pagination from '@commercetools-local/core/components/search/pagination';
import PageBottomSpacer from '@commercetools-local/core/components/page-bottom-spacer';
import { formatMoney } from '@commercetools-local/utils/formats/money';

import { PERMISSIONS } from '../../../../../constants';
import EmployeesListConnector from '../employees-list-connector';
import B2BApolloClientContext from '../../../../common/b2b-apollo-client-context';
import { getRolByValue } from '../../../../utils/roles';

import messages from './messages';

const columnDefinitions = [
  {
    key: 'email',
    label: <FormattedMessage {...messages.email} />,
    flexGrow: 1,
  },
  {
    key: 'firstName',
    label: <FormattedMessage {...messages.firstName} />,
    flexGrow: 1,
  },
  {
    key: 'lastName',
    label: <FormattedMessage {...messages.lastName} />,
    flexGrow: 1,
  },
  {
    key: 'roles',
    label: <FormattedMessage {...messages.roles} />,
    flexGrow: 1,
  },
  {
    key: 'amountExpended',
    label: <FormattedMessage {...messages.budgetConsumed} />,
    flexGrow: 1,
  },
];

export class EmployeesList extends React.Component {
  static displayName = 'EmployeesList';

  static propTypes = {
    // regular props
    projectKey: PropTypes.string.isRequired,
    company: PropTypes.shape({
      id: PropTypes.string.isRequired,
      customerGroup: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    }),
    goToEmployeeDetails: PropTypes.func.isRequired,

    // HOC
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired }),
  };

  renderEmployeeRow = ({ rowIndex, columnKey }, employees) => {
    const employee = employees[rowIndex];
    let formattedValue = employee[columnKey];

    switch (columnKey) {
      case 'amountExpended':
        formattedValue = formatMoney(employee[columnKey], this.props.intl);
        break;
      case 'roles':
        formattedValue = (
          <div>
            {employee[columnKey].map(rol => (
              <div key={rol}>
                {getRolByValue(rol, this.props.intl.formatMessage).label}
              </div>
            ))}
          </div>
        );

        break;
      default:
        formattedValue = employee[columnKey];
        break;
    }

    return formattedValue;
  };

  handleOrderClick = employeeId => this.props.goToEmployeeDetails(employeeId);

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
    if (!this.props.company) {
      return <LoadingSpinner />;
    }
    return (
      <B2BApolloClientContext.Consumer>
        {({ apolloClient }) => {
          return (
            <EmployeesListConnector
              companyId={this.props.company.customerGroup.id}
              projectKey={this.props.projectKey}
              apolloClient={apolloClient}
            >
              {({ employeesFetcher, searchQuery }) => {
                if (employeesFetcher.isLoading)
                  return (
                    <Spacings.Stack scale="m" alignItems="center">
                      <LoadingSpinner>
                        <FormattedMessage
                          {...messages.fetchingEmployeesTitle}
                        />
                      </LoadingSpinner>
                    </Spacings.Stack>
                  );
                if (employeesFetcher.employees.results.length === 0)
                  return <FormattedMessage {...messages.noEmployeesTitle} />;

                return (
                  <TabContentLayout
                    data-testid="company-details-employee-tab"
                    data-track-component="CompanyEmployees"
                  >
                    <Constraints.Horizontal>
                      <Table
                        columns={columnDefinitions}
                        rowCount={employeesFetcher.employees.results.length}
                        items={employeesFetcher.employees.results}
                        itemRenderer={rowData =>
                          this.renderEmployeeRow(
                            rowData,
                            employeesFetcher.employees.results
                          )
                        }
                        shouldFillRemainingVerticalSpace={true}
                        onSortChange={(sortBy, sortDirection) => {
                          this.handleSortChange(
                            sortBy,
                            sortDirection,
                            searchQuery
                          );
                        }}
                        sortBy={searchQuery.value.sorting.key}
                        sortDirection={searchQuery.value.sorting.order.toUpperCase()}
                        onRowClick={(e, index) =>
                          this.handleOrderClick(
                            employeesFetcher.employees.results[index].id
                          )
                        }
                      >
                        <Pagination
                          totalItems={employeesFetcher.employees.total}
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
            </EmployeesListConnector>
          );
        }}
      </B2BApolloClientContext.Consumer>
    );
  }
}

export default flowRight(
  branchOnPermissions([PERMISSIONS.ViewEmployees]),
  injectIntl
)(EmployeesList);
