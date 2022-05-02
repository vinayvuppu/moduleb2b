import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import { Spacings, Text } from '@commercetools-frontend/ui-kit';
import DraggableTag from '../draggable-tag';
import messages from './messages';
import styles from './droppable-panel.mod.css';

const DroppablePanel = React.memo(props => {
  const { formatMessage } = useIntl();

  return (
    <Droppable droppableId={props.droppableId}>
      {provided => (
        <div
          data-testid={props.droppableId}
          className={styles['tag-container-editable']}
          ref={provided.innerRef}
        >
          {props.columns.length === 0 ? (
            <Spacings.Inset scale="s">
              <Text.Detail>{props.noColumnsText}</Text.Detail>
            </Spacings.Inset>
          ) : (
            <>
              {props.columns.map((column, index) => (
                <DraggableTag
                  key={`${column.key}-${index}`}
                  column={column}
                  index={index}
                  onRemoveColumn={
                    props.onRemoveColumn
                      ? () =>
                          props.onRemoveColumn([
                            ...props.columns.slice(0, index),
                            ...props.columns.slice(index + 1),
                          ])
                      : undefined
                  }
                />
              ))}
              {props.isSearchable && (
                <Spacings.Inset scale="xs">
                  <Text.Detail tone="secondary">
                    {formatMessage(messages.useInputSearch)}
                  </Text.Detail>
                </Spacings.Inset>
              )}
            </>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
});

DroppablePanel.displayName = 'DroppablePanel';
DroppablePanel.propTypes = {
  droppableId: PropTypes.string.isRequired,
  noColumnsText: PropTypes.node.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    })
  ),
  isSearchable: PropTypes.bool,
  onRemoveColumn: PropTypes.func,
};

export default DroppablePanel;
