import parser from '../company-form/parser.pegjs';

export const docToFormValues = doc => {
  return {
    id: doc.id,
    name: doc.name,
    logo: doc.logo,
    channels: doc.channels,
    addresses: doc.addresses,
    budget: doc.budget || [],
    approverRoles: doc.approverRoles,
    defaultShippingAddress: doc.defaultShippingAddress,
    defaultBillingAddress: doc.defaultBillingAddress,
    requiredApprovalRoles: doc.requiredApprovalRoles,
    rules: doc.rules && doc.rules.length ? doc.rules : [],
  };
};

export const formValuesToDoc = ({ rules, ...rest }) => {
  return {
    ...rest,
    rules:
      rules && rules.length
        ? rules.map(rule => ({
            value: rule.value,
            name: rule.name,
            parsedValue: JSON.stringify(parser.parse(rule.value)),
          }))
        : undefined,
  };
};
