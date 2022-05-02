import PropTypes from 'prop-types';
import React from 'react';
import { DragSource } from 'react-dnd';
import styles from './column-selector-list-item.mod.css';

/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */
const spec = {
  beginDrag(props) {
    return {
      position: props.position,
      owner: props.owner,
    };
  },
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

class ColumnSelectorListItem extends React.PureComponent {
  static displayName = 'ColumnSelectorListItem';

  // TODO: better validators
  static propTypes = {
    position: PropTypes.number.isRequired,
    children: PropTypes.element,
    isDragging: PropTypes.bool,
    connectDragSource: PropTypes.any,
  };

  render() {
    return this.props.connectDragSource(
      <div
        className={
          this.props.isDragging
            ? styles['column-list-item-dragging']
            : styles['column-list-item']
        }
      >
        {this.props.children}
      </div>
    );
  }
}

export default function createColumnSelectorListItem(types) {
  return DragSource(types, spec, collect)(ColumnSelectorListItem);
}
