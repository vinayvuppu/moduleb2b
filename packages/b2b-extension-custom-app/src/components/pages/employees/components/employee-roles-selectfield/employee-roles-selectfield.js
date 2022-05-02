import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { SelectField, LoadingSpinner } from '@commercetools-frontend/ui-kit';
import CustomFieldTypeDefinitionsConnector from '@commercetools-local/core/components/custom-field-type-definitions-connector';
import messages from './messages';

const EmployeeRolesSelectField = props => {
  const { formatMessage } = useIntl();
  const { projectKey } = useApplicationContext(applicationContext => ({
    projectKey: applicationContext.project.key,
  }));
  const handleChange = event => {
    props.onChange(event);
  };

  return (
    <CustomFieldTypeDefinitionsConnector
      resources={['customer']}
      typeKey="employee-type"
      projectKey={projectKey}
      isDisabled={false}
    >
      {({ customFieldTypeDefinitionsFetcher }) => {
        if (customFieldTypeDefinitionsFetcher.isLoading)
          return <LoadingSpinner />;

        let options = [];
        if (
          customFieldTypeDefinitionsFetcher.customFieldTypeDefinitions.results
            .length
        ) {
          const fieldRoles = customFieldTypeDefinitionsFetcher.customFieldTypeDefinitions.results[0].fieldDefinitions.find(
            field => field.name === 'roles'
          );

          options = fieldRoles.type.elementType.values.map(rol => ({
            value: rol.key,
            label: rol.label,
          }));
        }
        return (
          <SelectField
            name="roles"
            data-testid="roles"
            id="roles"
            isMulti={true}
            title={formatMessage(messages.labelRol)}
            value={props.value}
            options={options}
            onChange={handleChange}
            isRequired={props.isRequired}
            errors={props.errors}
            touched={props.touched}
            isDisabled={!props.canManageEmployees}
          />
        );
      }}
    </CustomFieldTypeDefinitionsConnector>
  );
};

EmployeeRolesSelectField.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  canManageEmployees: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  touched: PropTypes.arrayOf(PropTypes.bool),
  errors: PropTypes.object,
};
EmployeeRolesSelectField.displayName = 'EmployeeRolesSelectField';
EmployeeRolesSelectField.defaultProps = {
  value: [],
};

export default EmployeeRolesSelectField;
