import PropTypes from 'prop-types';
import React from 'react';

export default function FieldTags(props) {
  return (
    <div>
      {props.filters.map(({ type, value }, index) => {
        const TagComponent = props.filterOptions[type].tagComponent;

        return (
          <TagComponent
            key={index}
            fieldLabel={props.label}
            filterTypeLabel={props.filterOptions[type].label}
            value={value}
            onRemove={() => props.onRemoveFilter({ index })}
          />
        );
      })}
    </div>
  );
}

FieldTags.propTypes = {
  // Label of the field
  label: PropTypes.string.isRequired,

  // An object that maps each filterType to the component that should be used
  // to render a filter of that type
  filterOptions: PropTypes.objectOf(
    PropTypes.shape({
      tagComponent: PropTypes.func.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,

  // An array of objects configuring the current filters (type + value)
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.any,
    })
  ),

  // Callback for removing individual filter
  onRemoveFilter: PropTypes.func.isRequired,
};

FieldTags.displayName = 'FieldTags';
