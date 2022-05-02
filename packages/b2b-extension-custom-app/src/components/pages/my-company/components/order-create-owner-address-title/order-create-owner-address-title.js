import PropTypes from 'prop-types';
import React from 'react';
import {
  TruckIcon,
  PaperBillInvertedIcon,
  RadioInput,
  Spacings,
  Text,
} from '@commercetools-frontend/ui-kit';
import formatEmployeeName from '@commercetools-local/utils/customer/format-customer-name';
import { formatTitleAddress } from '../../utils/address-selection';

const OrderCreateOwnerAddressTitle = ({
  cartDraft,
  type,
  address,
  employee,
  onSelectAddress,
  isDisabled,
}) => (
  <Spacings.Inline alignItems="center">
    <RadioInput.Option
      value={`${address.id}-checkbox`}
      isChecked={
        type === 'shipping'
          ? address.id === cartDraft.shippingAddress.id
          : address.id === cartDraft.billingAddress.id
      }
      isDisabled={isDisabled}
      onChange={() => onSelectAddress(type, address.id)}
    >
      {''}
    </RadioInput.Option>
    {address.firstName && address.lastName && (
      <Text.Body isBold={true}>{formatEmployeeName(address)}</Text.Body>
    )}
    <Text.Detail tone="secondary">
      {formatTitleAddress(address) || ' '}
    </Text.Detail>
    {address.id === employee.defaultBillingAddressId && (
      <PaperBillInvertedIcon size="medium" color="info" />
    )}
    {address.id === employee.defaultShippingAddressId && (
      <TruckIcon size="medium" color="info" />
    )}
  </Spacings.Inline>
);

OrderCreateOwnerAddressTitle.propTypes = {
  cartDraft: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  address: PropTypes.object.isRequired,
  employee: PropTypes.object.isRequired,
  onSelectAddress: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

OrderCreateOwnerAddressTitle.displayName = 'OrderCreateOwnerAddressTitle';

export default OrderCreateOwnerAddressTitle;
