import React from 'react';
import {
  RestrictedByPermissions,
  useIsAuthorized,
} from '@commercetools-frontend/permissions';
import {
  Switch,
  Route,
  useParams,
  useRouteMatch,
  useHistory,
  useLocation,
  Redirect,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { joinPaths } from '@commercetools-frontend/url-utils';
import { PERMISSIONS, DATA_FENCES } from '../constants';
import EmployeeDetailsConnector from '../components/pages/employees/components/employee-details-connector';
import EmployeeDetails, {
  TAB_NAMES,
} from '../components/pages/employees/components/employee-details';
import EmployeeDetailsGeneralTab from '../components/pages/employees/components/employee-details-general-tab';
import EmployeeDetailsBudgetTab from '../components/pages/employees/components/employee-details-budget-tab';
import EmployeeDetailsAddressesTab from '../components/pages/employees/components/employee-details-addresses-tab';
import EmployeeDetailsAddressCreate from '../components/pages/employees/components/employee-details-address-create';
import EmployeeDetailsAddressDetails from '../components/pages/employees/components/employee-details-address-details';
import EmployeeDetailsOrdersTab from '../components/pages/employees/components/employee-details-orders-tab';
import PageUnauthorized from '../components/common/PageUnauthorized';
import B2BApolloClientContext from '../components/common/b2b-apollo-client-context';

const EditEmployeesFacadeRoute = ({ employeeListUrl }) => {
  const params = useParams();
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const canManageEmployees = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ManageEmployees],
  });

  return (
    <RestrictedByPermissions
      shouldMatchSomePermissions={true}
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
      <B2BApolloClientContext.Consumer>
        {({ apolloClient }) => {
          return (
            <EmployeeDetailsConnector
              employeeId={params.id}
              apolloClient={apolloClient}
            >
              {({
                employeeFetcher,
                employeeUpdater,
                employeePasswordReseter,
                employeeDeleter,
                employeeDefaultAddressUpdater,
              }) => (
                <EmployeeDetails
                  match={match}
                  location={location}
                  projectKey={params.projectKey}
                  employeeId={params.id}
                  employeeListUrl={location?.state?.origin || employeeListUrl}
                  history={history}
                  employeeFetcher={employeeFetcher}
                  employeeDeleter={employeeDeleter}
                >
                  <Switch>
                    <Route
                      path={`${match.path}/${TAB_NAMES.GENERAL}`}
                      render={generalTabRouterProps => (
                        <EmployeeDetailsGeneralTab
                          match={generalTabRouterProps.match}
                          history={generalTabRouterProps.history}
                          employeeFetcher={employeeFetcher}
                          employeeUpdater={employeeUpdater}
                          employeePasswordReseter={employeePasswordReseter}
                        />
                      )}
                    />
                    <Route
                      path={`${match.path}/${TAB_NAMES.BUDGET}`}
                      render={generalTabRouterProps => (
                        <EmployeeDetailsBudgetTab
                          match={generalTabRouterProps.match}
                          history={generalTabRouterProps.history}
                          employeeFetcher={employeeFetcher}
                          employeeUpdater={employeeUpdater}
                          employeePasswordReseter={employeePasswordReseter}
                        />
                      )}
                    />
                    <Route
                      path={`${match.path}/${TAB_NAMES.ADDRESSES}`}
                      render={addressRouterProps => (
                        <EmployeeDetailsAddressesTab
                          match={addressRouterProps.match}
                          history={addressRouterProps.history}
                          employeeFetcher={employeeFetcher}
                        >
                          <Switch>
                            {canManageEmployees ? (
                              <Route
                                path={`${addressRouterProps.match.path}/new`}
                                render={addressCreateRouterProps => (
                                  <EmployeeDetailsAddressCreate
                                    projectKey={
                                      addressCreateRouterProps.match.params
                                        .projectKey
                                    }
                                    employeeUpdater={employeeUpdater}
                                    employeeFetcher={employeeFetcher}
                                  />
                                )}
                              />
                            ) : (
                              <Redirect
                                from={`${addressRouterProps.match.path}/new`}
                                to={addressRouterProps.match.path}
                              />
                            )}
                            <Route
                              path={`${addressRouterProps.match.path}/:addressId`}
                              render={addressCreateRouterProps => (
                                <EmployeeDetailsAddressDetails
                                  projectKey={
                                    addressCreateRouterProps.match.params
                                      .projectKey
                                  }
                                  addressId={
                                    addressCreateRouterProps.match.params
                                      .addressId
                                  }
                                  employeeUpdater={employeeUpdater}
                                  employeeFetcher={employeeFetcher}
                                  employeeDefaultAddressUpdater={
                                    employeeDefaultAddressUpdater
                                  }
                                />
                              )}
                            />
                          </Switch>
                        </EmployeeDetailsAddressesTab>
                      )}
                    />
                    <Route
                      path={`${match.path}/${TAB_NAMES.ORDERS}`}
                      component={EmployeeDetailsOrdersTab}
                    />
                    <Redirect
                      from={match.path}
                      to={joinPaths(match.url, TAB_NAMES.GENERAL)}
                    />
                  </Switch>
                </EmployeeDetails>
              )}
            </EmployeeDetailsConnector>
          );
        }}
      </B2BApolloClientContext.Consumer>
    </RestrictedByPermissions>
  );
};

EditEmployeesFacadeRoute.propTypes = {
  employeeListUrl: PropTypes.string.isRequired,
};

EditEmployeesFacadeRoute.displayName = 'EditEmployeesFacadeRoute';

export default EditEmployeesFacadeRoute;
