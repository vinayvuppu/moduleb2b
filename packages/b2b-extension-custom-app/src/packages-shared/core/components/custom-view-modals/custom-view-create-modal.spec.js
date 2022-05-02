import React from 'react';
import {
  renderApp,
  wait,
  waitForElement,
  fireEvent,
} from '@commercetools-frontend/application-shell/test-utils';
import CustomViewCreateModal from './custom-view-create-modal';

const createTestProps = customProps => ({
  isOpen: true,
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
  draft: {},
  ...customProps,
});

describe('rendering', () => {
  it('should render nothing if dialog is not open', async () => {
    const props = createTestProps({ isOpen: false });
    const { queryByText } = renderApp(<CustomViewCreateModal {...props} />);
    await wait(
      () => {
        expect(queryByText('Save as new View')).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('should fill out form and save the new view', async () => {
    const props = createTestProps();
    const { getByTestId, getByText, getByLabelText, queryByTestId } = renderApp(
      <CustomViewCreateModal {...props} />
    );

    await waitForElement(() => getByText('Save as new View'));

    fireEvent.change(getByLabelText('Name', { exact: false }), {
      target: { value: 'My view name' },
    });

    await wait(() => {
      expect(
        queryByTestId('custom-view-create-modal-button-save')
      ).not.toHaveAttribute('disabled');
    });

    fireEvent.click(getByTestId('custom-view-create-modal-button-save'));

    await wait(() => {
      expect(props.onConfirm).toHaveBeenCalledWith({
        name: expect.objectContaining({ en: 'My view name' }),
      });
    });
  });
});
