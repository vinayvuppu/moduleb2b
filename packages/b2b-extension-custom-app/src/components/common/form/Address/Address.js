import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import TabContentLayout from '@commercetools-local/core/components/tab-content-layout';
import FormBox from '@commercetools-local/core/components/form-box';
import PageBottomSpacer from '@commercetools-local/core/components/page-bottom-spacer';
import LabelRequired from '@commercetools-local/core/components/fields/label-required';
import { useCountries } from '@commercetools-frontend/l10n';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  FormModalPage,
  ConfirmationDialog,
} from '@commercetools-frontend/application-components';
import {
  CollapsiblePanel,
  Spacings,
  TextField,
  SelectField,
  BinFilledIcon,
  IconButton,
  PrimaryButton,
  SecondaryButton,
  TruckIcon,
  PaperBillInvertedIcon,
  Tooltip,
  Text,
} from '@commercetools-frontend/ui-kit';

import {
  messages as validationMessages,
  withoutEmptyErrorsByField,
} from '@commercetools-local/utils/validation';
import { useIntl } from 'react-intl';
import validate from './validations';
import { docToFormValues, formValuesToDoc } from './conversions';
import messages from './messages';

const renderEmailError = (key, formatMessage) => {
  switch (key) {
    case 'format':
      return formatMessage(validationMessages.email);
    default:
      return null;
  }
};

const mapCountriesToOptions = countries =>
  Object.entries(countries).map(([code, value]) => ({
    value: code.toUpperCase(),
    label: `${value} (${code.toUpperCase()})`,
  }));

