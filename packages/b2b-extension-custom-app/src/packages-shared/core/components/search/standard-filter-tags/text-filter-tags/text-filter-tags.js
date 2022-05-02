import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import SingleFilterTag from '../single-filter-tag';

export const TextSingleFilterTag = props => (
  <SingleFilterTag
    fieldLabel={props.fieldLabel}
    filterTypeLabel={props.filterTypeLabel}
    value={props.value}
    renderValue={value => value}
    onRemove={props.onRemove}
    onClick={props.onClick}
  />
);

TextSingleFilterTag.displayName = 'TextSingleFilterTag';
TextSingleFilterTag.propTypes = {
  fieldLabel: PropTypes.string.isRequired,
  filterTypeLabel: PropTypes.string.isRequired,
  value: PropTypes.string,
  onRemove: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,

  // HoC
  intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
    .isRequired,
};

export default injectIntl(TextSingleFilterTag);
