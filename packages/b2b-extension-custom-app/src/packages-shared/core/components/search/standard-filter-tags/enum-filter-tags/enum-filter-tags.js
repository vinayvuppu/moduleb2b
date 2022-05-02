import PropTypes from 'prop-types';
import React from 'react';
import SingleFilterTag from '../single-filter-tag';
import RangeFilterTag from '../range-filter-tag';

export const EnumSingleFilterTag = props => (
  <SingleFilterTag
    fieldLabel={props.fieldLabel}
    filterTypeLabel={props.filterTypeLabel}
    value={props.value}
    renderValue={option =>
      Array.isArray(option) ? option.join() : `${option.value}`
    }
    onRemove={props.onRemove}
    onClick={props.onClick}
  />
);
EnumSingleFilterTag.displayName = 'EnumSingleFilterTag';
EnumSingleFilterTag.propTypes = {
  fieldLabel: PropTypes.string.isRequired,
  filterTypeLabel: PropTypes.string.isRequired,
  value: PropTypes.any,
  onRemove: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export const EnumRangeFilterTag = props => (
  <RangeFilterTag
    fieldLabel={props.fieldLabel}
    value={props.value}
    renderValue={option => option.value}
    onRemove={props.onRemove}
    onClick={props.onClick}
  />
);
EnumRangeFilterTag.displayName = 'EnumRangeFilterTag';
EnumRangeFilterTag.propTypes = {
  fieldLabel: PropTypes.string.isRequired,
  value: PropTypes.any,
  onRemove: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export const EnumSingleOptionFilterTag = props => (
  <SingleFilterTag
    fieldLabel={props.fieldLabel}
    filterTypeLabel={props.filterTypeLabel}
    value={props.value}
    renderValue={option =>
      Array.isArray(option)
        ? option.map(value => value.label).join()
        : `${option.value.label}`
    }
    onRemove={props.onRemove}
    onClick={props.onClick}
  />
);
EnumSingleOptionFilterTag.displayName = 'EnumSingleOptionFilterTag';
EnumSingleOptionFilterTag.propTypes = {
  fieldLabel: PropTypes.string.isRequired,
  filterTypeLabel: PropTypes.string.isRequired,
  value: PropTypes.shape({
    key: PropTypes.any,
    label: PropTypes.string.isRequired,
  }),
  onRemove: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};
