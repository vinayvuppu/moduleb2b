import PropTypes from 'prop-types';
import React from 'react';
import SingleFilterTag from '../single-filter-tag';

const NoValueFilterTag = props => (
  <SingleFilterTag
    fieldLabel={props.fieldLabel}
    filterTypeLabel={props.filterTypeLabel}
    renderValue={() => null}
    onRemove={props.onRemove}
    onClick={props.onClick}
  />
);
NoValueFilterTag.displayName = 'NoValueFilterTag';
NoValueFilterTag.propTypes = {
  fieldLabel: PropTypes.string.isRequired,
  filterTypeLabel: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default NoValueFilterTag;
