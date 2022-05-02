import React from 'react';
import {
  renderApp,
  fireEvent,
  within,
} from '@commercetools-frontend/application-shell/test-utils';
import ColumnManager from './column-manager';

const createTestProps = props => ({
  availableColumns: [],
  selectedColumns: [],
  onUpdateColumns: jest.fn(),
  ...props,
});

it('should render expand button when the column manager is collapsed', () => {
  const props = createTestProps();
  const rendered = renderApp(<ColumnManager {...props} />);

  rendered.getByLabelText(/expand column manager/i);
});

it('should render collapse button when the column manager is expanded', () => {
  const props = createTestProps();
  const rendered = renderApp(<ColumnManager {...props} />);

  // expand column manager
  fireEvent.click(rendered.getByLabelText(/expand column manager/i));

  rendered.getByLabelText(/collapse column manager/i);
});

it('should render hidden and visible droppable panels', () => {
  const props = createTestProps();
  const rendered = renderApp(<ColumnManager {...props} />);

  // expand column manager
  fireEvent.click(rendered.getByLabelText(/expand column manager/i));

  rendered.getByText(/^hidden columns$/i);
  rendered.getByText(/^visible columns$/i);
});

it('should hidden columns be the available columns which are not visible', () => {
  const props = createTestProps({
    availableColumns: [
      {
        key: 'column1',
        label: 'Column 1',
      },
      {
        key: 'column2',
        label: 'Column 2',
      },
      {
        key: 'column3',
        label: 'Column 3',
      },
      {
        key: 'column4',
        label: 'Column 4',
      },
    ],
    selectedColumns: [
      {
        key: 'column1',
        label: 'Column 1',
      },
      {
        key: 'column3',
        label: 'Column 3',
      },
    ],
  });
  const rendered = renderApp(<ColumnManager {...props} />);

  const hiddenColumnsPanel = rendered.getByTestId('hidden-columns-panel');

  // hidden columns should only be column2 and column4
  within(hiddenColumnsPanel).getByText(/column 2/i);
  within(hiddenColumnsPanel).getByText(/column 4/i);
  expect(
    within(hiddenColumnsPanel).queryByText(/column 1/i)
  ).not.toBeInTheDocument();
  expect(
    within(hiddenColumnsPanel).queryByText(/column 3/i)
  ).not.toBeInTheDocument();
});

it('should be possible to remove only visible columns', () => {
  // columns 1 and 2 are visible, column 3 is hidden
  const props = createTestProps({
    availableColumns: [
      {
        key: 'column1',
        label: 'Column 1',
      },
      {
        key: 'column2',
        label: 'Column 2',
      },
      {
        key: 'column3',
        label: 'Column 3',
      },
    ],
    selectedColumns: [
      {
        key: 'column1',
        label: 'Column 1',
      },
      {
        key: 'column2',
        label: 'Column 2',
      },
    ],
    onUpdateColumns: jest.fn(),
  });
  const rendered = renderApp(<ColumnManager {...props} />);

  // should not be possible to remove hidden column 3
  const hiddenColumnsPanel = rendered.getByTestId('hidden-columns-panel');
  within(hiddenColumnsPanel).getByText(/column 3/i);
  expect(
    within(hiddenColumnsPanel).queryByLabelText(/remove/i)
  ).not.toBeInTheDocument();

  // should be possible to remove visible columns 1 and 2
  const visibleColumnsPanel = rendered.getByTestId('selected-columns-panel');
  within(visibleColumnsPanel).getByText(/column 1/i);
  within(visibleColumnsPanel).getByText(/column 2/i);
  const removeButtons = within(visibleColumnsPanel).getAllByLabelText(
    /remove/i
  );
  expect(removeButtons.length).toBe(2);

  // should onUpdateColumns being invoked with the new visible columns when
  // removing a visible column, in this case column 2 will be removed therefore
  // column 1 should be the new visible column
  fireEvent.click(removeButtons[1]);
  expect(props.onUpdateColumns).toHaveBeenCalledWith([
    {
      key: 'column1',
      label: 'Column 1',
    },
  ]);
});
