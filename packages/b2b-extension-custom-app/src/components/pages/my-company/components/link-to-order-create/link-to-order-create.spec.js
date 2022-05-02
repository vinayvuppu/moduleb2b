import React from 'react';
import {
  renderApp,
  wait,
  fireEvent,
} from '@commercetools-frontend/application-shell/test-utils';
import { allTestPermissions } from '../../../../test-utils/permissions';
import LinkToOrderCreate from './link-to-order-create';

const createTestProps = props => ({
  projectKey: 'test-project-key',
  ...props,
});

const render = (options = {}) => {
  return renderApp(<LinkToOrderCreate {...options.props} />, {
    permissions: allTestPermissions,
    ...options,
  });
};

describe('when authorized', () => {
  let props;
  beforeEach(() => {
    props = createTestProps();
  });

  it('should allow adding an order', async () => {
    const rendered = render({ props });

    expect(rendered.queryByText(/Add order/i)).toBeInTheDocument();

    expect(rendered.queryByLabelText(/Add order/i)).not.toHaveAttribute(
      'disabled'
    );

    const addOrderButton = rendered.queryByLabelText(/Add order/i);

    fireEvent.click(addOrderButton);

    await wait(() => {
      expect(rendered.history.location.pathname).toBe(
        '/test-project-key/b2b-extension/my-company/orders/new'
      );
    });
  });
});

describe('when not authorized', () => {
  let props;
  beforeEach(() => {
    props = createTestProps();
  });

  it('should not allow adding an order', async () => {
    const rendered = render({
      props,
      permissions: { ...allTestPermissions, canManageOrders: false },
    });

    expect(rendered.queryByText(/Add order/i)).toBeInTheDocument();

    expect(rendered.queryByLabelText(/Add order/i)).toHaveAttribute('disabled');

    const addOrderButton = rendered.queryByLabelText(/Add order/i);

    fireEvent.click(addOrderButton);

    await wait(() => {
      expect(rendered.history.location.pathname).not.toBe(
        '/test-project-key/orders/new'
      );
      expect(rendered.history.location.pathname).toBe('/');
    });
  });
});
