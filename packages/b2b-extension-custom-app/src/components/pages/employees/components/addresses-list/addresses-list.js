import PropTypes from 'prop-types';
import React from 'react';
import flowRight from 'lodash.flowright';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  PlusBoldIcon,
  PaperBillInvertedIcon,
  TruckIcon,
  LinkButton,
  SecondaryButton,
  Table,
  Spacings,
  LoadingSpinner,
} from '@commercetools-frontend/ui-kit';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { PageNotFound } from '@commercetools-frontend/application-components';
import formatEmployeeName from '@commercetools-local/utils/customer/format-customer-name';
import formatEmployeeAddress from '@commercetools-local/utils/customer/format-customer-address';
import PageBottomSpacer from '@commercetools-local/core/components/page-bottom-spacer';
import TabContentLayout from '@commercetools-local/core/components/tab-content-layout';
import LabelRequired from '@commercetools-local/core/components/fields/label-required';
import { injectAuthorized } from '@commercetools-frontend/permissions';
import styles from './addresses-list.mod.css';
import createSelectEmployeeDataFenceData from '../../../../utils/create-select-employee-data-fence-data';
import { PERMISSIONS, DATA_FENCES } from '../../../../../constants';
import messages from './messages';
import createColumnsDefinition from './column-definitions';

const ManageMessage = () => (
  <div>
    <FormattedMessage {...messages.title} />
    <br />
    <LabelRequired />
  </div>
);
ManageMessage.displayName = 'ManageMessage';

export class AddressesList extends React.PureComponent {
  static displayName = 'AddressesList';

  static propTypes = {
    employeeFetcher: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      employee: PropTypes.shape({
        addresses: PropTypes.array,
        defaultShippingAddressId: PropTypes.string,
        defaultBillingAddressId: PropTypes.string,
      }),
    }),
    addressListPath: PropTypes.string.isRequired,
    goToAddressDetails: PropTypes.func.isRequired,
    goToAddressNew: PropTypes.func.isRequired,
    children: PropTypes.element,
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
    canManageEmployees: PropTypes.bool.isRequired,
  };

  componentDidUpdate(prevProps) {
    if (
      (!this.props.employeeFetcher.isLoading &&
        this.props.employeeFetcher.employee.defaultShippingAddressId !==
          prevProps.employeeFetcher.employee.defaultShippingAddressId) ||
      this.props.employeeFetcher.employee.defaultBillingAddressId !==
        prevProps.employeeFetcher.employee.defaultBillingAddressId
    )
      this.handleCellHeightChange();
  }

  tableMeasureCache = null;
  tableMultiGrid = null;

  registerMeasurementCache = cache => {
    this.tableMeasureCache = cache;
  };

  redirectToAddress = index => {
    const addressId = this.props.employeeFetcher.employee.addresses[index].id;
    this.props.goToAddressDetails(addressId);
  };

  renderAddressesRow = ({ rowIndex, columnKey }) => {
    const address = this.props.employeeFetcher.employee.addresses[rowIndex];

    let formattedValue = NO_VALUE_FALLBACK;

    if (columnKey === 'addressTypes') {
      const isDefaulShippingAddress =
        this.props.employeeFetcher.employee.defaultShippingAddressId ===
        address.id;
      const isDefaulBillingAddress =
        this.props.employeeFetcher.employee.defaultBillingAddressId ===
        address.id;
      return (
        <Spacings.Inline scale="xs">
          {isDefaulShippingAddress && <TruckIcon key="shipping" color="info" />}
          {isDefaulBillingAddress && (
            <PaperBillInvertedIcon key="billing" color="info" />
          )}
        </Spacings.Inline>
      );
    }
    if (columnKey === 'contactName')
      formattedValue = formatEmployeeName(address);
    else if (columnKey === 'companyName') formattedValue = address.company;
    else if (columnKey === 'address')
      formattedValue = address.pOBox
        ? this.props.intl.formatMessage(messages.labelPOBox, {
            value: address.pOBox,
          })
        : formatEmployeeAddress(address);

    if (
      ['city', 'postalCode', 'region', 'state', 'country'].includes(columnKey)
    )
      formattedValue = address[columnKey];

    return formattedValue;
  };

  handleCellHeightChange = () => {
    if (this.tableMeasureCache) this.tableMeasureCache.clearAll();
  };

  render() {
    return (
      <TabContentLayout
        header={
          this.props.canManageEmployees && (
            <div className={styles['push-right']}>
              <SecondaryButton
                iconLeft={<PlusBoldIcon />}
                label={this.props.intl.formatMessage(
                  messages.addAddressButtonLabel
                )}
                linkTo={`${this.props.addressListPath}/new`}
              />
            </div>
          )
        }
        description={this.props.canManageEmployees && <ManageMessage />}
        data-track-component="EmployeesAddresses"
      >
        {do {
          if (this.props.employeeFetcher.isLoading) <LoadingSpinner />;
          else if (!this.props.employeeFetcher.employee) <PageNotFound />;
          else if (this.props.employeeFetcher.employee.addresses.length > 0)
            <Table
              columns={createColumnsDefinition(
                this.props.employeeFetcher.employee.addresses,
                this.props.employeeFetcher.employee.defaultShippingAddressId,
                this.props.employeeFetcher.employee.defaultBillingAddressId
              )}
              items={this.props.employeeFetcher.employee.addresses}
              rowCount={this.props.employeeFetcher.employee.addresses.length}
              itemRenderer={this.renderAddressesRow}
              onRowClick={(e, index) => this.redirectToAddress(index)}
              shouldFillRemainingVerticalSpace={true}
              defaultHeight={475}
              registerMeasurementCache={this.registerMeasurementCache}
            />;
          else {
            <div className={styles['empty-results']}>
              <Spacings.Stack scale="xs">
                <FormattedMessage {...messages.noAddressesTitle} />
                {this.props.canManageEmployees && (
                  <LinkButton
                    to={`${this.props.addressListPath}/new`}
                    label={this.props.intl.formatMessage(
                      messages.noAddressesDescriptionLink
                    )}
                  />
                )}
              </Spacings.Stack>
            </div>;
          }
        }}
        {this.props.children}
        <PageBottomSpacer />
      </TabContentLayout>
    );
  }
}

export default flowRight(
  injectIntl,
  injectAuthorized(
    [PERMISSIONS.ManageEmployees],
    {
      dataFences: [DATA_FENCES.store.ManageEmployees],
      getSelectDataFenceData: ownProps =>
        createSelectEmployeeDataFenceData({
          employee: ownProps.employeeFetcher.employee,
        }),
    },
    'canManageEmployees'
  )
)(AddressesList);
