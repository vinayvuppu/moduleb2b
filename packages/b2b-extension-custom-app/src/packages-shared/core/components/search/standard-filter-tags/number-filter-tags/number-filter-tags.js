import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import SingleFilterTag from '../single-filter-tag';
import RangeFilterTag from '../range-filter-tag';

export const NumberSingleFilterTag = injectIntl(props => (
  <SingleFilterTag
    fieldLabel={props.fieldLabel}
    filterTypeLabel={props.filterTypeLabel}
    value={props.value}
    renderValue={value => props.intl.formatNumber(value)}
    onRemove={props.onRemove}
    onClick={props.onClick}
  />
));
NumberSingleFilterTag.displayName = 'NumberSingleFilterTag';
NumberSingleFilterTag.propTypes = {
  fieldLabel: PropTypes.string.isRequired,
  filterTypeLabel: PropTypes.string.isRequired,
  value: PropTypes.number,
  onRemove: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export const NumberRangeFilterTag = injectIntl(props => (
  <RangeFilterTag
    fieldLabel={props.fieldLabel}
    value={props.value}
    renderValue={value => props.intl.formatNumber(value)}
    onRemove={props.onRemove}
    onClick={props.onClick}
  />
));
NumberRangeFilterTag.displayName = 'NumberRangeFilterTag';
NumberRangeFilterTag.propTypes = {
  fieldLabel: PropTypes.string.isRequired,
  value: PropTypes.shape({
    from: PropTypes.number,
    to: PropTypes.number,
  }),
  onRemove: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};
