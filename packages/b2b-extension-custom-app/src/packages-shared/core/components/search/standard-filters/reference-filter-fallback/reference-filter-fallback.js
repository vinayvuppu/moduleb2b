import React from 'react';
import PropTypes from 'prop-types';
import TagCreatorInput from '../../../tag-creator-input';
import SingleFilter from '../single-filter';

const ReferenceFilterFallback = props => (
  <SingleFilter
    renderInput={({ value, onUpdateValue }) => (
      <TagCreatorInput
        value={value && value.map(id => ({ value: id, label: id }))}
        onChange={option => onUpdateValue(option.map(opt => opt.value))}
        placeholder={props.placeholder}
        disabled={props.disabled}
      />
    )}
    value={props.value}
    error={props.error}
    onUpdateValue={props.onUpdateFilter}
  />
);
ReferenceFilterFallback.displayName = 'ReferenceFilterFallback';
ReferenceFilterFallback.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  error: PropTypes.string,
  onUpdateFilter: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ReferenceFilterFallback;
