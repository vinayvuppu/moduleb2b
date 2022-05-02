import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Draggable } from 'react-beautiful-dnd';
import { DragIcon, Tag, Spacings } from '@commercetools-frontend/ui-kit';
import styles from './draggable-tag.mod.css';

const portal = document.createElement('div');
portal.classList.add('dnd-portal');
document.body.appendChild(portal);

const DraggableTag = React.memo(({ column, index, onRemoveColumn }) => {
  const handleRemoveColumn = () => onRemoveColumn(index);

  return (
    <Draggable draggableId={column.key} index={index}>
      {(provided, snapshot) => {
        const child = (
          <Spacings.Inset scale="xs">
            <div
              ref={provided.innerRef}
              className={styles.dragging}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Tag onRemove={onRemoveColumn ? handleRemoveColumn : undefined}>
                <Spacings.Inline alignItems="center">
                  <DragIcon data-testid="drag-icon" size="medium" />
                  {column.label}
                </Spacings.Inline>
              </Tag>
            </div>
            {provided.placeholder}
          </Spacings.Inset>
        );
        if (!snapshot?.isDragging) {
          return child;
        }

        return ReactDOM.createPortal(child, portal);
      }}
    </Draggable>
  );
});

DraggableTag.displayName = 'DraggableTag';
DraggableTag.propTypes = {
  column: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onRemoveColumn: PropTypes.func,
};

export default DraggableTag;
