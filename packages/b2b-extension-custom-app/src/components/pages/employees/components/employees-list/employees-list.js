import PropTypes from 'prop-types';
import React from 'react';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { getIn } from 'formik';
import flowRight from 'lodash.flowright';
import memoize from 'memoize-one';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import {
  LoadingSpinner,
  Spacings,
  Table,
} from '@commercetools-frontend/ui-kit';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import FormattedDateTime from '@commercetools-local/core/components/formatted-date-time';
import { formatCustomField } from '@commercetools-local/utils/formats';
import { injectTransformedLocalizedFields } from '@commercetools-local/utils/graphql';
import SearchViewControlledContainer from '@commercetools-local/core/components/search/search-view-controlled-container';
import ColumnManager from '@commercetools-local/core/components/column-manager';
import PageBottomSpacer from '@commercetools-local/core/components/page-bottom-spacer';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import CustomFieldDefinitionsConnector from '@commercetools-local/core/components/custom-field-definitions-connector';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { getRolByValue } from '../../../../utils/roles';
import EmployeesListCustomViewsConnector from '../employees-list-custom-views-connector';
import EmployeesViewLayout from '../employees-view-layout';
import EmployeesListConnector from '../employees-list-connector';
import { DEFAULT_PAGE_SIZES } from '../../../../constants/pagination';
import messages from './messages';
import { columnDefinitions as defaultColumnDefinitions } from './column-definitions';
import createFilterDefinitions from './filter-definitions';
import B2BApolloClientContext from '../../../../common/b2b-apollo-client-context';

const getColumns = memoize(visibleColumnsOfView => {
  const visibleColumns = visibleColumnsOfView
    ? visibleColumnsOfView
        .map(visibleColumn =>
          defaultColumnDefinitions.find(
            availableColumn => availableColumn.key === visibleColumn
          )
        )
        .filter(Boolean)
    : defaultColumnDefinitions;

  return {
    visible: visibleColumns,
    available: defaultColumnDefinitions,
  };
});

export class EmployeesList extends React.PureComponent {
  static displayName = 'EmployeesList';

  static propTypes = {
    projectKey: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,

    // withRouter
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,

    // withApplicationContext
    userId: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,

    // injectIntl
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
  };

  handleRowClick = (rowIndex, results) => {
    const employee = results[rowIndex];
    if (!employee) return;

    this.props.history.push(oneLineTrim`
      /${this.props.projectKey}
      /b2b-extension
      /employees
      /${employee.id}
    `);
  };

  handleUpdateColumns = columns =>
    this.setState({
      selectedColumns: columns.map(column => ({
        ...column,
        flexGrow: 1,
      })),
    });

  localizeStoreName = store =>
    injectTransformedLocalizedFields(store, [
      { from: 'nameAllLocales', to: 'name' },
    ]).name[this.props.language] ||
    this.props.intl.formatMessage(messages.storeKeyValueFallback, {
      key: store.key,
    });

  renderEmployeeRow = (
    results,
    { rowIndex, columnKey },
    customFieldDefinitions
  ) => {
    const value = results[rowIndex][columnKey];

    switch (columnKey) {
      case 'customerGroup':
        return value ? value.name : NO_VALUE_FALLBACK;
      case 'createdAt':
      case 'lastModifiedAt':
        return <FormattedDateTime type="datetime" value={value} />;
      case 'email':
      case 'firstName':
      case 'lastName':
      case 'externalId':
      case 'customerNumber':
        return value || NO_VALUE_FALLBACK;
      case 'stores':
        return (
          value.map(store => this.localizeStoreName(store)).join(', ') ||
          NO_VALUE_FALLBACK
        );
      case 'amountExpended':
        return formatMoney(value, this.props.intl);
      case 'roles':
        return (
          <div>
            {value.map(rol => (
              <div key={rol}>
                {getRolByValue(rol, this.props.intl.formatMessage).label}
              </div>
            ))}
          </div>
        );
      case 'companyName':
        return results[rowIndex].customerGroup?.name || NO_VALUE_FALLBACK;
      default: {
        // The key that identifies the custom field
        const customFieldDefinitionsOfColumnKey =
          customFieldDefinitions &&
          customFieldDefinitions.find(
            fieldDefinition => fieldDefinition.name === columnKey
          );

        // Because of using GraphQL, custom fields come now as `customFieldsRaw` which
        // is an object of name & value
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
  };

  render() {
    const filterDefinitions = createFilterDefinitions({
      intl: this.props.intl,
    });

    return (
      <B2BApolloClientContext.Consumer>
        {({ apolloClient }) => {
          return (
            <EmployeesListCustomViewsConnector.Consumer>
              {({ activeView, setActiveView }) => (
                <EmployeesListConnector
                  projectKey={this.props.projectKey}
                  searchQuery={activeView}
                  apolloClient={apolloClient}
                >
                  {({ employeesFetcher }) => (
                    <CustomFieldDefinitionsConnector
                      resources={['customer']}
                      isDisabled={false}
                    >
                      {({ customFieldDefinitionsFetcher }) => (
                        <EmployeesViewLayout
                          projectKey={this.props.projectKey}
                          total={getIn(employeesFetcher.employees, 'total', 0)}
                        >
                          <SearchViewControlledContainer
                            key={activeView.id}
                            pageSizes={DEFAULT_PAGE_SIZES}
                            page={activeView.page}
                            perPage={activeView.perPage}
                            areFiltersVisible={true}
                            filterDefinitions={filterDefinitions}
                            count={employeesFetcher.employees.count}
                            total={employeesFetcher.employees.total}
                            results={employeesFetcher.employees.results}
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
                                employeesFetcher.isLoading ||
                                customFieldDefinitionsFetcher.isLoading
                              )
                                return (
                                  <Spacings.Stack scale="m" alignItems="center">
                                    <LoadingSpinner />
                                  </Spacings.Stack>
                                );
                              const columns = getColumns(
                                activeView.visibleColumns
                              );

                              return (
                                <Spacings.Stack scale="m">
                                  <ColumnManager
                                    availableColumns={columns.available}
                                    selectedColumns={columns.visible}
                                    onUpdateColumns={nextVisibleColumns => {
                                      const keysOfVisibleColumns = nextVisibleColumns.map(
                                        visibleColumn => visibleColumn.key
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
                                      this.renderEmployeeRow(
                                        results,
                                        item,
                                        customFieldDefinitionsFetcher.customFieldDefinitions
                                      )
                                    }
                                    rowCount={rowCount}
                                    onRowClick={(_, rowIndex) =>
                                      this.handleRowClick(rowIndex, results)
                                    }
                                    onSortChange={setSorting}
                                    sortBy={sorting.key}
                                    sortDirection={sorting.order.toUpperCase()}
                                    measurementResetter={measurementResetter}
                                    shouldFillRemainingVerticalSpace={true}
                                    items={results}
                                  >
                                    {footer}
                                    <PageBottomSpacer />
                                  </Table>
                                </Spacings.Stack>
                              );
                            }}
                          </SearchViewControlledContainer>
                        </EmployeesViewLayout>
                      )}
                    </CustomFieldDefinitionsConnector>
                  )}
                </EmployeesListConnector>
              )}
            </EmployeesListCustomViewsConnector.Consumer>
          );
        }}
      </B2BApolloClientContext.Consumer>
    );
  }
}

export default flowRight(
  injectIntl,
  withApplicationContext(applicationContext => ({
    language: applicationContext.dataLocale,
    languages: applicationContext.project.languages,
    userId: applicationContext.user.id,
  })),
  withRouter
)(EmployeesList);
