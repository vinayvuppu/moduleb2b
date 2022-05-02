import React from 'react';
import { useHistory } from 'react-router-dom';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import EmployeeCreate from '../../../employees/components/employee-create';
import EmployeeDetailWrapper from '../employee-detail-wrapper';

const CompanyEmployeesCreate = () => {
  const { project } = useApplicationContext();
  const history = useHistory();

  const url = `/${project.key}/b2b-extension/my-company/employees`;

  return (
    <EmployeeDetailWrapper projectKey={project.key}>
      {({ company }) => (
        <EmployeeCreate
          projectKey={project.key}
          history={history}
          companyId={company.id}
          goToEmployeeDetails={employeeId =>
            history.push(`${url}/${employeeId}`)
          }
          goToEmployeesList={() => history.push(url)}
        />
      )}
    </EmployeeDetailWrapper>
  );
};

CompanyEmployeesCreate.displayName = 'CompanyEmployeesCreate';

export default CompanyEmployeesCreate;
