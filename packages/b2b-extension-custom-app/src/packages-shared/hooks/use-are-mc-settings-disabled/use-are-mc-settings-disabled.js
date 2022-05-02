import React from 'react';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

const useAreMcSettingsDisabled = () => {
  const areMcSettingsDisabled = useApplicationContext(context => {
    const disableMcSettings = context.environment?.disableMcSettings;

    return disableMcSettings === true || disableMcSettings === 'true';
  });

  React.useDebugValue(
    `MC Settings are ${areMcSettingsDisabled ? 'disabled' : 'enabled'}`
  );

  return areMcSettingsDisabled;
};

export default useAreMcSettingsDisabled;
