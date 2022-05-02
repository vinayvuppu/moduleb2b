import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import styles from './table.mod.css';

const TableRowCell = ({ itemRenderer, className, columnKey, item, index }) => (
  <li className={classnames(className, styles['body-column'])}>
    <div className={styles.cell}>{itemRenderer(item, index, columnKey)}</div>
  </li>
);
TableRowCell.displayName = 'TableRowCell';
TableRowCell.propTypes = {
  itemRenderer: PropTypes.func.isRequired,
  columnKey: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,

  className: PropTypes.string,
};
export default TableRowCell;
