import PropTypes from 'prop-types';
import React from 'react';
import { DropTarget } from 'react-dnd';
import styles from './column-selector-list-position.mod.css';

const spec = {
  drop(props, monitor) {
    const { position, owner } = monitor.getItem();
    if (position === props.position && owner && props.owner === owner) return;
    const from = { owner, position };
    const to = {
      owner: props.owner,
      position: props.position,
    };
    props.onItemMove(from, to);
  },
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

class ColumnSelectorListPosition extends React.PureComponent {
  static displayName = 'ColumnSelectorListPosition';

  // TODO: better validators
  static propTypes = {
    position: PropTypes.number.isRequired,
    onItemMove: PropTypes.func.isRequired,
    children: PropTypes.any,
    isOver: PropTypes.bool,
    connectDropTarget: PropTypes.any,
  };

  render() {
    return this.props.connectDropTarget(
      <li
        className={this.props.isOver ? styles['item-overlapped'] : styles.item}
      >
        {this.props.children}
      </li>
    );
  }
}

export default function createColumnSelectorListPosition(types) {
  return DropTarget(types, spec, collect)(ColumnSelectorListPosition);
}
