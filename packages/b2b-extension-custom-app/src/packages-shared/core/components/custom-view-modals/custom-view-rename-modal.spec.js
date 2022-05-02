import React from 'react';
import {
  renderApp,
  wait,
  waitForElement,
  fireEvent,
} from '@commercetools-frontend/application-shell/test-utils';
import CustomViewRenameModal from './custom-view-rename-modal';

const createTestProps = customProps => ({
  isOpen: true,
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
  draft: { name: { en: 'My old name' } },
  ...customProps,
});

describe('rendering', () => {
  it('should render nothing if dialog is not open', async () => {
    const props = createTestProps({ isOpen: false });
    const { queryByText } = renderApp(<CustomViewRenameModal {...props} />);
    await wait(
      () => {
        expect(queryByText('Save as new View')).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('should fill out form and save the view', async () => {
    const props = createTestProps();
    const { getByText, queryByLabelText, getByLabelText } = renderApp(
      <CustomViewRenameModal {...props} />
    );

    await waitForElement(() => getByText('Rename View'));

    fireEvent.change(getByLabelText(/^Name/i), {
      target: { value: 'My new view name' },
    });

    await wait(() => {
      expect(queryByLabelText('Save', { exact: false })).not.toHaveAttribute(
        'disabled'
      );
    });

    fireEvent.click(getByLabelText('Save', { exact: false }));

    await wait(() => {
      expect(props.onConfirm).toHaveBeenCalledWith({
        name: expect.objectContaining({ en: 'My new view name' }),
      });
    });
  });
});
