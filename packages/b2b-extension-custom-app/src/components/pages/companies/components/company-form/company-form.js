import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash.flowright';

import { useFormik } from 'formik';
import { FormattedMessage, useIntl } from 'react-intl';
import classnames from 'classnames';

import {
  CollapsiblePanel,
  Spacings,
  TextField,
  Constraints,
  Label,
  SecondaryButton,
  Table,
  IconButton,
  ErrorMessage,
  CameraIcon,
  PlusThinIcon,
  BinLinearIcon,
  TruckIcon,
  PaperBillInvertedIcon,
} from '@commercetools-frontend/ui-kit';
import {
  injectAuthorized,
  RestrictedByPermissions,
} from '@commercetools-frontend/permissions';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import formatEmployeeName from '@commercetools-local/utils/customer/format-customer-name';
import formatEmployeeAddress from '@commercetools-local/utils/customer/format-customer-address';

import WarningSaveToolbar from '@commercetools-local/core/components/warning-save-toolbar';
import ReadOnlyMessage from '@commercetools-local/core/components/read-only-message';
import { useDropzone } from 'react-dropzone';
import { PERMISSIONS } from '../../../../../constants';
import messages from './messages';
import AddressForm from '../../../../common/form/Address';
import validate from './validations';
import styles from './company-form.mod.css';

const columnDefinitions = [
  {
    key: 'defaults',
    label: '',
    flexGrow: 1,
  },
  {
    key: 'contactName',
    label: <FormattedMessage {...messages.columnContactName} />,
    flexGrow: 1,
  },
  {
    key: 'address',
    label: <FormattedMessage {...messages.columnAddress} />,
    flexGrow: 1,
  },
  {
    key: 'city',
    label: <FormattedMessage {...messages.columnCity} />,
    flexGrow: 1,
  },
  {
    key: 'postalCode',
    label: <FormattedMessage {...messages.columnPostalCode} />,
    flexGrow: 1,
  },
  {
    key: 'state',
    label: <FormattedMessage {...messages.columnState} />,
    flexGrow: 1,
  },
  {
    key: 'region',
    label: <FormattedMessage {...messages.columnRegion} />,
    flexGrow: 1,
  },
  {
    key: 'country',
    label: <FormattedMessage {...messages.columnCountry} />,
    flexGrow: 1,
  },
];

const MAX_FILE_SIZE = 1048576; // 1MB

