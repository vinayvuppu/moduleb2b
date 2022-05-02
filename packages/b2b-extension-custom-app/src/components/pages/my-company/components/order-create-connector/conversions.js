import pick from 'lodash.pick';

export const addressToDoc = address =>
  address
    ? {
        id: address.id,
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        mobile: address.mobile,
        fax: address.fax,
        email: address.email,
        company: address.company,
        streetName: address.streetName,
        streetNumber: address.streetNumber,
        city: address.city,
        postalCode: address.postalCode,
        region: address.region,
        country: address.country,
        additionalAddressInfo: address.additionalAddressInfo,
        additionalStreetInfo: address.additionalStreetInfo,
      }
    : undefined;

export const cartDraftToDoc = cartDraft => ({
  ...cartDraft,
  shippingAddress: addressToDoc(cartDraft.shippingAddress),
  billingAddress: addressToDoc(cartDraft.billingAddress),
});

export const cartDraftToOrderCartCommand = cartDraft =>
  pick(cartDraft, [
    'id',
    'version',
    'paymentState',
    'orderState',
    'state',
    'shipmentState',
    'orderNumber',
  ]);
