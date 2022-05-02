import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import { joinPaths } from '@commercetools-frontend/url-utils';
import oneLineTrim from 'common-tags/lib/oneLineTrim';

import {
  useIsAuthorized,
  RestrictedByPermissions,
} from '@commercetools-frontend/permissions';
import { PageNotFound } from '@commercetools-frontend/application-components';

// Connectors
import { useAreMcSettingsDisabled } from '@commercetools-local/hooks';

import CompanyDetailsConnector from './components/pages/companies/components/company-details-connector';
import EmployeesListCustomViewsConnector from './components/pages/employees/components/employees-list-custom-views-connector';
import CompanyOrdersListCustomViewsConnector from './components/pages/my-company/components/company-orders-list-custom-views-connector';

import PageUnauthorized from './components/common/PageUnauthorized';

// B2B-ADMIN-employees
import EmployeeCreate from './components/pages/employees/components/employee-create';

import EmployeesList from './components/pages/employees/components/employees-list';

// B2B-ADMIN-companies
import CompanyList from './components/pages/companies/components/companies-list';
import CompanyDetails, {
  TAB_NAMES as COMPANY_TAB_NAMES,
} from './components/pages/companies/components/company-details';
import CompanyDetailsGeneralTab from './components/pages/companies/components/company-details-general-tab';
import CompanyDetailsEmployeesTab from './components/pages/companies/components/company-details-employees-tab';
import CompanyDetailsRulesTab from './components/pages/companies/components/company-details-rules-tab';
import CompanyCreate from './components/pages/companies/components/company-create';

// B2B-Company
import CompanyEmployeesList from './components/pages/my-company/components/company-employees-list';
import CompanyOrdersList from './components/pages/my-company/components/company-orders-list';
import CompanyPendingApprovarOrdersList from './components/pages/my-company/components/company-pending-approval-orders-list';
import CompanyEmployeesCreate from './components/pages/my-company/components/company-employees-create';

import OrderCreateConnector from './components/pages/my-company/components/order-create-connector';
import OrderCreate from './components/pages/my-company/components/order-create';
import OrderDetails from './components/pages/my-company/components/order-details';

import { PERMISSIONS, DATA_FENCES } from './constants';

import { EditEmployeesFacadeRoute } from './routeFacaces';
import B2BApolloClientContext from './components/common/b2b-apollo-client-context';
import EmployeeDetailWrapper from './components/pages/my-company/components/employee-detail-wrapper';
import AdminQuotesList from './components/pages/quotes/components/admin-quotes-list';
import CompanyQuotesList from './components/pages/quotes/components/company-quotes-list';
import QuoteDetails from './components/pages/quotes/components/quote-details';
import QuoteDetailsConnector from './components/pages/quotes/components/quote-details-connector';
import QuoteCreateConnector from './components/pages/quotes/components/quote-create-connector';
import QuoteDetailsGeneralTab from './components/pages/quotes/components/quote-details-general-tab';
import QuoteCreate from './components/pages/quotes/components/quote-create';
import QuoteDetailsCommentsTab from './components/pages/quotes/components/quote-details-comments-tab';
import { QUOTE_DETAILS_TAB_NAMES } from './components/pages/quotes/constants';

