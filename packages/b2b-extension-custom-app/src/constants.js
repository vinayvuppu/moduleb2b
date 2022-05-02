export const PERMISSIONS = {
  ManageProducts: 'ManageProducts',
  ViewProducts: 'ViewProducts',
  ViewCompanies: 'ViewCustomerGroups',
  ManageCompanies: 'ManageCustomerGroups',
  ViewEmployees: 'ViewCustomers',
  ManageEmployees: 'ManageCustomers',
  ViewOrders: 'ViewOrders',
  ManageOrders: 'ManageOrders',
};

export const FEATURE_FLAGS = {};

export const DATA_FENCES = {
  store: {
    ViewEmployees: {
      type: 'store',
      group: 'customers',
      name: 'ViewCustomers',
    },
    ManageEmployees: {
      type: 'store',
      group: 'customers',
      name: 'ManageCustomers',
    },
    // For CustomerDetailsOrdersTab
    ViewOrders: {
      type: 'store',
      group: 'orders',
      name: 'ViewOrders',
    },
    ManageOrders: {
      type: 'store',
      group: 'orders',
      name: 'ManageOrders',
    },
  },
};
