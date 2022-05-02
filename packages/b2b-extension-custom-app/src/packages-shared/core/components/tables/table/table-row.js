import PropTypes from 'prop-types';
import React from 'react';
import { SortableElement } from 'react-sortable-hoc';

export const TableRow = ({ children }) => <li>{children}</li>;

TableRow.displayName = 'TableRow';
TableRow.propTypes = {
  children: PropTypes.node.isRequired,
};

export const SortableTableRow = SortableElement(TableRow);
