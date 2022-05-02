import PropTypes from 'prop-types';
import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { TableRow, SortableTableRow } from './table-row';
import TableRowColumns from './table-row-columns';
import styles from './table.mod.css';

const NoResultsRow = ({ children }) => (
  <div className={styles['no-results']}>{children}</div>
);
NoResultsRow.displayName = 'NoResultsRow';
NoResultsRow.propTypes = {
  children: PropTypes.node.isRequired,
};

const Body = ({
  items,
  columns,
  getItemRowStyle,
  itemRenderer,
  onItemRowClick,
  noResultsLabel,
}) => (
  <ul className={styles['body-list']}>
    {items.length ? (
      items.map((item, index) => (
        <TableRow key={item.id}>
          <TableRowColumns
            columns={columns}
            getItemRowStyle={getItemRowStyle}
            index={index}
            item={item}
            itemRenderer={itemRenderer}
            onItemRowClick={onItemRowClick}
          />
        </TableRow>
      ))
    ) : (
      <NoResultsRow>{noResultsLabel}</NoResultsRow>
    )}
  </ul>
);
Body.displayName = 'Body';
Body.propTypes = {
  columns: PropTypes.array.isRequired,
  getItemRowStyle: PropTypes.func,
  itemRenderer: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  onItemRowClick: PropTypes.func,
  noResultsLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

const SortableBody = ({
  items,
  columns,
  getItemRowStyle,
  itemRenderer,
  onItemRowClick,
  noResultsLabel,
}) => (
  <ul className={styles['body-list']}>
    {items.length ? (
      items.map((item, index) => (
        <SortableTableRow key={item.id} index={index}>
          <TableRowColumns
            columns={columns}
            getItemRowStyle={getItemRowStyle}
            index={index}
            item={item}
            itemRenderer={itemRenderer}
            onItemRowClick={onItemRowClick}
          />
        </SortableTableRow>
      ))
    ) : (
      <NoResultsRow>{noResultsLabel}</NoResultsRow>
    )}
  </ul>
);
SortableBody.displayName = 'SortableBody';
SortableBody.propTypes = {
  columns: PropTypes.array.isRequired,
  getItemRowStyle: PropTypes.func,
  itemRenderer: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  onItemRowClick: PropTypes.func,
  noResultsLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

const WithSortableContainer = SortableContainer(SortableBody);

const TableBody = ({
  columns,
  items,
  getItemRowStyle,
  itemRenderer,
  noResultsLabel,
  onItemRowClick,
  isSortable,
  onSortEnd,
  helperClass,
}) =>
  isSortable ? (
    <WithSortableContainer
      columns={columns}
      items={items}
      getItemRowStyle={getItemRowStyle}
      itemRenderer={itemRenderer}
      noResultsLabel={noResultsLabel}
      onItemRowClick={onItemRowClick}
      onSortEnd={onSortEnd}
      helperClass={helperClass}
    />
  ) : (
    <Body
      columns={columns}
      items={items}
      getItemRowStyle={getItemRowStyle}
      itemRenderer={itemRenderer}
      noResultsLabel={noResultsLabel}
      onItemRowClick={onItemRowClick}
    />
  );
TableBody.displayName = 'TableBody';
TableBody.propTypes = {
  columns: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  getItemRowStyle: PropTypes.func,
  itemRenderer: PropTypes.func.isRequired,
  onItemRowClick: PropTypes.func,
  noResultsLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  isSortable: PropTypes.bool,
  onSortEnd: PropTypes.func,
  helperClass: PropTypes.string,
};
TableBody.defaultProps = {
  isSortable: false,
  getItemRowStyle: () => null,
};

export default TableBody;
