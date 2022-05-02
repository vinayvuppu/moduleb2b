import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import TableRowCell from './table-row-cell';
import styles from './table.mod.css';

const getEvenRowClass = idx => (idx % 2 === 0 ? styles['list-row-even'] : null);

const TableRowColumns = ({
  columns,
  item,
  getItemRowStyle,
  itemRenderer,
  onItemRowClick,
  index,
}) => (
  <ul
    data-testid="list-row"
    className={classnames(
      getItemRowStyle(item),
      styles['list-row'],
      getEvenRowClass(index),
      { [styles.clickable]: Boolean(onItemRowClick) }
    )}
    onClick={onItemRowClick ? event => onItemRowClick(event, index) : null}
  >
    {columns.map(({ key, className }) => (
      <TableRowCell
        key={key}
        columnKey={key}
        className={className}
        item={item}
        itemRenderer={itemRenderer}
        index={index}
      />
    ))}
  </ul>
);
TableRowColumns.displayName = 'TableRowColumns';
TableRowColumns.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      className: PropTypes.string,
    })
  ).isRequired,
  item: PropTypes.object.isRequired,
  getItemRowStyle: PropTypes.func,
  itemRenderer: PropTypes.func.isRequired,
  onItemRowClick: PropTypes.func,
  index: PropTypes.number.isRequired,
};

export default TableRowColumns;
