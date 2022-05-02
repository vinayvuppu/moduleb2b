import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Spacings, Text } from '@commercetools-frontend/ui-kit';
import formatCustomerAddress from '@commercetools-local/utils/customer/format-customer-address';
import messages from './messages';

const fallbackAddressField = field => field || '-';

const AddressSummary = props => (
  <Spacings.Inline scale="m">
    <Spacings.Stack>
      <Text.Detail isBold={true}>
        <FormattedMessage {...messages.addressFirstNameLabel} />
      </Text.Detail>
      <Text.Detail isBold={true}>
        <FormattedMessage {...messages.addressLastNameLabel} />
      </Text.Detail>
      <Text.Detail isBold={true}>
        <FormattedMessage {...messages.addressPhoneLabel} />
      </Text.Detail>
      <Text.Detail isBold={true}>
        <FormattedMessage {...messages.addressEmailLabel} />
      </Text.Detail>
      <Text.Detail isBold={true}>
        <FormattedMessage {...messages.addressCompanyNameLabel} />
      </Text.Detail>
      <Text.Detail isBold={true}>
        <FormattedMessage {...messages.addressStreetLabel} />
      </Text.Detail>
      <Text.Detail isBold={true}>
        <FormattedMessage {...messages.addressCityLabel} />
      </Text.Detail>
      <Text.Detail isBold={true}>
        <FormattedMessage {...messages.addressPostalCodeLabel} />
      </Text.Detail>
      <Text.Detail isBold={true}>
        <FormattedMessage {...messages.addressRegionLabel} />
      </Text.Detail>
      <Text.Detail isBold={true}>
        <FormattedMessage {...messages.addressCountryLabel} />
      </Text.Detail>
      <Text.Detail isBold={true}>
        <FormattedMessage
          {...messages.addressAdditionalStreetInformationLabel}
        />
      </Text.Detail>
      <Text.Detail isBold={true}>
        <FormattedMessage {...messages.addressAdditionalInformationLabel} />
      </Text.Detail>
    </Spacings.Stack>
    <Spacings.Stack>
      <Text.Detail>{fallbackAddressField(props.address.firstName)}</Text.Detail>
      <Text.Detail>{fallbackAddressField(props.address.lastName)}</Text.Detail>
      <Text.Detail>
        {fallbackAddressField(props.address.phone)}
      </Text.Detail>
      <Text.Detail>
        {fallbackAddressField(props.address.email)}
      </Text.Detail>
      <Text.Detail>{fallbackAddressField(props.address.company)}</Text.Detail>
      <Text.Detail>
        {formatCustomerAddress({
          streetName: props.address.streetName,
          streetNumber: props.address.streetNumber,
        })}
      </Text.Detail>
      <Text.Detail>{fallbackAddressField(props.address.city)}</Text.Detail>
      <Text.Detail>
        {fallbackAddressField(props.address.postalCode)}
      </Text.Detail>
      <Text.Detail>
        {props.address.region
          ? fallbackAddressField(props.address.region)
          : fallbackAddressField(props.address.state)}
      </Text.Detail>
      <Text.Detail>{fallbackAddressField(props.address.country)}</Text.Detail>
      <Text.Detail>
        {fallbackAddressField(props.address.additionalStreetInfo)}
      </Text.Detail>
      <Text.Detail>
        {fallbackAddressField(props.address.additionalAddressInfo)}
      </Text.Detail>
    </Spacings.Stack>
  </Spacings.Inline>
);

AddressSummary.displayName = 'AddressSummary';
AddressSummary.propTypes = {
  address: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    company: PropTypes.string,
    streetName: PropTypes.string,
    streetNumber: PropTypes.string,
    postalCode: PropTypes.string,
    city: PropTypes.string,
    region: PropTypes.string,
    state: PropTypes.string,
    country: PropTypes.string.isRequired,
    additionalStreetInfo: PropTypes.string,
    additionalAddressInfo: PropTypes.string,
  }).isRequired,
};

export default AddressSummary;
