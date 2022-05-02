import React from 'react';
import {
  renderApp,
  wait,
  waitForElement,
  fireEvent,
} from '@commercetools-frontend/application-shell/test-utils';
import CustomViewDeleteModal from './custom-view-delete-modal';

const createTestProps = customProps => ({
  isOpen: true,
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
  view: {
    name: { en: 'My view' },
  },
  ...customProps,
});

describe('rendering', () => {
  it('should render nothing if dialog is not open', async () => {
    const props = createTestProps({ isOpen: false });
    const { queryByText } = renderApp(<CustomViewDeleteModal {...props} />);
    await wait(
      () => {
        expect(queryByText('Save as new View')).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('should confirm deletion', async () => {
    const props = createTestProps();
    const { getByText, getByLabelText } = renderApp(
      <CustomViewDeleteModal {...props} />
    );

    await waitForElement(() => getByText('Delete View'));
    await waitForElement(() =>
      getByText('Are you sure you want to delete my view "My view"?')
    );

    fireEvent.click(getByLabelText('Confirm', { exact: false }));

    await wait(() => {
      expect(props.onConfirm).toHaveBeenCalled();
    });
  });
});
