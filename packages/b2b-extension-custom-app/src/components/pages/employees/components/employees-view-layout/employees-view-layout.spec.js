import React from 'react';
import { renderAppWithRedux } from '@commercetools-frontend/application-shell/test-utils';
import EmployeesListCustomViewsConnector from '../employees-list-custom-views-connector';
import { EmployeesViewLayout } from './employees-view-layout';

const total = 10;
const projectKey = 'test-project-key';

const testRender = (
  renderOptions = { areSavedEmployeesListViewsEnabled: false }
) =>
  renderAppWithRedux(
    <EmployeesListCustomViewsConnector.Provider
      projectKey={projectKey}
      areSavedEmployeesListViewsEnabled={
        renderOptions.areSavedEmployeesListViewsEnabled
      }
    >
      <EmployeesViewLayout projectKey={projectKey} total={total}>
        Test children
      </EmployeesViewLayout>
    </EmployeesListCustomViewsConnector.Provider>,
    {
      ...renderOptions,
      environment: {
        disableMcSettings: !renderOptions.areSavedEmployeesListViewsEnabled,
      },
    }
  );

it('should show actions for view layout', () => {
  const rendered = testRender();

  expect(rendered.queryByText(/Add employee/)).toBeInTheDocument();
  expect(rendered.queryByText(/Test children/)).toBeInTheDocument();
  expect(rendered.queryByText(/10 results/)).toBeInTheDocument();
});
