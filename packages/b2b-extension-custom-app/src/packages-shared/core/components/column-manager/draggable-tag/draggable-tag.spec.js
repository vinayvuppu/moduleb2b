import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { renderApp } from '@commercetools-frontend/application-shell/test-utils';
import DraggableTag from './draggable-tag';

const createTestProps = props => ({
  index: 0,
  column: {
    key: 'column1',
    label: 'Column 1',
  },
  onRemoveColumn: jest.fn(),
  ...props,
});

it('should render the column tag when rendering a column', () => {
  const props = createTestProps({
    column: {
      key: 'column',
      label: 'Column',
    },
  });
  const rendered = renderApp(
    <DragDropContext>
      <Droppable droppableId="droppableId">
        {provided => (
          <div ref={provided.innerRef}>
            <DraggableTag {...props} />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  // should render the column tag
  rendered.getByText(/column/i);

  // with a drag icon
  rendered.getByTestId('drag-icon');
});
