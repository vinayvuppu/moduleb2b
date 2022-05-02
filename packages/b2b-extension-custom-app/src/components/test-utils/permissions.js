import { PERMISSIONS } from '../../constants';

// eslint-disable-next-line import/prefer-default-export
export const allTestPermissions = Object.keys(PERMISSIONS).reduce(
  (permissionsMap, permissionKey) => ({
    ...permissionsMap,
    [`can${permissionKey}`]: true,
  }),
  {}
);
