import PropTypes from 'prop-types';
import React from 'react';
import { LoadingSpinner, Spacings } from '@commercetools-frontend/ui-kit';

import EmployeeDetailConnector from '../employee-detail-connector';
import CompanyDetailsConnector from '../../../companies/components/company-details-connector';
import UserNotAssociatedCompany from '../../../../common/UserNotAssociatedCompany';
import B2BApolloClientContext from '../../../../common/b2b-apollo-client-context';

export class EmployeeDetailWrapper extends React.PureComponent {
  static displayName = 'EmployeeDetailWrapper';

  static propTypes = {
    projectKey: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
  };

  render() {
    return (
      <B2BApolloClientContext.Consumer>
        {({ apolloClient }) => {
          return (
            <EmployeeDetailConnector
              projectKey={this.props.projectKey}
              apolloClient={apolloClient}
            >
              {({ employeeFetcher }) => {
                if (employeeFetcher.isLoading) {
                  return (
                    <Spacings.Stack scale="m" alignItems="center">
                      <LoadingSpinner />
                    </Spacings.Stack>
                  );
                }
                if (
                  !employeeFetcher.employee ||
                  !employeeFetcher.employee.customerGroup
                ) {
                  return <UserNotAssociatedCompany />;
                }
                const { customerGroup, ...rest } = employeeFetcher.employee;

                return (
                  <CompanyDetailsConnector
                    projectKey={this.props.projectKey}
                    companyId={customerGroup.key}
                  >
                    {({ companyFetcher }) => {
                      if (companyFetcher.isLoading) {
                        return (
                          <Spacings.Stack scale="m" alignItems="center">
                            <LoadingSpinner />
                          </Spacings.Stack>
                        );
                      }
                      return this.props.children({
                        company: companyFetcher.company,
                        employee: rest,
                      });
                    }}
                  </CompanyDetailsConnector>
                );
              }}
            </EmployeeDetailConnector>
          );
        }}
      </B2BApolloClientContext.Consumer>
    );
  }
}

export default EmployeeDetailWrapper;