const AddressForm = ({
  initialValues,
  defaultShippingAddress,
  defaultBillingAddress,
  isAuthorized,
  isOpen,
  close,
  onSubmit,
  onSetDefaultBillingAddress,
  onSetDefaultShippingAddress,
  isEdit,
  onRemove,
}) => {
  const { formatMessage } = useIntl();
  const [
    isConfirmationDefaultDialogOpen,
    setConfirmationDefaultDialogOpen,
  ] = useState(false);
  const [confirmationDefaultType, setConfirmationDefaultType] = useState('');

  const {
    user: { locale },
  } = useApplicationContext();
  const { data: countries, isLoading } = useCountries(locale);
  const formik = useFormik({
    initialValues: docToFormValues(initialValues),
    onSubmit: values => onSubmit(formValuesToDoc(values)),
    validate,
    validateOnBlur: true,
    validateOnChange: true,
    enableReinitialize: true,
  });

  const handleSubmit = async () => {
    formik.setFieldTouched('country', true, true);
    formik.setFieldTouched('email', true, true);
    const errors = await formik.validateForm();
    const errorsWithoutEmpty = withoutEmptyErrorsByField(errors);
    if (Object.keys(errorsWithoutEmpty).length === 0) {
      await formik.submitForm();
      formik.resetForm();
      close();
    }
  };

  const handleRemove = async () => {
    await onRemove();
    close();
  };

  const closeDialog = () => setConfirmationDefaultDialogOpen(false);

  const openDialogShipping = () => {
    setConfirmationDefaultType('shipping');
    setConfirmationDefaultDialogOpen(true);
  };
  const openDialogBilling = () => {
    setConfirmationDefaultType('billing');
    setConfirmationDefaultDialogOpen(true);
  };

  const confirmDialog = async () => {
    closeDialog();
    if (confirmationDefaultType === 'shipping') {
      await onSetDefaultShippingAddress(initialValues.id);
    } else {
      await onSetDefaultBillingAddress(initialValues.id);
    }
  };

  const isDefaultBillingAddress = Boolean(
    defaultBillingAddress !== undefined &&
      defaultBillingAddress === formik.values.id
  );
  const isDefaultShippingAddress = Boolean(
    defaultShippingAddress !== undefined &&
      defaultShippingAddress === formik.values.id
  );

  const shippingTooltipMesssage = isDefaultShippingAddress
    ? messages.defaultAddress
    : messages.makeDefaultAddress;

  const billingTooltipMesssage = isDefaultBillingAddress
    ? messages.defaultAddress
    : messages.makeDefaultAddress;

  return (
    <FormModalPage
      isOpen={isOpen}
      onClose={close}
      title={formatMessage(messages.addressTitle)}
      topBarPreviousPathLabel={formatMessage(messages.topBarPreviousPathLabel)}
      topBarCurrentPathLabel={
        isEdit
          ? formatMessage(messages.editAddressTitle)
          : formatMessage(messages.createAddressTitle)
      }
      customControls={
        <Spacings.Inline>
          {isEdit && initialValues?.id && (
            <React.Fragment>
              <Tooltip
                title={formatMessage(billingTooltipMesssage, {
                  type: 'billing',
                })}
                placement="left"
              >
                <IconButton
                  icon={<PaperBillInvertedIcon />}
                  isToggleButton={true}
                  theme="info"
                  label={formatMessage(billingTooltipMesssage, {
                    type: 'billing',
                  })}
                  isToggled={isDefaultBillingAddress}
                  isDisabled={!isAuthorized || isDefaultBillingAddress}
                  onClick={openDialogBilling}
                />
              </Tooltip>
              <Tooltip
                title={formatMessage(shippingTooltipMesssage, {
                  type: 'shipping',
                })}
                placement="left"
              >
                <IconButton
                  icon={<TruckIcon />}
                  isToggleButton={true}
                  theme="info"
                  label={formatMessage(shippingTooltipMesssage, {
                    type: 'shipping',
                  })}
                  isToggled={isDefaultShippingAddress}
                  isDisabled={!isAuthorized || isDefaultShippingAddress}
                  onClick={openDialogShipping}
                />
              </Tooltip>
            </React.Fragment>
          )}
          <IconButton
            icon={<BinFilledIcon />}
            isDisabled={!isAuthorized || !isEdit}
            label={formatMessage(messages.removeAddress)}
            onClick={handleRemove}
          />
          <SecondaryButton
            isDisabled={!isAuthorized}
            label={formatMessage(messages.cancel)}
            onClick={close}
          />
          <PrimaryButton
            label={formatMessage(messages.confirm)}
            onClick={handleSubmit}
            isDisabled={!isAuthorized || !formik.dirty}
          />
        </Spacings.Inline>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <TabContentLayout
          description={<LabelRequired />}
          data-track-component="EmployeesAddressesDetail"
        >
          <Spacings.Stack scale="m">
            <CollapsiblePanel
              id="address-details"
              header={
                <CollapsiblePanel.Header>
                  {formatMessage(messages.addressDetailsTitle)}
                </CollapsiblePanel.Header>
              }
            >
              <FormBox>
                <Spacings.Inline>
                  <TextField
                    title={formatMessage(messages.streetNumber)}
                    name="streetNumber"
                    tabIndex={0}
                    isDisabled={!isAuthorized}
                    value={formik.values.streetNumber || ''}
                    onChange={formik.handleChange}
                    isAutofocussed={true}
                  />
                  <TextField
                    title={formatMessage(messages.streetName)}
                    name="streetName"
                    tabIndex={1}
                    isDisabled={!isAuthorized}
                    value={formik.values.streetName}
                    onChange={formik.handleChange}
                  />
                </Spacings.Inline>
              </FormBox>
              <FormBox>
                <TextField
                  title={formatMessage(messages.apartment)}
                  name="apartment"
                  isDisabled={!isAuthorized}
                  value={formik.values.apartment}
                  onChange={formik.handleChange}
                />
              </FormBox>
              <FormBox>
                <TextField
                  title={formatMessage(messages.building)}
                  name="building"
                  isDisabled={!isAuthorized}
                  value={formik.values.building}
                  onChange={formik.handleChange}
                />
              </FormBox>
              <FormBox>
                <TextField
                  title={formatMessage(messages.pOBox)}
                  name="pOBox"
                  isDisabled={!isAuthorized}
                  value={formik.values.pOBox}
                  onChange={formik.handleChange}
                />
              </FormBox>
              <FormBox>
                <TextField
                  title={formatMessage(messages.city)}
                  name="city"
                  isDisabled={!isAuthorized}
                  value={formik.values.city}
                  onChange={formik.handleChange}
                />
              </FormBox>
              <FormBox>
                <TextField
                  title={formatMessage(messages.postalCode)}
                  name="postalCode"
                  isDisabled={!isAuthorized}
                  value={formik.values.postalCode}
                  onChange={formik.handleChange}
                />
              </FormBox>
              <FormBox>
                <TextField
                  title={formatMessage(messages.region)}
                  name="region"
                  isDisabled={!isAuthorized}
                  value={formik.values.region}
                  onChange={formik.handleChange}
                />
              </FormBox>
              <FormBox>
                <TextField
                  title={formatMessage(messages.state)}
                  name="state"
                  isDisabled={!isAuthorized}
                  value={formik.values.state}
                  onChange={formik.handleChange}
                />
              </FormBox>
              <FormBox>
                <SelectField
                  title={formatMessage(messages.country)}
                  isRequired={true}
                  name="country"
                  isDisabled={!isAuthorized || isLoading}
                  options={mapCountriesToOptions(countries)}
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.country}
                  errors={formik.errors.country}
                />
              </FormBox>
              <FormBox>
                <TextField
                  title={formatMessage(messages.additionalStreetInfo)}
                  name="additionalStreetInfo"
                  isDisabled={!isAuthorized}
                  value={formik.values.additionalStreetInfo}
                  onChange={formik.handleChange}
                />
              </FormBox>
              <FormBox>
                <TextField
                  title={formatMessage(messages.additionalAddressInfo)}
                  name="additionalAddressInfo"
                  isDisabled={!isAuthorized}
                  value={formik.values.additionalAddressInfo}
                  onChange={formik.handleChange}
                />
              </FormBox>
            </CollapsiblePanel>
            <CollapsiblePanel
              id="contact-details"
              header={
                <CollapsiblePanel.Header>
                  {formatMessage(messages.contactDetailsTitle)}
                </CollapsiblePanel.Header>
              }
            >
              <FormBox>
                <TextField
                  title={formatMessage(messages.firstName)}
                  name="firstName"
                  isDisabled={!isAuthorized}
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                />
              </FormBox>

              <FormBox>
                <TextField
                  title={formatMessage(messages.lastName)}
                  name="lastName"
                  isDisabled={!isAuthorized}
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                />
              </FormBox>

              <FormBox>
                <TextField
                  title={formatMessage(messages.salutation)}
                  name="salutation"
                  isDisabled={!isAuthorized}
                  value={formik.values.salutation}
                  onChange={formik.handleChange}
                />
              </FormBox>

              <FormBox>
                <TextField
                  title={formatMessage(messages.title)}
                  name="title"
                  isDisabled={!isAuthorized}
                  value={formik.values.title}
                  onChange={formik.handleChange}
                />
              </FormBox>

              <FormBox>
                <TextField
                  title={formatMessage(messages.department)}
                  name="department"
                  isDisabled={!isAuthorized}
                  value={formik.values.department}
                  onChange={formik.handleChange}
                />
              </FormBox>

              <FormBox>
                <TextField
                  title={formatMessage(messages.email)}
                  name="email"
                  isDisabled={!isAuthorized}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.email}
                  errors={formik.errors.email}
                  renderError={key => renderEmailError(key, formatMessage)}
                />
              </FormBox>

              <FormBox>
                <TextField
                  title={formatMessage(messages.phone)}
                  name="phone"
                  isDisabled={!isAuthorized}
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                />
              </FormBox>

              <FormBox>
                <TextField
                  title={formatMessage(messages.mobile)}
                  name="mobile"
                  isDisabled={!isAuthorized}
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                />
              </FormBox>

              <FormBox>
                <TextField
                  title={formatMessage(messages.fax)}
                  name="fax"
                  isDisabled={!isAuthorized}
                  value={formik.values.fax}
                  onChange={formik.handleChange}
                />
              </FormBox>
            </CollapsiblePanel>
          </Spacings.Stack>
          <PageBottomSpacer />
        </TabContentLayout>
      </form>
      {isConfirmationDefaultDialogOpen && (
        <ConfirmationDialog
          zIndex={1100}
          title={formatMessage(messages.confirmDefaultAddressSetTitle, {
            type: confirmationDefaultType,
          })}
          isOpen={isConfirmationDefaultDialogOpen}
          onClose={closeDialog}
          onCancel={closeDialog}
          onConfirm={confirmDialog}
        >
          <Text.Body
            intlMessage={{
              ...messages.confirmDefaultAddressSet,
              values: {
                type: confirmationDefaultType,
              },
            }}
          />
        </ConfirmationDialog>
      )}
    </FormModalPage>
  );
};

AddressForm.propTypes = {
  initialValues: PropTypes.object,
  isAuthorized: PropTypes.bool,
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  onSubmit: PropTypes.func,
  onSetDefaultShippingAddress: PropTypes.func,
  onSetDefaultBillingAddress: PropTypes.func,
  isEdit: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
  defaultShippingAddress: PropTypes.string,
  defaultBillingAddress: PropTypes.string,
};

AddressForm.displayName = 'AddressForm';

export default AddressForm;