export const CompanyForm = props => {
  const [openAddresModal, setOpenAddressModal] = useState(false);
  const [addressRowIndex, setAddressRowIndex] = useState(undefined);

  const { formatMessage } = useIntl();
  const formik = useFormik({
    initialValues: props.initialValues,
    onSubmit: props.onSubmit,
    enableReinitialize: true,
    validate: values => validate(values, formatMessage),
  });

  const onDrop = useCallback(
    async acceptedFiles => {
      const arrayBuffer = await acceptedFiles[0].arrayBuffer();

      const blob = new Blob([arrayBuffer], { type: acceptedFiles[0].type });

      if (blob.size > MAX_FILE_SIZE) {
        formik.setFieldError('logo', formatMessage(messages.logoSizeError));
      } else {
        const reader = new FileReader();
        reader.onload = evt => {
          const dataurl = evt.target.result;
          formik.setFieldValue('logo', dataurl);
        };
        reader.readAsDataURL(blob);
      }
    },
    [formatMessage, formik]
  );

  const { getInputProps, getRootProps } = useDropzone({ onDrop });

  const renderRow = ({ rowIndex, columnKey }, addresses) => {
    const address = addresses[rowIndex];

    let formattedValue = NO_VALUE_FALLBACK;

    if (columnKey === 'contactName') {
      formattedValue = formatEmployeeName(address);
    } else if (columnKey === 'address') {
      formattedValue = address.pOBox
        ? formatMessage(messages.labelPOBox, {
            value: address.pOBox,
          })
        : formatEmployeeAddress(address);
    }
    if (
      ['city', 'postalCode', 'region', 'state', 'country'].includes(columnKey)
    ) {
      formattedValue = address[columnKey];
    }

    if (columnKey === 'defaults') {
      const isDefaulShippingAddress =
        address.id && formik.values.defaultShippingAddress === address.id;
      const isDefaulBillingAddress =
        address.id && formik.values.defaultBillingAddress === address.id;
      return (
        <Spacings.Inline scale="xs">
          {isDefaulShippingAddress && <TruckIcon key="shipping" color="info" />}
          {isDefaulBillingAddress && (
            <PaperBillInvertedIcon key="billing" color="info" />
          )}
        </Spacings.Inline>
      );
    }

    return formattedValue;
  };

  return (
    <React.Fragment>
      <Spacings.Stack scale="m">
        <RestrictedByPermissions
          permissions={[PERMISSIONS.ManageCompanies]}
          unauthorizedComponent={ReadOnlyMessage}
        />
        <form onSubmit={formik.handleSubmit}>
          <Spacings.Stack scale="m">
            <CollapsiblePanel
              header={
                <CollapsiblePanel.Header>
                  <FormattedMessage {...messages.labelGeneralInfoTitle} />
                </CollapsiblePanel.Header>
              }
            >
              <Constraints.Horizontal>
                <Spacings.Stack>
                  <TextField
                    autoComplete="off"
                    title={<FormattedMessage {...messages.labelNameField} />}
                    horizontalConstraint="l"
                    isRequired={true}
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={formik.isSubmitting || !props.isAuthorized}
                    errors={formik.errors.name}
                    touched={formik.touched.name}
                  />
                  <Constraints.Horizontal>
                    <Spacings.Inline alignItems="center">
                      <Label htmlFor="company-logo" isBold={true}>
                        <FormattedMessage {...messages.logo} />
                      </Label>
                    </Spacings.Inline>
                    <div
                      className={styles['image-drop-wrapper']}
                      data-track-label="dropImage"
                      data-track-event="drop"
                    >
                      <div
                        {...getRootProps()}
                        className={classnames(styles['image-drop'], {
                          [styles['image-dropped']]: formik.values.logo,
                        })}
                      >
                        {!formik.values.logo && (
                          <div>
                            <div className={styles['icon-holder']}>
                              <div className={styles['camera-icon']}>
                                <CameraIcon size="scale" />
                              </div>
                              <div className={styles['add-icon']}>
                                <PlusThinIcon size="scale" color="surface" />
                              </div>
                            </div>
                            <span className={styles['image-drop-text']}>
                              <FormattedMessage {...messages.dropImage} />
                            </span>
                          </div>
                        )}
                        <input
                          {...getInputProps()}
                          id="company-logo"
                          disabled={!props.isAuthorized}
                        />
                        {formik.values.logo && (
                          <React.Fragment>
                            <img src={formik.values.logo} />
                            <div className={styles.controls}>
                              <div className={styles['delete-icon']}>
                                <IconButton
                                  label="Remove image"
                                  icon={<BinLinearIcon />}
                                  isDisabled={!props.isAuthorized}
                                  onClick={event => {
                                    event.stopPropagation();
                                    event.nativeEvent.stopImmediatePropagation();
                                    formik.setFieldValue('logo', '');
                                  }}
                                  data-track-component="Delete"
                                  data-track-event="click"
                                />
                              </div>
                            </div>
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                    {formik.errors.logo && (
                      <ErrorMessage>{formik.errors.logo}</ErrorMessage>
                    )}
                  </Constraints.Horizontal>
                </Spacings.Stack>
              </Constraints.Horizontal>
            </CollapsiblePanel>
          </Spacings.Stack>
        </form>
        <CollapsiblePanel
          header={
            <CollapsiblePanel.Header>
              {formatMessage(messages.labelAddressTitle)}
            </CollapsiblePanel.Header>
          }
        >
          <Spacings.Stack scale="m">
            <SecondaryButton
              label="Add address"
              isDisabled={!props.isAuthorized}
              onClick={() => {
                setAddressRowIndex(undefined);
                setOpenAddressModal(true);
              }}
            />
            <br />
          </Spacings.Stack>
          <Constraints.Horizontal constraint="scale">
            <Spacings.Stack scale="m">
              {formik.values.addresses && formik.values.addresses.length > 0 && (
                <Table
                  columns={columnDefinitions}
                  rowCount={formik.values.addresses.length}
                  items={formik.values.addresses}
                  itemRenderer={rowData =>
                    renderRow(rowData, formik.values.addresses)
                  }
                  shouldFillRemainingVerticalSpace={false}
                  onRowClick={(_, rowIndex) => {
                    setAddressRowIndex(rowIndex);
                    setOpenAddressModal(true);
                  }}
                />
              )}
            </Spacings.Stack>
          </Constraints.Horizontal>
          <AddressForm
            isAuthorized={props.isAuthorized}
            isOpen={openAddresModal}
            close={() => setOpenAddressModal(false)}
            isEdit={formik.values.addresses && addressRowIndex !== undefined}
            initialValues={
              formik.values.addresses && addressRowIndex !== undefined
                ? formik.values.addresses[addressRowIndex]
                : undefined
            }
            onRemove={() => {
              const newAddresses = [
                ...formik.values.addresses.slice(0, addressRowIndex),
                ...formik.values.addresses.slice(
                  addressRowIndex + 1,
                  formik.values.addresses.length
                ),
              ];

              formik.setFieldValue('addresses', newAddresses || []);
            }}
            onSubmit={values => {
              if (addressRowIndex !== undefined) {
                const newAddresses = [
                  ...formik.values.addresses.slice(0, addressRowIndex),
                  values,
                  ...formik.values.addresses.slice(
                    addressRowIndex + 1,
                    formik.values.addresses.length
                  ),
                ];

                formik.setFieldValue('addresses', newAddresses || []);
              } else {
                formik.setFieldValue(
                  'addresses',
                  formik.values.addresses
                    ? [...formik.values.addresses, values]
                    : [values]
                );
              }
            }}
            defaultShippingAddress={formik.values.defaultShippingAddress}
            defaultBillingAddress={formik.values.defaultBillingAddress}
            onSetDefaultShippingAddress={props.onSetDefaultShippingAddress}
            onSetDefaultBillingAddress={props.onSetDefaultBillingAddress}
          />
        </CollapsiblePanel>
        <WarningSaveToolbar
          onSave={formik.handleSubmit}
          onCancel={() => {
            formik.handleReset();
            props.onCancel();
          }}
          shouldWarnOnLeave={formik.dirty}
          isToolbarVisible={props.isSaveToolbarAlwaysVisible || formik.dirty}
          isToolbarDisabled={formik.isSubmitting}
        />
      </Spacings.Stack>
    </React.Fragment>
  );
};

CompanyForm.propTypes = {
  isSaveToolbarAlwaysVisible: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onSetDefaultShippingAddress: PropTypes.func,
  onSetDefaultBillingAddress: PropTypes.func,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    key: PropTypes.string,
    name: PropTypes.string,
  }),
  // HoC
  isAuthorized: PropTypes.bool.isRequired,
  // withApplicationContext
  locale: PropTypes.string.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string),
};
CompanyForm.defaultProps = {
  isSaveToolbarAlwaysVisible: false,
  onCancel: () => {},
};
CompanyForm.displayName = 'CompanyForm';

export default flowRight(
  injectAuthorized([PERMISSIONS.ManageCompanies]),
  withApplicationContext(applicationContext => ({
    locale: applicationContext.user.locale,
    currencies: applicationContext.project.currencies,
  }))
)(CompanyForm);
