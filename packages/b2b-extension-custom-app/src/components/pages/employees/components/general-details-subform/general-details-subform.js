import PropTypes from 'prop-types';
import React from 'react';
import flowRight from 'lodash.flowright';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { DateSelector } from '@commercetools-local/react-datetime-selector';
import {
  CloseBoldIcon,
  CollapsiblePanel,
  Constraints,
  ErrorMessage,
  FieldLabel,
  IconButton,
  Spacings,
  TextField,
  TextInput,
  VerifiedIcon,
  WarningIcon,
} from '@commercetools-frontend/ui-kit';
import FormBox from '@commercetools-local/core/components/form-box';
import ValidationError from '@commercetools-local/core/components/validation-error';
import { messages as validationMessages } from '@commercetools-local/utils/validation';
import createCustomerGroupReferenceSingleFilter from '@commercetools-local/core/components/search/standard-filters/customer-group-reference-filter';
import styles from '../_styles/panels.mod.css';
import CompanySelectField from '../company-selectfield';
import EmployeeRolesSelectField from '../employee-roles-selectfield';
import messages from './messages';

const maxDateOfBirthYear = new Date().getFullYear();
const minDateOfBirthYear = maxDateOfBirthYear - 100;

const SingleCustomerGroupReferenceFilter = createCustomerGroupReferenceSingleFilter(
  {
    isMulti: false,
    isClearable: true,
  }
);
SingleCustomerGroupReferenceFilter.displayName =
  'SingleCustomerGroupReferenceFilter';

// eslint-disable-next-line react/display-name
const renderEmployeeNumberError = key => {
  switch (key) {
    case 'duplicate':
      return <FormattedMessage {...messages.employeeWithExistingNumber} />;
    default:
      return null;
  }
};

export class GeneralDetailsSubform extends React.PureComponent {
  static displayName = 'GeneralDetailsSubform';

