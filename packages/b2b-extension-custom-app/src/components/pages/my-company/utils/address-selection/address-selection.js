import formatCustomerAddress from '@commercetools-local/utils/customer/format-customer-address';

/*
 * Function for handling the default selection of addresses and pass them
 * to the cartDraft. In case there are no addresses defined, we asure that we
 * pass always an empty object.
 */
export function selectDefaultAddress(customer) {
  return {
    billingAddress:
      customer.addresses.find(
        address => address.id === customer.defaultBillingAddress
      ) || (customer.addresses.length > 0 ? customer.addresses[0] : {}),
    shippingAddress:
      customer.addresses.find(
        address => address.id === customer.defaultShippingAddress
      ) || (customer.addresses.length > 0 ? customer.addresses[0] : {}),
  };
}

/*
 * Function for handling the selection of addresses and pass to the correct one
 * to the action creator depending on the address type
 */
export function selectAddress(type, addressId, customer) {
  return type === 'shipping'
    ? {
        shippingAddress: customer.addresses.find(
          address => address.id === addressId
        ),
      }
    : {
        billingAddress: customer.addresses.find(
          address => address.id === addressId
        ),
      };
}

/*
 * Function for handling the option of "Same as billing address". In case the
 * option is checked both address would be the same, in the other hand if the
 * option is unchecked, the billing address would be set to the default one in case
 * the customer has one setted and if not the first one would be picked
 */
export function selectSameAddress(isSameAsBillingAddress, cartDraft, customer) {
  return isSameAsBillingAddress
    ? {
        shippingAddress: cartDraft.shippingAddress,
        billingAddress: cartDraft.shippingAddress,
      }
    : {
        shippingAddress: cartDraft.shippingAddress,
        billingAddress:
          customer.addresses.find(
            address => address.id === customer.defaultBillingAddressId
          ) || customer.addresses[0],
      };
}

/*
 * Function for formatting the title of the address
 */
export function formatTitleAddress(address) {
  let title = [];

  if (address.streetName) {
    title = [formatCustomerAddress(address), ...title];
  }

  if (address.city) {
    title = [address.city, ...title];
  }

  if (address.region) {
    title = [address.region, ...title];
  }

  if (address.postalCode) {
    title = [address.postalCode, ...title];
  }

  if (address.country) {
    title = [address.country, ...title];
  }
  return title.reverse().join(', ');
}
