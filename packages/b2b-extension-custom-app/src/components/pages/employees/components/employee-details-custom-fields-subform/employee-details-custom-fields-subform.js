import React from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash.flowright';
import { FormattedMessage } from 'react-intl';
import CustomAttributes from '@commercetools-local/core/components/type-definitions/custom-attributes';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import messages from './messages';

export class EmployeeDetailsCustomFieldsSubForm extends React.PureComponent {
  static displayName = 'EmployeeDetailsCustomFieldsSubForm';
  static propTypes = {
    typeDefinitions: PropTypes.array.isRequired,
    projectKey: PropTypes.string.isRequired,
    canManageEmployees: PropTypes.bool.isRequired,
    formik: PropTypes.shape({
      handleChange: PropTypes.func.isRequired,
      handleBlur: PropTypes.func.isRequired,
      setFieldTouched: PropTypes.func.isRequired,
      setFieldValue: PropTypes.func.isRequired,
      values: PropTypes.shape({
        custom: PropTypes.shape({
          type: PropTypes.shape({
            key: PropTypes.string,
            fieldDefinitions: PropTypes.array.isRequired,
          }).isRequired,
          fields: PropTypes.object.isRequired,
        }),
      }),
      errors: PropTypes.object,
      touched: PropTypes.object,
    }),

    // withApplicationContext
    language: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  state = {
    expandSettings: {},
  };

  handleUpdateExpandSettings = (nextExpansionState, definition) => {
    this.setState(prevState => ({
      expandSettings: {
        ...prevState.expandSettings,
        [definition.name]: nextExpansionState,
      },
    }));
  };

  handleChange = (definition, value) => {
    this.props.formik.setFieldTouched(`custom.fields[${definition}]`, true);
    this.props.formik.setFieldValue(`custom.fields[${definition}]`, value);
  };

  render() {
    if (
      this.props.typeDefinitions.length === 0 &&
      this.props.canManageEmployees
    )
      return <FormattedMessage {...messages.noTypes} />;

    // when no type selected
    if (!this.props.formik.values.custom.type.key)
      return <FormattedMessage {...messages.noCustomType} />;

    // when a type is selected but there are no field definitions
    if (
      this.props.formik.values.custom.type.key &&
      this.props.formik.values.custom.type.fieldDefinitions.length === 0
    )
      return <FormattedMessage {...messages.noCustomFields} />;

    return (
      <div data-testid="employee-details-custom-fields-panel">
        <CustomAttributes
          expandSettings={this.state.expandSettings}
          updateSettings={this.handleUpdateExpandSettings}
          languages={this.props.languages}
          currencies={this.props.currencies}
          language={this.props.language}
          fieldDefinitions={
            this.props.formik.values.custom.type.fieldDefinitions
          }
          fields={this.props.formik.values.custom.fields}
          handleChange={this.handleChange}
          isDisabled={!this.props.canManageEmployees}
        />
      </div>
    );
  }
}

export default flowRight(
  withApplicationContext(applicationContext => ({
    language: applicationContext.user.locale,
    languages: applicationContext.project.languages,
    currencies: applicationContext.project.currencies,
  }))
)(EmployeeDetailsCustomFieldsSubForm);
