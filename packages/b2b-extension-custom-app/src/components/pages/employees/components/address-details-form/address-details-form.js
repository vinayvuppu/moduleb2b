import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import PageBottomSpacer from '@commercetools-local/core/components/page-bottom-spacer';
import TabContentLayout from '@commercetools-local/core/components/tab-content-layout';
import FormBox from '@commercetools-local/core/components/form-box';
import LabelRequired from '@commercetools-local/core/components/fields/label-required';
import { messages as validationMessages } from '@commercetools-local/utils/validation';
import {
  CollapsiblePanel,
  Spacings,
  TextField,
  SelectField,
} from '@commercetools-frontend/ui-kit';
import messages from './messages';
import { formValuesToDoc, docToFormValues } from './conversions';
import validate from './validations';

const mapCountriesToOptions = countries =>
  Object.entries(countries).map(([code, value]) => ({
    value: code.toUpperCase(),
    label: `${value} (${code.toUpperCase()})`,
  }));

// eslint-disable-next-line react/display-name
const renderEmailError = key => {
  switch (key) {
    case 'format':
      return <FormattedMessage {...validationMessages.email} />;
    default:
      return null;
  }
};

export class AddressDetailsForm extends React.PureComponent {
  static displayName = 'AddressDetailsForm';

  static propTypes = {
    children: PropTypes.func.isRequired,
    isCreateMode: PropTypes.bool.isRequired,
    address: PropTypes.object,
    countries: PropTypes.object.isRequired,
    canManageEmployees: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Formik
        initialValues={docToFormValues(this.props.address)}
        enableReinitialize={true}
        onSubmit={(values, formikBag) =>
          this.props.onSubmit(formValuesToDoc(values), formikBag)
        }
        validate={validate}
        render={formikProps => {
          const form = (
            <TabContentLayout
              description={<LabelRequired />}
              data-track-component="EmployeesAddressesDetail"
            >
              <Spacings.Stack scale="m">
                <CollapsiblePanel
                  id="address-details"
                  header={
                    <CollapsiblePanel.Header>
                      <FormattedMessage {...messages.addressDetailsTitle} />
                    </CollapsiblePanel.Header>
                  }
                >
                  <FormBox>
                    <Spacings.Inline>
                      <TextField
                        title={<FormattedMessage {...messages.streetNumber} />}
                        name="streetNumber"
                        isDisabled={!this.props.canManageEmployees}
                        value={formikProps.values.streetNumber || ''}
                        onChange={formikProps.handleChange}
                      />
                      <TextField
                        title={<FormattedMessage {...messages.streetName} />}
                        name="streetName"
                        isDisabled={!this.props.canManageEmployees}
                        value={formikProps.values.streetName}
                        onChange={formikProps.handleChange}
                      />
                    </Spacings.Inline>
                  </FormBox>
                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.apartment} />}
                      name="apartment"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.apartment}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>
                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.building} />}
                      name="building"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.building}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>
                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.pOBox} />}
                      name="pOBox"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.pOBox}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>
                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.city} />}
                      name="city"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.city}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>
                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.postalCode} />}
                      name="postalCode"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.postalCode}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>
                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.region} />}
                      name="region"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.region}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>
                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.state} />}
                      name="state"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.state}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>
                  <FormBox>
                    <SelectField
                      title={<FormattedMessage {...messages.country} />}
                      isRequired={true}
                      name="country"
                      isDisabled={!this.props.canManageEmployees}
                      options={mapCountriesToOptions(this.props.countries)}
                      value={formikProps.values.country}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      touched={formikProps.touched.country}
                      errors={formikProps.errors.country}
                    />
                  </FormBox>
                  <FormBox>
                    <TextField
                      title={
                        <FormattedMessage {...messages.additionalStreetInfo} />
                      }
                      name="additionalStreetInfo"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.additionalStreetInfo}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>
                  <FormBox>
                    <TextField
                      title={
                        <FormattedMessage {...messages.additionalAddressInfo} />
                      }
                      name="additionalAddressInfo"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.additionalAddressInfo}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>
                </CollapsiblePanel>
                <CollapsiblePanel
                  id="contact-details"
                  header={
                    <CollapsiblePanel.Header>
                      <FormattedMessage {...messages.contactDetailsTitle} />
                    </CollapsiblePanel.Header>
                  }
                >
                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.firstName} />}
                      name="firstName"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.firstName}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>

                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.lastName} />}
                      name="lastName"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.lastName}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>

                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.salutation} />}
                      name="salutation"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.salutation}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>

                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.title} />}
                      name="title"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.title}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>

                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.company} />}
                      name="company"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.company}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>

                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.department} />}
                      name="department"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.department}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>

                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.email} />}
                      name="email"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.email}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      touched={formikProps.touched.email}
                      errors={formikProps.errors.email}
                      renderError={renderEmailError}
                    />
                  </FormBox>

                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.phone} />}
                      name="phone"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.phone}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>

                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.mobile} />}
                      name="mobile"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.mobile}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>

                  <FormBox>
                    <TextField
                      title={<FormattedMessage {...messages.fax} />}
                      name="fax"
                      isDisabled={!this.props.canManageEmployees}
                      value={formikProps.values.fax}
                      onChange={formikProps.handleChange}
                    />
                  </FormBox>
                </CollapsiblePanel>
              </Spacings.Stack>
              <PageBottomSpacer />
            </TabContentLayout>
          );

          return this.props.children({
            form,
            isDirty: formikProps.dirty,
            handleSubmit: formikProps.handleSubmit,
            handleReset: formikProps.handleReset,
            isSubmitting: formikProps.isSubmitting,
          });
        }}
      />
    );
  }
}

export default AddressDetailsForm;
