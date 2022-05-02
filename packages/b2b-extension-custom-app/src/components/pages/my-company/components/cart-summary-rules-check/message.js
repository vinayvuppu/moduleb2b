import { defineMessages } from 'react-intl';

export default defineMessages({
  rulesMatch: {
    id: 'CartSummaryRulesCheck.rulesMatch',
    defaultMessage:
      'You will require approval because the order does not satisfy company rules: "{name}"',
  },
  noApproval: {
    id: 'CartSummaryRulesCheck.noApproval',
    defaultMessage: "User doesn't need approval",
  },
});
