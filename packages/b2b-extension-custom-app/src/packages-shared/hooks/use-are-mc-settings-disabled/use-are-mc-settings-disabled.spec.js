import React from 'react';
import {
  renderApp,
  waitForElement,
} from '@commercetools-frontend/application-shell/test-utils';
import useAreMcSettingsDisabled from './use-are-mc-settings-disabled';

const TestComponent = () => {
  const areMcSettingsDisabled = useAreMcSettingsDisabled();

  return (
    <ul>
      <li>Disabled: {areMcSettingsDisabled ? 'Yes' : 'No'}</li>
    </ul>
  );
};

describe('when user settings are disabled', () => {
  it('should indicate that settings are disabld', async () => {
    const { getByText } = renderApp(<TestComponent />, {
      environment: {
        disableMcSettings: true,
      },
    });

    await waitForElement(() => getByText(/Disabled: Yes/));
  });
});

describe('when user settings are not disabled', () => {
  it('should indicate that user settings are not', async () => {
    const { getByText } = renderApp(<TestComponent />, {
      environment: {
        disableMcSettings: false,
      },
    });

    await waitForElement(() => getByText(/Disabled: No/));
  });
});
