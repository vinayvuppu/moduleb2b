import React from 'react';
import {
  renderApp,
  waitForElement,
} from '@commercetools-frontend/application-shell/test-utils';
import useIsApplicationDisabled from './use-is-application-disabled';

const TestComponent = () => {
  const isApplicationDisabled = useIsApplicationDisabled('testApplication');

  return (
    <ul>
      <li>Disabled: {isApplicationDisabled ? 'Yes' : 'No'}</li>
    </ul>
  );
};

describe('when application is disabled', () => {
  it('should indicate that application is disabled', async () => {
    const { getByText } = renderApp(<TestComponent />, {
      environment: {
        disabledMenuItems: ['testApplication'],
      },
    });

    await waitForElement(() => getByText(/Disabled: Yes/));
  });
});

describe('when application is not disabled', () => {
  it('should indicate that application is not disabled', async () => {
    const { getByText } = renderApp(<TestComponent />, {
      environment: {
        disabledMenuItems: ['testApplicationB'],
      },
    });

    await waitForElement(() => getByText(/Disabled: No/));
  });
});
