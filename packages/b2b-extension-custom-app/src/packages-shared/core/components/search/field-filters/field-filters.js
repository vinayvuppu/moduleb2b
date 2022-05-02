import PropTypes from 'prop-types';
import React from 'react';
import { AutoSizer } from 'react-virtualized';
import { injectIntl } from 'react-intl';
import has from 'lodash.has';
import {
  CloseBoldIcon,
  PlusBoldIcon,
  IconButton,
  SelectInput,
} from '@commercetools-frontend/ui-kit';
import ItemList from '../../item-list';
import Shadow from '../../shadow';
import styles from './field-filters.mod.css';
import messages from './messages';

/**
 * This component handles rendering all the filters for one field. Additionally,
 * it wraps each filter in a dropdown to select the type of filter, which is
 * populated by the options in the `filterOptions` prop.
 */

/**
 * This function can be removed once the FilterComponent API
 * is homogenized. Currently a `TextSingleFilter` passes
 * the event within its `onChange` up whereas others (Date and Selects) pass the value directly.
 * This logic extracts the value based on the presence of an event.
 */
export const extractValueFromEvent = eventOrValue =>
  eventOrValue && eventOrValue.target && eventOrValue.target.value !== undefined
    ? eventOrValue.target.value
    : eventOrValue;

export class FieldFilters extends React.PureComponent {
  static displayName = 'FieldFilters';

  static propTypes = {
    // Label of the field
    label: PropTypes.string.isRequired,

    // An object that maps each filterType to the component that should be used
    // to render a filter of that type
    filterOptions: PropTypes.objectOf(
      PropTypes.shape({
        filterComponent: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        // In some cases it should not be allowed to add multiple filter values
        // within a filter (e.g. missing). By default this is always `true`.
        canBeAppliedMultipleTimes: PropTypes.bool,
      })
    ).isRequired,

    // An array of objects configuring the current filters (type + value)
    filters: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.any,
        error: PropTypes.any,
      })
    ),

    // Callback for adding a new filter
    onAddFilter: PropTypes.func.isRequired,

    // Callback for removing individual filter
    onRemoveFilter: PropTypes.func.isRequired,

    // Callback for updating type / value of filter
    onUpdateFilter: PropTypes.func.isRequired,

    width: PropTypes.number,

    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
  };

  static defaultProps = { filters: [] };

  renderFilter = ({ index, onAddItem, onRemoveItem }) => {
    const filter = this.props.filters[index];
    const FilterComponent = this.props.filterOptions[filter.type]
      .filterComponent;
    const selectFilterOptions = Object.keys(this.props.filterOptions).map(
      key => ({
        value: key,
        label: this.props.filterOptions[key].label,
      })
    );
    const firstFilterOptions = this.props.filterOptions[
      Object.keys(this.props.filterOptions)[0]
    ];
    const canBeAppliedMultipleTimes = has(
      this.props.filterOptions[filter.type],
      'canBeAppliedMultipleTimes'
    )
      ? this.props.filterOptions[filter.type].canBeAppliedMultipleTimes
      : true;

    return (
      <div className={styles['list-item']}>
        <div className={styles.filter}>
          <div
            className={
              this.props.width < 600
                ? styles['filter-vertical']
                : styles['filter-horizontal']
            }
          >
            {Object.keys(this.props.filterOptions).length === 1 ? (
              <span className={styles['filter-label']}>
                {firstFilterOptions.label}
              </span>
            ) : (
              <div className={styles.selectContainer}>
                <SelectInput
                  options={selectFilterOptions}
                  value={filter.type}
                  menuPortalTarget={document.body}
                  data-track-component="SelectInput"
                  data-track-label="ChangeFilter"
                  onChange={({ target: { value: type } }) =>
                    this.props.onUpdateFilter({
                      filter: { type, value: null },
                      index,
                    })
                  }
                />
              </div>
            )}
            <FilterComponent
              value={filter.value}
              error={filter.error}
              onUpdateFilter={event =>
                this.props.onUpdateFilter({
                  filter: {
                    type: filter.type,
                    value: extractValueFromEvent(event),
                  },
                  index,
                })
              }
            />
          </div>
          <div className={styles['icon-centered']}>
            {Boolean(onRemoveItem) && (
              <IconButton
                label={this.props.intl.formatMessage(messages.removeFilter)}
                icon={<CloseBoldIcon />}
                size="medium"
                onClick={() => onRemoveItem({ index })}
                data-track-component="IconButton"
                data-track-label="RemoveFilter"
                data-track-event="click"
              />
            )}
          </div>
        </div>
        {Boolean(onAddItem) && canBeAppliedMultipleTimes && (
          <IconButton
            label={this.props.intl.formatMessage(messages.addFilter)}
            icon={<PlusBoldIcon />}
            size="medium"
            onClick={() => onAddItem({ index })}
            data-track-component="IconButton"
            data-track-label="AddFilter"
            data-track-event="click"
          />
        )}
      </div>
    );
  };

  handleAddFilter = ({ index }) => {
    this.props.onAddFilter({
      filter: {
        // add first filter by default
        type: Object.keys(this.props.filterOptions)[0],
        value: null,
      },
      index,
    });
  };

  render() {
    return (
      <Shadow depth="1" className={styles.container}>
        <div className={styles.label}>{this.props.label}</div>
        <ItemList
          itemCount={this.props.filters.length}
          renderItem={this.renderFilter}
          getKey={({ index }) => index}
          onAddItem={this.handleAddFilter}
          onRemoveItem={this.props.onRemoveFilter}
          canBeEmpty={true}
          shouldGrowItems={false}
          shouldRenderButtons={false}
        />
      </Shadow>
    );
  }
}

const AutoSizedFieldFilters = props => (
  <AutoSizer disableWidth={true} disableHeight={true}>
    {({ width }) => <FieldFilters {...props} width={width} />}
  </AutoSizer>
);
AutoSizedFieldFilters.displayName = 'AutoSizedFieldFilters';

export default injectIntl(AutoSizedFieldFilters);
