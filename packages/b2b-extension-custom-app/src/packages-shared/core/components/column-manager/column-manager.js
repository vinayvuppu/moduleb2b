import debounce from 'debounce-promise';
import differenceWith from 'lodash.differencewith';
import React from 'react';
import PropTypes from 'prop-types';
import requiredIf from 'react-required-if';
import { FormattedMessage, useIntl } from 'react-intl';
import { DragDropContext } from 'react-beautiful-dnd';
import {
  Spacings,
  Text,
  IconButton,
  TableIcon,
  CollapsibleMotion,
  AsyncSelectInput,
  SearchIcon,
  EyeCrossedIcon,
  EyeIcon,
} from '@commercetools-frontend/ui-kit';
import DragDropPanel from './droppable-panel';
import styles from './column-manager.mod.css';
import messages from './messages';

const ColumnManager = React.memo(props => {
  const { formatMessage } = useIntl();

  const handleDragEnd = result => {
    document.body.classList.remove(styles.dragging);
    // Invalid drop destination, do nothing
    if (!result.destination) return;
    if (result.destination.droppableId === 'hidden-columns-panel') {
      if (result.source.droppableId === 'hidden-columns-panel') return;
      props.onUpdateColumns([
        ...props.selectedColumns.slice(0, result.source.index),
        ...props.selectedColumns.slice(result.source.index + 1),
      ]);
    } else {
      // the destination is the selected columns panel

      // it's a swap when the source and the destination are the same
      const isSwap = result.source.droppableId === 'selected-columns-panel';

      const items = isSwap
        ? // remove the dragged item from its position if it is not coming from
          // the hidden section (it is a swap)
          [
            ...props.selectedColumns.slice(0, result.source.index),
            ...props.selectedColumns.slice(result.source.index + 1),
          ]
        : props.selectedColumns;

      const columns = isSwap ? props.selectedColumns : props.availableColumns;
      const draggedColumn = columns.find(col => col.key === result.draggableId);

      // push the column in the new position
      props.onUpdateColumns([
        ...items.slice(0, result.destination.index),
        draggedColumn,
        ...items.slice(result.destination.index),
      ]);
    }
  };

  const handleDragStart = () => {
    document.body.classList.add(styles.dragging);
  };

  const handleOnClick = (toggle, isOpen) => {
    if (props.trackIsOpen) {
      props.trackIsOpen(isOpen);
    }
    toggle();
  };

  const hiddenColumns = differenceWith(
    props.availableColumns,
    props.selectedColumns,
    (a, b) => a.key === b.key
  );

  return (
    <CollapsibleMotion isDefaultClosed={true}>
      {({ isOpen, toggle, registerContentNode, containerStyles }) => (
        <Spacings.Stack scale="s">
          <div className={isOpen ? styles.container : ''}>
            {isOpen ? (
              <div className={styles.header}>
                <Text.Headline as="h3">
                  <FormattedMessage {...messages.title} />
                </Text.Headline>
                <IconButton
                  label={formatMessage(
                    messages.collapseColumnManagerButtonLabel
                  )}
                  icon={<TableIcon />}
                  onClick={() => handleOnClick(toggle, isOpen)}
                  isToggled={isOpen}
                  isToggleButton={true}
                  data-track-component=""
                  data-track-label="Close table manager"
                  data-track-event="click"
                />
              </div>
            ) : (
              <div className={styles['button-container']}>
                <IconButton
                  label={formatMessage(messages.expandColumnManagerButtonLabel)}
                  icon={<TableIcon />}
                  onClick={() => handleOnClick(toggle, isOpen)}
                  isToggled={isOpen}
                  isToggleButton={true}
                  data-track-component=""
                  data-track-label="Open table manager"
                  data-track-event="click"
                />
              </div>
            )}
            <div style={containerStyles}>
              <div ref={registerContentNode}>
                <DragDropContext
                  onDragEnd={handleDragEnd}
                  onDragStart={handleDragStart}
                >
                  <Spacings.Inline scale="m">
                    <Spacings.Stack>
                      <Spacings.Inline scale="xs" alignItems="center">
                        <EyeCrossedIcon size="medium" />
                        <Text.Body isBold={true}>
                          <FormattedMessage {...messages.hiddenColumns} />
                        </Text.Body>
                      </Spacings.Inline>
                      {props.areHiddenColumnsSearchable && (
                        <AsyncSelectInput
                          id={'hidden-columns-panel-search-input'}
                          {...(props.searchHiddenColumnsPlaceholder
                            ? {
                                placeholder:
                                  props.searchHiddenColumnsPlaceholder,
                              }
                            : undefined)}
                          cacheOptions={false}
                          onChange={() => {
                            // to avoid prop-types error
                          }}
                          // loadOptions is used instead of onInputChange
                          // because the loading indicator is displayed
                          // only when loadOptions is invoked
                          loadOptions={debounce(props.searchHiddenColumns, 300)}
                          onInputChange={input =>
                            // loadOptions is not invoked when input is empty
                            !input.length && props.searchHiddenColumns(input)
                          }
                          components={{
                            Option: () => null,
                            Menu: () => null,
                            // eslint-disable-next-line react/display-name
                            DropdownIndicator: () => (
                              <Spacings.Inline alignItems="center">
                                <SearchIcon scale="medium" color="primary" />
                              </Spacings.Inline>
                            ),
                          }}
                        />
                      )}
                      <DragDropPanel
                        droppableId="hidden-columns-panel"
                        data-testid="hidden-columns-panel"
                        noColumnsText={
                          <FormattedMessage
                            {...messages.noHiddenColumnsToShow}
                          />
                        }
                        columns={hiddenColumns}
                        isSearchable={props.areHiddenColumnsSearchable}
                      />
                    </Spacings.Stack>
                    <Spacings.Stack>
                      <Spacings.Inline scale="xs" alignItems="center">
                        <EyeIcon size="medium" />
                        <Text.Body isBold={true}>
                          <FormattedMessage {...messages.visibleColumns} />
                        </Text.Body>
                      </Spacings.Inline>
                      <DragDropPanel
                        droppableId="selected-columns-panel"
                        data-testid="selected-columns-panel"
                        noColumnsText={
                          <FormattedMessage
                            {...messages.noSelectedColumnsToShow}
                          />
                        }
                        columns={props.selectedColumns}
                        onRemoveColumn={props.onUpdateColumns}
                      />
                    </Spacings.Stack>
                  </Spacings.Inline>
                </DragDropContext>
              </div>
            </div>
          </div>
        </Spacings.Stack>
      )}
    </CollapsibleMotion>
  );
});

ColumnManager.displayName = 'ColumnManager';

ColumnManager.propTypes = {
  availableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    })
  ).isRequired,
  selectedColumns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    })
  ).isRequired,
  onUpdateColumns: PropTypes.func.isRequired,

  areHiddenColumnsSearchable: PropTypes.bool,
  searchHiddenColumns: requiredIf(
    PropTypes.func,
    props => props.areHiddenColumnsSearchable
  ),
  searchHiddenColumnsPlaceholder: PropTypes.string,

  trackIsOpen: PropTypes.func,
};

export default ColumnManager;