const ApplicationRoutes = ({ match }) => {
  const canView = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ViewCompanies, PERMISSIONS.ViewEmployees],
    shouldMatchSomePermissions: true,
  });
  const areMcSettingsDisabled = useAreMcSettingsDisabled();

  if (!canView) {
    return <PageUnauthorized />;
  }
  return (
    <B2BApolloClientContext.Provider>
      <EmployeesListCustomViewsConnector.Provider
        projectKey={match.params.projectKey}
        areSavedEmployeesListViewsEnabled={!areMcSettingsDisabled}
      >
        <CompanyOrdersListCustomViewsConnector.Provider
          projectKey={match.params.projectKey}
          areSavedOrdersListViewsEnabled={!areMcSettingsDisabled}
        >
          <Switch>
            <Route
              path={`${match.path}/employees/new`}
              render={routerProps => (
                <RestrictedByPermissions
                  permissions={[PERMISSIONS.ManageEmployees]}
                  dataFences={[DATA_FENCES.store.ManageEmployees]}
                  unauthorizedComponent={PageUnauthorized}
                  selectDataFenceData={({ actualDataFenceValues }) =>
                    actualDataFenceValues || []
                  }
                >
                  <EmployeeCreate
                    projectKey={routerProps.match.params.projectKey}
                    history={routerProps.history}
                    goToEmployeeDetails={employeeId =>
                      routerProps.history.push(oneLineTrim`
                          /${routerProps.match.params.projectKey}
                          /b2b-extension
                          /employees
                          /${employeeId}
                        `)
                    }
                    goToEmployeesList={() =>
                      routerProps.history.push(oneLineTrim`
                          /${routerProps.match.params.projectKey}
                          /b2b-extension
                          /employees
                        `)
                    }
                  />
                </RestrictedByPermissions>
              )}
            />
            <Route
              path={`${match.path}/companies`}
              render={companiesRouterProps => (
                <Switch>
                  <Route
                    exact={true}
                    path={`${companiesRouterProps.match.path}/new`}
                  >
                    <RestrictedByPermissions
                      permissions={[PERMISSIONS.ManageCompanies]}
                      unauthorizedComponent={PageUnauthorized}
                    >
                      <CompanyCreate />
                    </RestrictedByPermissions>
                  </Route>
                  <Route
                    path={`${companiesRouterProps.match.path}/:id/${COMPANY_TAB_NAMES.EMPLOYEES}/new`}
                    render={routerProps => (
                      <EmployeeCreate
                        projectKey={routerProps.match.params.projectKey}
                        history={routerProps.history}
                        companyId={routerProps.match.params.id}
                        goToEmployeeDetails={employeeId =>
                          routerProps.history.push(oneLineTrim`
                          /${routerProps.match.params.projectKey}
                          /b2b-extension
                          /employees
                          /${employeeId}
                        `)
                        }
                        goToEmployeesList={() =>
                          routerProps.history.push(oneLineTrim`
                          /${routerProps.match.params.projectKey}
                          /b2b-extension
                          /companies
                          /${routerProps.match.params.id}
                          /${COMPANY_TAB_NAMES.GENERAL}
                        `)
                        }
                      />
                    )}
                  />
                  <Route
                    path={`${companiesRouterProps.match.path}/:id`}
                    render={routerProps => (
                      <RestrictedByPermissions
                        permissions={[PERMISSIONS.ViewCompanies]}
                        unauthorizedComponent={PageUnauthorized}
                      >
                        <CompanyDetailsConnector
                          projectKey={routerProps.match.params.projectKey}
                          companyId={routerProps.match.params.id}
                        >
                          {({
                            companyFetcher,
                            companyUpdater,
                            companyDeleter,
                            companyDefaultBillingUpdater,
                            companyDefaultShippingUpdater,
                          }) => {
                            return (
                              <CompanyDetails
                                projectKey={routerProps.match.params.projectKey}
                                companyId={routerProps.match.params.id}
                                history={routerProps.history}
                                companyFetcher={companyFetcher}
                                companyUpdater={companyUpdater}
                                companyDeleter={companyDeleter}
                              >
                                <Switch>
                                  <Route
                                    path={`${routerProps.match.path}/${COMPANY_TAB_NAMES.GENERAL}`}
                                    render={generalTabRouterProps => (
                                      <CompanyDetailsGeneralTab
                                        match={generalTabRouterProps.match}
                                        history={generalTabRouterProps.history}
                                        companyFetcher={companyFetcher}
                                        companyUpdater={companyUpdater}
                                        companyDefaultBillingUpdater={
                                          companyDefaultBillingUpdater
                                        }
                                        companyDefaultShippingUpdater={
                                          companyDefaultShippingUpdater
                                        }
                                      />
                                    )}
                                  />
                                  <Route
                                    path={`${routerProps.match.path}/${COMPANY_TAB_NAMES.RULES}`}
                                    render={rulesTabRouterProps => (
                                      <CompanyDetailsRulesTab
                                        match={rulesTabRouterProps.match}
                                        history={rulesTabRouterProps.history}
                                        companyFetcher={companyFetcher}
                                        companyUpdater={companyUpdater}
                                      />
                                    )}
                                  />
                                  <Route
                                    path={`${routerProps.match.path}/${COMPANY_TAB_NAMES.EMPLOYEES}`}
                                    render={generalTabRouterProps => (
                                      <CompanyDetailsEmployeesTab
                                        match={generalTabRouterProps.match}
                                        history={generalTabRouterProps.history}
                                        companyFetcher={companyFetcher}
                                        companyUpdater={companyUpdater}
                                      />
                                    )}
                                  />
                                  <Redirect
                                    from={routerProps.match.path}
                                    to={joinPaths(
                                      routerProps.match.url,
                                      COMPANY_TAB_NAMES.GENERAL
                                    )}
                                  />
                                </Switch>
                              </CompanyDetails>
                            );
                          }}
                        </CompanyDetailsConnector>
                      </RestrictedByPermissions>
                    )}
                  />
                  <RestrictedByPermissions
                    permissions={[PERMISSIONS.ViewCompanies]}
                    unauthorizedComponent={PageUnauthorized}
                  >
                    <CompanyList />
                  </RestrictedByPermissions>
                </Switch>
              )}
            />
            <Route path={`${match.path}/employees/:id`}>
              <EditEmployeesFacadeRoute
                employeeListUrl={`${match.url}/employees`}
              />
            </Route>

            <Route
              path={`${match.path}/employees`}
              render={routerProps => (
                <RestrictedByPermissions
                  permissions={[PERMISSIONS.ViewEmployees]}
                  dataFences={[
                    DATA_FENCES.store.ViewEmployees,
                    DATA_FENCES.store.ManageEmployees,
                  ]}
                  selectDataFenceData={({ actualDataFenceValues }) =>
                    actualDataFenceValues || []
                  }
                  unauthorizedComponent={PageUnauthorized}
                >
                  <EmployeesList
                    match={routerProps.match}
                    projectKey={routerProps.match.params.projectKey}
                    history={routerProps.history}
                    location={routerProps.location}
                  />
                </RestrictedByPermissions>
              )}
            />

            <Route
              path={`${match.path}/quotes`}
              render={quotesRouterProps => (
                <Switch>
                  <Route
                    path={`${quotesRouterProps.match.path}/:id`}
                    render={routerProps => (
                      <RestrictedByPermissions
                        permissions={[PERMISSIONS.ViewOrders]}
                        unauthorizedComponent={PageUnauthorized}
                      >
                        <QuoteDetailsConnector
                          projectKey={routerProps.match.params.projectKey}
                          quoteId={routerProps.match.params.id}
                        >
                          {({
                            quote,
                            isLoading,
                            updateQuoteState,
                            updateQuoteItems,
                            addAmountDiscount,
                            addPercentageDiscount,
                            addComment,
                          }) => {
                            return (
                              <QuoteDetails
                                quoteId={routerProps.match.params.id}
                                quote={quote}
                                updateQuoteState={updateQuoteState}
                                projectKey={routerProps.match.params.projectKey}
                                isLoading={isLoading}
                                goToListRoute={oneLineTrim`
                                              /${routerProps.match.params.projectKey}
                                              /b2b-extension
                                              /quotes
                                            `}
                              >
                                {({ hasCompany, employeeEmail }) => (
                                  <Switch>
                                    <Route
                                      path={`${routerProps.match.path}/${QUOTE_DETAILS_TAB_NAMES.GENERAL}`}
                                      render={() => (
                                        <QuoteDetailsGeneralTab
                                          isLoading={isLoading}
                                          quote={quote}
                                          updateQuoteItems={updateQuoteItems}
                                          addAmountDiscount={addAmountDiscount}
                                          addPercentageDiscount={
                                            addPercentageDiscount
                                          }
                                          projectKey={
                                            routerProps.match.params.projectKey
                                          }
                                          hasCompany={hasCompany}
                                        />
                                      )}
                                    />
                                    <Route
                                      path={`${routerProps.match.path}/${QUOTE_DETAILS_TAB_NAMES.COMMENTS}`}
                                    >
                                      <QuoteDetailsCommentsTab
                                        quote={quote}
                                        addComment={addComment}
                                        employeeEmail={employeeEmail}
                                      />
                                    </Route>
                                    <Redirect
                                      from={routerProps.match.path}
                                      to={joinPaths(
                                        routerProps.match.url,
                                        'general'
                                      )}
                                    />
                                  </Switch>
                                )}
                              </QuoteDetails>
                            );
                          }}
                        </QuoteDetailsConnector>
                      </RestrictedByPermissions>
                    )}
                  />
                  <RestrictedByPermissions
                    permissions={[
                      PERMISSIONS.ManageCompanies,
                      PERMISSIONS.ManageOrders,
                    ]}
                    unauthorizedComponent={PageUnauthorized}
                  >
                    <AdminQuotesList />
                  </RestrictedByPermissions>
                </Switch>
              )}
            />

            <Route
              path={`${match.path}/my-company`}
              render={myCompanyRouterProps => (
                <RestrictedByPermissions
                  permissions={[
                    PERMISSIONS.ViewEmployees,
                    PERMISSIONS.ViewCompanies,
                  ]}
                  dataFences={[
                    DATA_FENCES.store.ViewEmployees,
                    DATA_FENCES.store.ManageEmployees,
                  ]}
                  selectDataFenceData={({ actualDataFenceValues }) =>
                    actualDataFenceValues || []
                  }
                  unauthorizedComponent={PageUnauthorized}
                >
                  <Switch>
                    <Route
                      exact={true}
                      path={`${myCompanyRouterProps.match.path}/details`}
                      render={routerProps => (
                        <EmployeeDetailWrapper
                          projectKey={routerProps.match.params.projectKey}
                        >
                          {({ company }) => (
                            <Redirect
                              from={`${match.path}`}
                              to={`${match.url}/companies/${company.id}`}
                              exact
                            />
                          )}
                        </EmployeeDetailWrapper>
                      )}
                    />
                    <Route
                      exact={true}
                      path={`${myCompanyRouterProps.match.path}/employees`}
                      render={routerProps => (
                        <RestrictedByPermissions
                          permissions={[
                            PERMISSIONS.ViewCompanies,
                            PERMISSIONS.ViewEmployees,
                          ]}
                          unauthorizedComponent={PageUnauthorized}
                        >
                          <CompanyEmployeesList
                            match={routerProps.match}
                            projectKey={routerProps.match.params.projectKey}
                            history={routerProps.history}
                            location={routerProps.location}
                          />
                        </RestrictedByPermissions>
                      )}
                    />
                    <Route
                      path={`${myCompanyRouterProps.match.path}/employees/new`}
                    >
                      <RestrictedByPermissions
                        permissions={[PERMISSIONS.ManageEmployees]}
                        dataFences={[DATA_FENCES.store.ManageEmployees]}
                        unauthorizedComponent={PageUnauthorized}
                        selectDataFenceData={({ actualDataFenceValues }) =>
                          actualDataFenceValues || []
                        }
                      >
                        <CompanyEmployeesCreate />
                      </RestrictedByPermissions>
                    </Route>
                    <Route
                      path={`${myCompanyRouterProps.match.path}/employees/:id`}
                    >
                      <EditEmployeesFacadeRoute
                        employeeListUrl={`${myCompanyRouterProps.match.url}/employees`}
                      />
                    </Route>

                    <Route
                      path={`${myCompanyRouterProps.match.path}/orders/new`}
                      render={createOrderRouteProps => (
                        <RestrictedByPermissions
                          permissions={[PERMISSIONS.ManageOrders]}
                          unauthorizedComponent={PageUnauthorized}
                        >
                          <OrderCreateConnector.Provider>
                            <EmployeeDetailWrapper
                              projectKey={
                                createOrderRouteProps.match.params.projectKey
                              }
                            >
                              {({ company, employee }) => (
                                <OrderCreate
                                  match={createOrderRouteProps.match}
                                  location={createOrderRouteProps.location}
                                  history={createOrderRouteProps.history}
                                  company={company}
                                  employee={employee}
                                />
                              )}
                            </EmployeeDetailWrapper>
                          </OrderCreateConnector.Provider>
                        </RestrictedByPermissions>
                      )}
                    />
                    <Route
                      exact={true}
                      path={`${myCompanyRouterProps.match.path}/orders`}
                      render={routerProps => (
                        <RestrictedByPermissions
                          permissions={[PERMISSIONS.ViewOrders]}
                          unauthorizedComponent={PageUnauthorized}
                        >
                          <CompanyOrdersList
                            location={routerProps.location}
                            projectKey={routerProps.match.params.projectKey}
                          />
                        </RestrictedByPermissions>
                      )}
                    />
                    <Route
                      exact
                      path={`${myCompanyRouterProps.match.path}/orders/:orderId`}
                    >
                      <RestrictedByPermissions
                        permissions={[PERMISSIONS.ViewOrders]}
                        unauthorizedComponent={PageUnauthorized}
                      >
                        <OrderDetails
                          backUrl={`${myCompanyRouterProps.match.url}/orders`}
                        />
                      </RestrictedByPermissions>
                    </Route>
                    <Route
                      path={`${myCompanyRouterProps.match.path}/quotes`}
                      render={quotesRouterProps => (
                        <Switch>
                          <Route
                            path={`${quotesRouterProps.match.path}/new`}
                            strict={true}
                            render={routerProps => (
                              <RestrictedByPermissions
                                permissions={[PERMISSIONS.ViewOrders]}
                                unauthorizedComponent={PageUnauthorized}
                              >
                                <QuoteCreateConnector
                                  projectKey={
                                    routerProps.match.params.projectKey
                                  }
                                >
                                  {({
                                    createQuote,
                                    addLineItem,
                                    removeLineItem,
                                    changeLineItemQuantity,
                                    quote,
                                  }) => {
                                    return (
                                      <EmployeeDetailWrapper
                                        projectKey={
                                          routerProps.match.params.projectKey
                                        }
                                      >
                                        {({ company, employee }) => (
                                          <QuoteCreate
                                            createQuote={createQuote}
                                            quote={quote}
                                            addLineItem={addLineItem}
                                            removeLineItem={removeLineItem}
                                            changeLineItemQuantity={
                                              changeLineItemQuantity
                                            }
                                            employee={employee}
                                            company={company}
                                            projectKey={
                                              routerProps.match.params
                                                .projectKey
                                            }
                                          />
                                        )}
                                      </EmployeeDetailWrapper>
                                    );
                                  }}
                                </QuoteCreateConnector>
                              </RestrictedByPermissions>
                            )}
                          />
                          <Route
                            path={`${quotesRouterProps.match.path}/:id`}
                            render={routerProps => (
                              <RestrictedByPermissions
                                permissions={[PERMISSIONS.ViewOrders]}
                                unauthorizedComponent={PageUnauthorized}
                              >
                                <QuoteDetailsConnector
                                  projectKey={
                                    routerProps.match.params.projectKey
                                  }
                                  quoteId={routerProps.match.params.id}
                                >
                                  {({
                                    quote,
                                    isLoading,
                                    updateQuoteState,
                                    updateQuoteItems,
                                    addAmountDiscount,
                                    addPercentageDiscount,
                                    addComment,
                                  }) => {
                                    return (
                                      <QuoteDetails
                                        quoteId={routerProps.match.params.id}
                                        quote={quote}
                                        updateQuoteState={updateQuoteState}
                                        projectKey={
                                          routerProps.match.params.projectKey
                                        }
                                        isLoading={isLoading}
                                        goToListRoute={oneLineTrim`
                                              /${routerProps.match.params.projectKey}
                                              /b2b-extension
                                              /my-company
                                              /quotes
                                            `}
                                      >
                                        {({ hasCompany, employeeEmail }) => (
                                          <Switch>
                                            <Route
                                              path={`${routerProps.match.path}/${QUOTE_DETAILS_TAB_NAMES.GENERAL}`}
                                              render={() => (
                                                <QuoteDetailsGeneralTab
                                                  isLoading={isLoading}
                                                  addAmountDiscount={
                                                    addAmountDiscount
                                                  }
                                                  addPercentageDiscount={
                                                    addPercentageDiscount
                                                  }
                                                  updateQuoteItems={
                                                    updateQuoteItems
                                                  }
                                                  quote={quote}
                                                  projectKey={
                                                    routerProps.match.params
                                                      .projectKey
                                                  }
                                                  hasCompany={hasCompany}
                                                />
                                              )}
                                            />
                                            <Route
                                              path={`${routerProps.match.path}/${QUOTE_DETAILS_TAB_NAMES.COMMENTS}`}
                                            >
                                              <QuoteDetailsCommentsTab
                                                quote={quote}
                                                addComment={addComment}
                                                employeeEmail={employeeEmail}
                                              />
                                            </Route>
                                            <Redirect
                                              from={routerProps.match.path}
                                              to={joinPaths(
                                                routerProps.match.url,
                                                'general'
                                              )}
                                            />
                                          </Switch>
                                        )}
                                      </QuoteDetails>
                                    );
                                  }}
                                </QuoteDetailsConnector>
                              </RestrictedByPermissions>
                            )}
                          />
                          <RestrictedByPermissions
                            permissions={[PERMISSIONS.ViewOrders]}
                            unauthorizedComponent={PageUnauthorized}
                          >
                            <CompanyQuotesList
                              projectKey={
                                quotesRouterProps.match.params.projectKey
                              }
                            />
                          </RestrictedByPermissions>
                        </Switch>
                      )}
                    />
                    <Route
                      exact={true}
                      path={`${myCompanyRouterProps.match.path}/orders-approval`}
                      render={routerProps => (
                        <RestrictedByPermissions
                          permissions={[PERMISSIONS.ManageOrders]}
                          unauthorizedComponent={PageUnauthorized}
                        >
                          <OrderCreateConnector.Provider>
                            <CompanyPendingApprovarOrdersList
                              location={routerProps.location}
                              projectKey={routerProps.match.params.projectKey}
                            />
                          </OrderCreateConnector.Provider>
                        </RestrictedByPermissions>
                      )}
                    />
                    <Route
                      exact
                      path={`${myCompanyRouterProps.match.path}/orders-approval/:orderId`}
                    >
                      <RestrictedByPermissions
                        permissions={[PERMISSIONS.ViewOrders]}
                        unauthorizedComponent={PageUnauthorized}
                      >
                        <OrderDetails
                          backUrl={`${myCompanyRouterProps.match.url}/orders-approval`}
                        />
                      </RestrictedByPermissions>
                    </Route>
                    <Redirect
                      from={`${myCompanyRouterProps.match.path}`}
                      to={`${myCompanyRouterProps.match.path}/employees`}
                      exact
                    />
                    <Route render={PageNotFound} />
                  </Switch>
                </RestrictedByPermissions>
              )}
            />
            <Redirect
              from={`${match.path}`}
              to={`${match.path}/my-company/details`}
              exact
            />
            <Route render={PageNotFound} />
          </Switch>
        </CompanyOrdersListCustomViewsConnector.Provider>
      </EmployeesListCustomViewsConnector.Provider>
    </B2BApolloClientContext.Provider>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';
ApplicationRoutes.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
    url: PropTypes.string,
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ApplicationRoutes;
