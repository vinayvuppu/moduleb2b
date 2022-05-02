// A dependant flag configured in LaunchDarkly, which
// depends on the state of the PIM_SEARCH flag, where it
// serves the opposite of the state of the PIM_SEARCH flag
// e.g. if PIM_SEARCH is `true`, LEGACY_PRODUCT_LIST will serve `false` and vice-versa
export const LEGACY_PRODUCT_LIST = 'legacyProductList';
export const CAN_VIEW_DASHBOARD = 'canViewDashboard';

// Defaulted through the `allFeatureToggles` query in the mc-http-proxy
export const PIM_SEARCH = 'pimSearch';
export const CUSTOM_APPLICATIONS = 'customApplications';

export default {
  [CAN_VIEW_DASHBOARD]: true,
  [LEGACY_PRODUCT_LIST]: true,
};
