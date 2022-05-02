import React from 'react';
import PropTypes from 'prop-types';
import {
  Spacings,
  Card,
  Text,
  TruckIcon,
  PaperBillInvertedIcon,
} from '@commercetools-frontend/ui-kit';

import styles from './AddressSimpleDetailsCard.mod.css';
import messages from './messages';

const AddressSimpleDetailsCard = ({ type, address }) => {
  return (
    <Card className={styles.card}>
      <Spacings.Stack>
        {type === 'shipping' ? (
          <Spacings.Inline>
            <Text.Subheadline as="h4" intlMessage={messages.shippingLabelTo} />
            <TruckIcon />
          </Spacings.Inline>
        ) : (
          <Spacings.Inline>
            <Text.Subheadline as="h4" intlMessage={messages.billingLabelTo} />
            <PaperBillInvertedIcon />
          </Spacings.Inline>
        )}
        <Spacings.Inline justifyContent="space-between">
          <Text.Detail intlMessage={messages.nameLabel} />
          <Text.Detail>{address.streetName || '-'}</Text.Detail>
        </Spacings.Inline>
        <Spacings.Inline justifyContent="space-between">
          <Text.Detail intlMessage={messages.addressLabel} />
          <Text.Detail>{address.streetNumber || '-'}</Text.Detail>
        </Spacings.Inline>
        <Spacings.Inline justifyContent="space-between">
          <Text.Detail intlMessage={messages.additionStreetInformationLabel} />
          <Text.Detail>{address.additionalStreetInfo || '-'}</Text.Detail>
        </Spacings.Inline>
        <Spacings.Inline justifyContent="space-between">
          <Text.Detail intlMessage={messages.cityLabel} />
          <Text.Detail>{address.city || '-'}</Text.Detail>
        </Spacings.Inline>
        <Spacings.Inline justifyContent="space-between">
          <Text.Detail intlMessage={messages.postalCodeLabel} />
          <Text.Detail>{address.postalCode || '-'}</Text.Detail>
        </Spacings.Inline>
        <Spacings.Inline justifyContent="space-between">
          <Text.Detail intlMessage={messages.countryLabel} />
          <Text.Detail>{address.country}</Text.Detail>
        </Spacings.Inline>
        <Spacings.Inline justifyContent="space-between">
          <Text.Body intlMessage={messages.additionAddressInformationLabel} />
          <Text.Body>{address.additionalAddressInfo || '-'}</Text.Body>
        </Spacings.Inline>
      </Spacings.Stack>
    </Card>
  );
};

AddressSimpleDetailsCard.displayName = 'AddressSimpleDetailsCard';

AddressSimpleDetailsCard.propTypes = {
  type: PropTypes.oneOf(['shipping', 'billing']),
  address: PropTypes.shape({
    streetName: PropTypes.string,
    streetNumber: PropTypes.string,
    additionalStreetInfo: PropTypes.string,
    city: PropTypes.string,
    postalCode: PropTypes.string,
    country: PropTypes.string.isRequired,
    additionalAddressInfo: PropTypes.string,
  }),
};

export default AddressSimpleDetailsCard;