  static propTypes = {
    canManageEmployees: PropTypes.bool.isRequired,
    companyId: PropTypes.string,
    formik: PropTypes.shape({
      values: PropTypes.shape({
        id: PropTypes.string,
        company: PropTypes.string,
        salutation: PropTypes.string,
        title: PropTypes.string,
        firstName: PropTypes.string,
        middleName: PropTypes.string,
        lastName: PropTypes.string,
        email: PropTypes.string,
        isEmailVerified: PropTypes.bool,
        dateOfBirth: PropTypes.string,
        customerNumber: PropTypes.string,
        externalId: PropTypes.string,
        customerGroup: PropTypes.string,
        stores: PropTypes.arrayOf(PropTypes.string),
        roles: PropTypes.arrayOf(PropTypes.string),
      }).isRequired,
      errors: PropTypes.obj,
      touched: PropTypes.shape({
        key: PropTypes.bool,
        email: PropTypes.bool,
        customerNumber: PropTypes.bool,
        company: PropTypes.bool,
        roles: PropTypes.arrayOf(PropTypes.bool),
      }),
      handleBlur: PropTypes.func.isRequired,
      handleChange: PropTypes.func.isRequired,
      setFieldValue: PropTypes.func.isRequired,
    }).isRequired,
    cannotChangeCustomerNumber: PropTypes.bool.isRequired,

    // withApplicationContext
    locale: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    language: PropTypes.string.isRequired,
    // injectIntl
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired }),
  };

  render() {
    return (
      <CollapsiblePanel
        data-testid="employee-info-details"
        header={
          <CollapsiblePanel.Header>
            <FormattedMessage {...messages.panelTitle} />
          </CollapsiblePanel.Header>
        }
      >
        <FormBox>
          <TextField
            title={this.props.intl.formatMessage(messages.labelSalutation)}
            name="salutation"
            isDisabled={!this.props.canManageEmployees}
            value={this.props.formik.values.salutation}
            onChange={this.props.formik.handleChange}
          />
        </FormBox>
        <FormBox>
          <TextField
            title={this.props.intl.formatMessage(messages.labelTitleName)}
            name="title"
            isDisabled={!this.props.canManageEmployees}
            value={this.props.formik.values.title}
            onChange={this.props.formik.handleChange}
          />
        </FormBox>
        <FormBox>
          <TextField
            data-testid="firstName"
            title={this.props.intl.formatMessage(messages.labelFirstName)}
            name="firstName"
            isDisabled={!this.props.canManageEmployees}
            value={this.props.formik.values.firstName}
            onChange={this.props.formik.handleChange}
          />
        </FormBox>
        <FormBox>
          <TextField
            title={this.props.intl.formatMessage(messages.labelMiddleName)}
            name="middleName"
            isDisabled={!this.props.canManageEmployees}
            value={this.props.formik.values.middleName}
            onChange={this.props.formik.handleChange}
          />
        </FormBox>
        <FormBox>
          <TextField
            title={this.props.intl.formatMessage(messages.labelLastName)}
            name="lastName"
            isDisabled={!this.props.canManageEmployees}
            value={this.props.formik.values.lastName}
            onChange={this.props.formik.handleChange}
          />
        </FormBox>
        <FormBox>
          <Spacings.Stack scale="xs">
            <div className={styles['email-verification-container']}>
              <FieldLabel
                title={this.props.intl.formatMessage(messages.labelEmail)}
                hasRequiredIndicator={true}
              />
              <Constraints.Horizontal>
                {this.props.formik.values.isEmailVerified !== undefined && (
                  <span className={styles['email-verification']}>
                    {this.props.formik.values.isEmailVerified ? (
                      <FormattedMessage {...messages.labelEmailVerified} />
                    ) : (
                      <FormattedMessage {...messages.labelEmailNotVerified} />
                    )}
                    <VerifiedIcon
                      size="medium"
                      color={
                        this.props.formik.values.isEmailVerified
                          ? 'primary'
                          : 'neutral60'
                      }
                    />
                  </span>
                )}
              </Constraints.Horizontal>
            </div>
            <TextInput
              data-testid="email"
              name="email"
              isDisabled={!this.props.canManageEmployees}
              value={this.props.formik.values.email}
              onChange={this.props.formik.handleChange}
              onBlur={this.props.formik.handleBlur}
              hasError={Boolean(
                this.props.formik.touched.email &&
                  this.props.formik.errors.email
              )}
            />
            <ValidationError.Switch
              errors={this.props.formik.errors.email}
              isTouched={Boolean(this.props.formik.touched.email)}
            >
              <ValidationError.Match rule="missing">
                <ErrorMessage>
                  <FormattedMessage {...validationMessages.required} />
                </ErrorMessage>
              </ValidationError.Match>
              <ValidationError.Match rule="format">
                <ErrorMessage>
                  <FormattedMessage {...validationMessages.email} />
                </ErrorMessage>
              </ValidationError.Match>
              <ValidationError.Match rule="duplicate">
                <ErrorMessage>
                  <FormattedMessage {...messages.employeeWithExistingEmail} />
                </ErrorMessage>
              </ValidationError.Match>
            </ValidationError.Switch>
          </Spacings.Stack>
        </FormBox>
        <FormBox>
          <Spacings.Stack scale="xs">
            <FieldLabel
              title={this.props.intl.formatMessage(messages.labelDateOfBirth)}
            />
            <DateSelector
              name="dateOfBirth"
              disabled={!this.props.canManageEmployees}
              locale={this.props.locale}
              value={this.props.formik.values.dateOfBirth}
              onChange={value =>
                this.props.formik.setFieldValue('dateOfBirth', value)
              }
              minYear={minDateOfBirthYear}
              maxYear={maxDateOfBirthYear}
              clearButton={
                <IconButton
                  label={this.props.intl.formatMessage(messages.clearDate)}
                  isDisabled={!this.props.canManageEmployees}
                  icon={<CloseBoldIcon />}
                  size="medium"
                  data-track-component="Delete"
                  data-track-event="click"
                  onClick={
                    // The onClick is handled inside the `DateSelector` component.
                    // Not sure this makes any sense though. Probably the clear
                    // button should be a part of the DateSelector component
                    () => {}
                  }
                />
              }
              classNames={{
                containerLeft: styles['date-container-left'],
                containerRight: styles['date-container-right'],
              }}
              placeholderYear={this.props.intl.formatMessage(
                messages.labelYear
              )}
              placeholderMonth={this.props.intl.formatMessage(
                messages.labelMonth
              )}
              placeholderDay={this.props.intl.formatMessage(messages.labelDay)}
            />
          </Spacings.Stack>
        </FormBox>
        <FormBox>
          <TextField
            title={this.props.intl.formatMessage(messages.labelCustomerNumber)}
            name="customerNumber"
            isDisabled={!this.props.canManageEmployees}
            value={this.props.formik.values.customerNumber}
            onChange={this.props.formik.handleChange}
            onBlur={this.props.formik.handleBlur}
            isReadOnly={this.props.cannotChangeCustomerNumber}
            hint={<FormattedMessage {...messages.customerNumberWarning} />}
            hintIcon={
              <WarningIcon
                color={
                  this.props.cannotChangeCustomerNumber ? 'solid' : 'warning'
                }
              />
            }
            touched={this.props.formik.touched.customerNumber}
            errors={this.props.formik.errors.customerNumber}
            renderError={renderEmployeeNumberError}
          />
        </FormBox>
        <FormBox>
          <TextField
            title={this.props.intl.formatMessage(messages.labelExternalId)}
            name="externalId"
            isDisabled={!this.props.canManageEmployees}
            value={this.props.formik.values.externalId}
            onChange={this.props.formik.handleChange}
          />
        </FormBox>
        <FormBox>
          <Spacings.Stack scale="xs">
            <CompanySelectField
              value={this.props.formik.values.company}
              isRequired={true}
              errors={this.props.formik.errors.company}
              touched={this.props.formik.touched.company}
              isDisabled={this.props.companyId !== undefined}
              onChange={company => {
                this.props.formik.setFieldValue('company', company.id);
                this.props.formik.setFieldValue(
                  'customerGroup',
                  company.customerGroup.key
                );
                this.props.formik.setFieldValue('stores', [company.store.key]);
              }}
            />
          </Spacings.Stack>
        </FormBox>
        <FormBox>
          <Spacings.Stack scale="xs">
            <EmployeeRolesSelectField
              canManageEmployees={this.props.canManageEmployees}
              isRequired={true}
              value={this.props.formik.values.roles}
              onChange={this.props.formik.handleChange}
              errors={this.props.formik.errors.roles}
              touched={this.props.formik.touched.roles}
            />
          </Spacings.Stack>
        </FormBox>
      </CollapsiblePanel>
    );
  }
}

export default flowRight(
  withApplicationContext(applicationContext => ({
    locale: applicationContext.user.locale,
    language: applicationContext.dataLocale,
    languages: applicationContext.project.languages,
  })),
  injectIntl
)(GeneralDetailsSubform);
