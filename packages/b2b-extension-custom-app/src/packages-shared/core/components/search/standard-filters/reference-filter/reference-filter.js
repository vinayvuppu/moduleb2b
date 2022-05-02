import React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '../../../fields/autocomplete';
import SingleFilter from '../single-filter';
import styles from './reference-filter.mod.css';

export const listOf = shape => ({
  ...shape,
  value: PropTypes.arrayOf(shape.value),
});

export const stringFilterShape = {
  onUpdateFilter: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
  ]),
  disabled: PropTypes.bool,
  isClearable: PropTypes.bool,
};

export default function createReferenceSingleFilter({
  isMulti = false,
  autoload = false,
  className,
}) {
  const ReferenceSingleFilter = props => {
    const renderInputFn = props.renderInput || defaultRenderInput;
    return (
      <div className={styles.filter}>
        <SingleFilter
          renderInput={({ value, onUpdateValue, onBlur, onFocus }) =>
            renderInputFn({
              value,
              onUpdateValue,
              loadItems: props.loadItems,
              mapItemToOption: props.mapItemToOption,
              mapValueToItem: props.mapValueToItem,
              renderItem: props.renderItem,
              placeholderLabel: props.placeholderLabel,
              filterOption: props.filterOption,
              disabled: props.disabled,
              isClearable: props.isClearable,
              isMulti,
              autoload,
              className,
              onBlur,
              onFocus,
            })
          }
          value={props.value}
          error={props.error}
          onUpdateValue={props.onUpdateFilter}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
        />
      </div>
    );
  };
  // TODO this should be two separate components, one for multi and one regular
  // Then the propTypes and displayName can be defined statically and linting
  // support emerges again
  ReferenceSingleFilter.displayName = isMulti
    ? 'MultiReferenceSingleFilter'
    : 'ReferenceSingleFilter';
  ReferenceSingleFilter.propTypes = isMulti
    ? listOf(stringFilterShape)
    : stringFilterShape;
  ReferenceSingleFilter.defaultProps = {
    disabled: false,
  };

  return ReferenceSingleFilter;
}

/* eslint-disable react/prop-types */
export function defaultRenderInput({
  value,
  onUpdateValue,
  loadItems,
  mapItemToOption,
  mapValueToItem,
  renderItem,
  placeholderLabel,
  filterOption,
  disabled,
  isMulti,
  isClearable,
  className,
  onBlur,
  onFocus,
  autoload,
}) {
  return (
    <Autocomplete
      onChange={onUpdateValue}
      value={value}
      loadItems={loadItems}
      mapItemToOption={mapItemToOption}
      mapValueToItem={mapValueToItem}
      renderItem={renderItem}
      placeholderLabel={placeholderLabel}
      filterOption={filterOption}
      disabled={disabled}
      isMulti={isMulti}
      isClearable={isClearable}
      className={className}
      onBlur={onBlur}
      onFocus={onFocus}
      autoload={autoload}
      maxMenuHeight={200}
    />
  );
}
defaultRenderInput.displayName = 'DefaultInput';
