import React from 'react';
import { renderAppWithRedux } from '@commercetools-frontend/application-shell/test-utils';
import CompanyOrdersListCustomViewsConnector from '../company-orders-list-custom-views-connector';
import { CompanyOrdersViewLayout } from './company-orders-view-layout';

const total = 10;
const projectKey = 'test-project-key';

const testRender = (
  renderOptions = { areSavedOrdersListViewsEnabled: false }
) =>
  renderAppWithRedux(
    <CompanyOrdersListCustomViewsConnector.Provider
      projectKey={projectKey}
      areSavedOrdersListViewsEnabled={
        renderOptions.areSavedOrdersListViewsEnabled
      }
    >
      <CompanyOrdersViewLayout projectKey={projectKey} total={total}>
        Test children
      </CompanyOrdersViewLayout>
    </CompanyOrdersListCustomViewsConnector.Provider>,
    {
      ...renderOptions,
      environment: {
        disableMcSettings: !renderOptions.areSavedOrdersListViewsEnabled,
      },
    }
  );

it('should show actions for view layout', () => {
  const rendered = testRender();

  expect(rendered.queryByText(/Test children/)).toBeInTheDocument();
  expect(rendered.queryByText(/10 results/)).toBeInTheDocument();
  expect(rendered.queryByText(/Add order/)).toBeInTheDocument();
  expect(rendered.queryByText(/Company orders/)).toBeInTheDocument();
});
