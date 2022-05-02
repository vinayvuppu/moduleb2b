import React from 'react';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

const useIsApplicationDisabled = applicationName => {
  const isApplicationDisabled = useApplicationContext(
    context =>
      context.environment.disabledMenuItems &&
      context.environment.disabledMenuItems.includes(applicationName)
  );

  React.useDebugValue(
    `${applicationName} is ${isApplicationDisabled ? 'disabled' : 'enabled'}`
  );

  return isApplicationDisabled;
};

export default useIsApplicationDisabled;
