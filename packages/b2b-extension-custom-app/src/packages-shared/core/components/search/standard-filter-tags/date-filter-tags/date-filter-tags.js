import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import FormattedDateTime from '../../../formatted-date-time';
import SingleFilterTag from '../single-filter-tag';
import RangeFilterTag from '../range-filter-tag';

export const DateSingleFilterTag = injectIntl(props => (
  <SingleFilterTag
    fieldLabel={props.fieldLabel}
    filterTypeLabel={props.filterTypeLabel}
    value={props.value}
    renderValue={value => <FormattedDateTime type="date" value={value} />}
    onRemove={props.onRemove}
    onClick={props.onClick}
  />
));
DateSingleFilterTag.displayName = 'DateSingleFilterTag';
DateSingleFilterTag.propTypes = {
  fieldLabel: PropTypes.string.isRequired,
  filterTypeLabel: PropTypes.string.isRequired,
  value: PropTypes.string,
  onRemove: PropTypes.func.isRequired,
};

export const DateRangeFilterTag = injectIntl(props => (
  <RangeFilterTag
    fieldLabel={props.fieldLabel}
    value={props.value}
    renderValue={value => <FormattedDateTime type="date" value={value} />}
    onRemove={props.onRemove}
    onClick={props.onClick}
  />
));
DateRangeFilterTag.displayName = 'DateRangeFilterTag';
DateRangeFilterTag.propTypes = {
  fieldLabel: PropTypes.string.isRequired,
  value: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
  }),
  onRemove: PropTypes.func.isRequired,
};
