import React from 'react';
import PropTypes from 'prop-types';
import { Formik, getIn } from 'formik';
import { connect } from 'react-redux';
import flowRight from 'lodash.flowright';
import memoize from 'memoize-one';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  LoadingSpinner,
  Spacings,
  CollapsiblePanel,
  SelectInput,
  Text,
} from '@commercetools-frontend/ui-kit';
import { DOMAINS } from '@commercetools-frontend/constants';
import * as globalActions from '@commercetools-frontend/actions-global';
import { injectAuthorized } from '@commercetools-frontend/permissions';
import ReadOnlyMessage from '@commercetools-local/core/components/read-only-message';
import TabContentLayout from '@commercetools-local/core/components/tab-content-layout';
import MetaDates from '@commercetools-local/core/components/meta-dates';
import localize from '@commercetools-local/utils/localize';
import WarningSaveToolbar from '@commercetools-local/core/components/warning-save-toolbar';
import CustomFieldTypeDefinitionsConnector from '@commercetools-local/core/components/custom-field-type-definitions-connector';
import EmployeeDetailsCustomFieldsSubForm from '../employee-details-custom-fields-subform';
import messages from './messages';
import { PERMISSIONS, DATA_FENCES } from '../../../../../constants';
import createSelectEmployeeDataFenceData from '../../../../utils/create-select-employee-data-fence-data';
import styles from './employee-details-custom-fields-form.mod.css';
import {
  docToFormValues,
  formValuesToDoc,
  transformApiErrors,
} from './conversions';

const mapTypeDefinitionsToOptions = (typeDefinitions, language, languages) =>
  typeDefinitions.map(typeDefinition => ({
    value: typeDefinition.type.key,
    label: localize({
      obj: typeDefinition.type,
      key: 'name',
      language,
      fallbackOrder: languages,
    }),
  }));

const createTypeDefinitionsOptions = memoize(typeDefinitions =>
  typeDefinitions.map(CustomFieldTypeDefinitionsConnector.graphQlDocToForm)
);

export const CustomFieldsErrorTextNotification = props => (
  <Spacings.Stack scale="s">
    <FormattedMessage {...messages.customFieldsError} />
    <FormattedMessage {...messages.customFieldsErrorSubtitle} />
    <Spacings.Stack scale="xs">
      {props.formErrors.map(formError => (
        <Text.Detail key={formError.field} isBold>
          {formError.field}
        </Text.Detail>
      ))}
    </Spacings.Stack>
  </Spacings.Stack>
);

CustomFieldsErrorTextNotification.displayName =
  'CustomFieldsErrorTextNotification';
