import React from 'react';
import PropTypes from 'prop-types';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import EmployeesList from '../employees-list';

const CompanyDetailsEmployeesTab = props => (
  <EmployeesList
    company={props.companyFetcher.company}
    projectKey={props.match.params.projectKey}
    goToEmployeeDetails={employeeId =>
      props.history.push(
        oneLineTrim`
        /${props.match.params.projectKey}
        /b2b-extension
        /employees
        /${employeeId}
        /general
      `,
        {
          origin: oneLineTrim`
        /${props.match.params.projectKey}
        /b2b-extension
        /companies
        /${props.companyFetcher.company.id}
      `,
        }
      )
    }
  />
);
CompanyDetailsEmployeesTab.displayName = 'CompanyDetailsEmployeesTab';
CompanyDetailsEmployeesTab.propTypes = {
  companyFetcher: PropTypes.shape({
    company: PropTypes.object,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      projectKey: PropTypes.string.isRequired,
    }).isRequired,
  }),
};
export default CompanyDetailsEmployeesTab;
