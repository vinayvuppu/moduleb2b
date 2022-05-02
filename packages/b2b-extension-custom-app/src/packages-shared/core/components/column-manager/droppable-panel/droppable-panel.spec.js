import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { renderApp } from '@commercetools-frontend/application-shell/test-utils';
import DroppablePanel from './droppable-panel';

const createTestProps = props => ({
  droppableId: 'selected-columns-panel',
  noColumnsText: 'No columns to show',
  columns: [],
  ...props,
});

const render = (ui, renderOptions) =>
  renderApp(<DragDropContext>{ui}</DragDropContext>, renderOptions);

it('should render column tags when there are columns', () => {
  const props = createTestProps({
    droppableId: 'hidden-columns-panel',
    columns: [
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
    noColumnsText: 'No columns to show',
  });
  const rendered = render(<DroppablePanel {...props} />);

  // should not render "no items" message
  expect(rendered.queryByText(/no columns to show/i)).not.toBeInTheDocument();

  // should render column tags
  rendered.getByText(/column 1/i);
  rendered.getByText(/column 2/i);
  rendered.getByText(/column 3/i);
});

it('should not render columns tags when there are no columns', () => {
  const props = createTestProps({
    columns: [],
    noColumnsText: 'No columns to show',
  });
  const rendered = render(<DroppablePanel {...props} />);

  rendered.getByText(/no columns to show/i);
});
