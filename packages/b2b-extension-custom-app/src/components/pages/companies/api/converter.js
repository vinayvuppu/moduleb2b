// eslint-disable-next-line import/prefer-default-export
export const cleanDefaultShippingAndBilling = ({
  addresses = [],
  defaultShippingAddress,
  defaultBillingAddress,
  ...companyDraft
}) => {
  const isDefaultShippingToRemove = !addresses.find(
    address => address.id === defaultShippingAddress
  );
  const isDefaultBillingToRemove = !addresses.find(
    address => address.id === defaultBillingAddress
  );

  return {
    ...(addresses.length && { addresses }),
    ...(!isDefaultShippingToRemove && { defaultShippingAddress }),
    ...(!isDefaultBillingToRemove && { defaultBillingAddress }),
    ...companyDraft,
  };
};
