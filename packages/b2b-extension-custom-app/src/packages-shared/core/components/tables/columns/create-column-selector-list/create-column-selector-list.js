import PropTypes from 'prop-types';
import React from 'react';
import { DropTarget } from 'react-dnd';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import createColumnSelectorListItem from '../create-column-selector-list-item';
import createColumnSelectorListPosition from '../create-column-selector-list-position';
import styles from './column-selector-list.mod.css';

const spec = {
  canDrop() {
    return false;
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    hoveringItem: monitor.getItem(),
  };
}

export default function createColumnSelectorList(types) {
  const ColumnSelectorListItem = createColumnSelectorListItem(types);
  const ColumnSelectorListPosition = createColumnSelectorListPosition(types);

  class ColumnSelectorList extends React.PureComponent {
    static displayName = 'ColumnSelectorList';

    static propTypes = {
      group: PropTypes.object.isRequired,
      itemRenderer: PropTypes.func.isRequired,
      onItemMove: PropTypes.func.isRequired,
      newItemAreaRenderer: PropTypes.func,
      hoveringItem: PropTypes.shape({
        owner: PropTypes.string,
      }),

      isOver: PropTypes.bool,
      connectDropTarget: PropTypes.func,
    };

    state = {
      newItemPositionVisible: false,
    };

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.props.isOver === nextProps.isOver) return;

      const newItemPositionVisible =
        nextProps.isOver &&
        nextProps.hoveringItem &&
        nextProps.hoveringItem.owner !== this.props.group.name;

      if (this.state.newItemPositionVisible === newItemPositionVisible) return;

      // FIXME: I'm pretty sure this is a hack, but there was previously
      // no comment, so I'm not sure why this is.
      setTimeout(() => this.setState({ newItemPositionVisible }), 0);
    }

    render() {
      const newItemPosition = this.props.group.items.length
        ? this.props.group.items[this.props.group.items.length - 1].position
        : 0;

      return this.props.connectDropTarget(
        <ul
          className={styles.list}
          data-track-component="Group"
          data-track-event="drop"
          data-track-label={this.props.group.name}
        >
          {this.props.group.label ? (
            <h4 className={styles.title}>{this.props.group.label}</h4>
          ) : null}
          {this.props.group.items
            .sort((a, b) => a.position - b.position)
            .map(item => {
              if (item.key === 'checked') return null;
              const uniqueKey = oneLineTrim`
              ${item.isCustom ? 'custom' : 'standard'}_${item.key}
            `;
              return (
                <ColumnSelectorListPosition
                  key={uniqueKey}
                  owner={this.props.group.name}
                  position={item.position}
                  onItemMove={this.props.onItemMove}
                >
                  <ColumnSelectorListItem
                    position={item.position}
                    owner={this.props.group.name}
                  >
                    {this.props.itemRenderer(item)}
                  </ColumnSelectorListItem>
                </ColumnSelectorListPosition>
              );
            })}
          {this.state.newItemPositionVisible ? (
            <ColumnSelectorListPosition
              key="new-item"
              owner={this.props.group.name}
              position={newItemPosition}
              onItemMove={this.props.onItemMove}
            >
              <ColumnSelectorListItem
                position={newItemPosition}
                owner={this.props.group.name}
              >
                {this.props.newItemAreaRenderer()}
              </ColumnSelectorListItem>
            </ColumnSelectorListPosition>
          ) : null}
        </ul>
      );
    }
  }

  return DropTarget(types, spec, collect)(ColumnSelectorList);
}
