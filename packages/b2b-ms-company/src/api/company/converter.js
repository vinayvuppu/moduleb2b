const uuidv1 = require('uuid/v1');

const container = 'company';

module.exports.addressesDraftToAddresses = addresses =>
  addresses &&
  addresses.map(address => ({ ...address, id: address.id || uuidv1() }));

module.exports.containerToCompany = ({
  value,
  createdAt,
  lastModifiedAt,
  key
}) => ({
  id: key,
  name: value.name,
  customerGroup: value.customerGroup,
  store: value.store,
  addresses: value.addresses || [],
  budget: value.budget || [],
  ...(value.logo && { logo: value.logo }),
  requiredApprovalRoles: value.requiredApprovalRoles || [],
  approverRoles: value.approverRoles || [],
  ...(value.defaultShippingAddress && {
    defaultShippingAddress: value.defaultShippingAddress
  }),
  ...(value.defaultBillingAddress && {
    defaultBillingAddress: value.defaultBillingAddress
  }),
  channels: value.channels || [],
  rules: value.rules || [],
  createdAt,
  lastModifiedAt
});

module.exports.companyToContainer = company => ({
  container,
  key: company.id,
  value: {
    name: company.name,
    customerGroup: {
      typeId: 'customer-group',
      key: company.id
    },
    store: {
      typeId: 'store',
      key: company.id
    },
    approverRoles: company.approverRoles,
    addresses: this.addressesDraftToAddresses(company.addresses) || [],
    budget: company.budget || [],
    requiredApprovalRoles: company.requiredApprovalRoles || [],
    channels: company.channels || [],

    ...(company.logo && { logo: company.logo }),
    ...(company.defaultShippingAddress && {
      defaultShippingAddress: company.defaultShippingAddress
    }),
    ...(company.defaultBillingAddress && {
      defaultBillingAddress: company.defaultBillingAddress
    }),
    rules: company.rules || []
  }
});