CustomFieldsErrorTextNotification.propTypes = {
  formErrors: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export class EmployeeDetailsCustomFieldsForm extends React.PureComponent {
  static displayName = 'EmployeeDetailsCustomFieldsForm';
  static propTypes = {
    projectKey: PropTypes.string.isRequired,
    employeeFetcher: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      employee: PropTypes.shape({
        createdAt: PropTypes.string.isRequired,
        lastModifiedAt: PropTypes.string.isRequired,
      }),
    }).isRequired,
    employeeUpdater: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      execute: PropTypes.func.isRequired,
    }).isRequired,

    // Actions
    showNotification: PropTypes.func.isRequired,
    onActionError: PropTypes.func.isRequired,

    // HoC
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
    canManageEmployees: PropTypes.bool.isRequired,
    language: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  handleSubmit = (employeeDraft, formikBag) =>
    this.props.employeeUpdater.execute(formValuesToDoc(employeeDraft)).then(
      () => {
        formikBag.setSubmitting(false);
        this.props.showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: this.props.intl.formatMessage(messages.customFieldsUpdated),
        });
      },
      errors => {
        formikBag.setSubmitting(false);
        const partitionedErrors = transformApiErrors(errors);
        if (partitionedErrors.formErrors.length > 0) {
          this.props.showNotification({
            kind: 'error',
            domain: DOMAINS.SIDE,
            text: (
              <CustomFieldsErrorTextNotification
                formErrors={partitionedErrors.formErrors}
              />
            ),
          });
        } else
          this.props.onActionError(
            partitionedErrors.unmappedApiErrors,
            'EmployeeDetailsCustomFieldsForm/updateCustomerCustomFields'
          );
      }
    );

  handleTypeDefinitionChange = (event, typeDefinitions, setFieldValue) => {
    const selectedTypeDefiniton = typeDefinitions.find(
      typeDefinition => typeDefinition.type.key === event.target.value
    );

    if (selectedTypeDefiniton) setFieldValue('custom', selectedTypeDefiniton);
    else
      setFieldValue(
        'custom',
        CustomFieldTypeDefinitionsConnector.createEmptyCustomFields()
      );
  };

  render() {
    return (
      <TabContentLayout
        header={
          <MetaDates
            created={this.props.employeeFetcher.employee?.createdAt}
            modified={this.props.employeeFetcher.employee?.lastModifiedAt}
          />
        }
        description={!this.props.canManageEmployees && <ReadOnlyMessage />}
        data-track-component="CustomFields"
      >
        {this.props.employeeFetcher.isLoading ? (
          <LoadingSpinner />
        ) : (
          <Formik
            initialValues={docToFormValues(this.props.employeeFetcher.employee)}
            onSubmit={this.handleSubmit}
            enableReinitialize={true}
            render={formikProps => (
              <CustomFieldTypeDefinitionsConnector
                resources={['customer']}
                projectKey={this.props.projectKey}
                isDisabled={!this.props.canManageEmployees}
              >
                {({ customFieldTypeDefinitionsFetcher }) => {
                  if (customFieldTypeDefinitionsFetcher.isLoading)
                    return <LoadingSpinner />;

                  const typeDefinitions = createTypeDefinitionsOptions(
                    getIn(
                      customFieldTypeDefinitionsFetcher,
                      'customFieldTypeDefinitions.results',
                      []
                    )
                  );
                  return (
                    <CollapsiblePanel
                      header={
                        <CollapsiblePanel.Header>
                          <FormattedMessage {...messages.typesTitle} />
                        </CollapsiblePanel.Header>
                      }
                      headerControls={
                        typeDefinitions.length > 0 && (
                          <div className={styles['select-input-wrapper']}>
                            <SelectInput
                              isDisabled={!this.props.canManageEmployees}
                              data-testid="employee-details-custom-fields-type-select"
                              id="employee-details-custom-fields-type-select"
                              name="custom.type.key"
                              options={mapTypeDefinitionsToOptions(
                                typeDefinitions,
                                this.props.language,
                                this.props.languages
                              )}
                              isClearable={true}
                              value={formikProps.values.custom.type.key}
                              onBlur={formikProps.handleBlur}
                              onChange={event =>
                                this.handleTypeDefinitionChange(
                                  event,
                                  typeDefinitions,
                                  formikProps.setFieldValue
                                )
                              }
                              placeholder={this.props.intl.formatMessage(
                                messages.typesPlaceholder
                              )}
                            />
                          </div>
                        )
                      }
                      headerControlsAlignment="left"
                    >
                      <EmployeeDetailsCustomFieldsSubForm
                        canManageEmployees={this.props.canManageEmployees}
                        formik={formikProps}
                        typeDefinitions={typeDefinitions}
                        projectKey={this.props.projectKey}
                      />
                      <WarningSaveToolbar
                        onSave={formikProps.handleSubmit}
                        onCancel={formikProps.handleReset}
                        shouldWarnOnLeave={formikProps.dirty}
                        isToolbarVisible={formikProps.dirty}
                        isToolbarDisabled={
                          !formikProps.isValid || formikProps.isSubmitting
                        }
                      />
                    </CollapsiblePanel>
                  );
                }}
              </CustomFieldTypeDefinitionsConnector>
            )}
          />
        )}
      </TabContentLayout>
    );
  }
}

export default flowRight(
  injectAuthorized(
    [PERMISSIONS.ManageEmployees],
    {
      dataFences: [
        DATA_FENCES.store.ManageEmployees,
        DATA_FENCES.store.ViewEmployees,
      ],
      getSelectDataFenceData: ownProps =>
        createSelectEmployeeDataFenceData({
          employee: ownProps.employeeFetcher.employee,
        }),
    },
    'canManageEmployees'
  ),
  connect(null, {
    showNotification: globalActions.showNotification,
    onActionError: globalActions.handleActionError,
  }),
  injectIntl,
  withApplicationContext(applicationContext => ({
    language: applicationContext.user.locale,
    languages: applicationContext.project.languages,
  }))
)(EmployeeDetailsCustomFieldsForm);
