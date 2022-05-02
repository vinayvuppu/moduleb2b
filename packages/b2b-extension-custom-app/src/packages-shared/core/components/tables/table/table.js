import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import classnames from 'classnames';
import TableBody from './table-body';
import styles from './table.mod.css';

class Table extends React.PureComponent {
  static displayName = 'Table';

  static propTypes = {
    noResultsLabel: PropTypes.node,
    items: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.node.isRequired,
        className: PropTypes.string,
      })
    ).isRequired,
    classNames: PropTypes.shape({
      table: PropTypes.string,
      header: PropTypes.string,
      body: PropTypes.string,
    }),
    transitionOptions: PropTypes.shape({
      active: PropTypes.bool.isRequired,
      key: PropTypes.string,
      toLeft: PropTypes.bool,
    }),
    getItemRowStyle: PropTypes.func,
    itemRenderer: PropTypes.func.isRequired,
    onItemRowClick: PropTypes.func,
    // For DnD capabilities
    isSortable: PropTypes.bool,
    onSortEnd: ({ isSortable, onSortEnd }, ...rest) => {
      if (isSortable && onSortEnd === undefined)
        return new Error(
          '`onSortEnd` is a required prop if `isSortable` is set to true'
        );
      return PropTypes.func({ onSortEnd }, ...rest);
    },
  };

  static defaultProps = {
    classNames: {},
    isSortable: false,
    transitionOptions: {
      active: false,
      toLeft: false,
    },
  };

  renderTableBody = () => {
    const defaultTableProps = {
      columns: this.props.columns,
      getItemRowStyle: this.props.getItemRowStyle,
      itemRenderer: this.props.itemRenderer,
      items: this.props.items,
      noResultsLabel: this.props.noResultsLabel,
      onItemRowClick: this.props.onItemRowClick,
    };

    const tableProps = {
      ...defaultTableProps,
      ...(this.props.isSortable
        ? {
            isSortable: true,
            helperClass: styles['list-row-being-sorted'],
            onSortEnd: this.props.onSortEnd,
          }
        : {}),
    };
    return <TableBody {...tableProps} />;
  };

  render() {
    return (
      <div className={classnames(this.props.classNames.table, styles.table)}>
        <div
          className={classnames(this.props.classNames.header, styles.header)}
        >
          <ul className={styles['header-list']}>
            {this.props.columns.map(({ key, label, className }) => (
              <li
                key={key}
                // `className` has to be before `styleName` so that
                // custom styles passed have precedence.
                className={classnames(className, styles.column)}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className={this.props.classNames.body}>
          {this.props.transitionOptions.active ? (
            <TransitionGroup className={styles.slider}>
              <CSSTransition
                key={this.props.transitionOptions.key}
                classNames={{
                  enter: this.props.transitionOptions.toLeft
                    ? styles['enter-from-right']
                    : styles['enter-from-left'],
                  enterActive: styles['enter-active'],
                  exit: styles.exit,
                  exitActive: this.props.transitionOptions.toLeft
                    ? styles['exit-to-left']
                    : styles['exit-to-right'],
                  appear: styles.appear,
                  appearActive: styles['appear-active'],
                }}
                timeout={{ enter: 1, exit: 500, appear: 500 }}
                appear={true}
              >
                <div className={styles.wrapper}>{this.renderTableBody()}</div>
              </CSSTransition>
            </TransitionGroup>
          ) : (
            <div className={styles.slider}>
              <div className={styles.wrapper}>{this.renderTableBody()}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Table;
