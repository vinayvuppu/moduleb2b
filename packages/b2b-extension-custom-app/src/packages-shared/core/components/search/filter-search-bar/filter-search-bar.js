import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import {
  CloseBoldIcon,
  FilterIcon,
  FlatButton,
  SecondaryButton,
} from '@commercetools-frontend/ui-kit';
import SearchInput from '../../fields/search-input';
import styles from './filter-search-bar.mod.css';

const messages = defineMessages({
  filterLabel: {
    id: 'Search.FilterSearchBar.filterLabel',
    description: 'Label for "Filter" button.',
    defaultMessage: 'Filter',
  },
  removeAllLabel: {
    id: 'Search.FilterSearchBar.clearAllLabel',
    description: 'Label for the button for clear all',
    defaultMessage: 'Clear all',
  },
});

export const FilterSearchBar = props => (
  <div>
    <div className={styles.container}>
      <div className={styles['toggle-filter-button']}>
        <SecondaryButton
          label={props.intl.formatMessage(messages.filterLabel)}
          isDisabled={props.isFilterButtonDisabled}
          onClick={props.onToggleFilterButton}
          isToggled={props.isFilterButtonActive}
          isToggleButton={true}
          iconLeft={<FilterIcon />}
          data-track-component=""
          data-track-label="Filters"
          data-track-event="click"
        />
      </div>
      <SearchInput
        initialValue={props.initialValue}
        onSubmit={props.onSubmit}
        onChange={props.onChange}
        throttleMS={
          1 /* we pass 1ms to prevent user search before state update */
        }
        placeholder={props.searchInputPlaceholder}
      />
      <div className={styles['clear-button']}>
        {props.showOnClearAll && (
          <FlatButton
            data-testid="clear-all-filters"
            onClick={props.onClearAll}
            icon={<CloseBoldIcon />}
            tone="secondary"
            label={props.intl.formatMessage(messages.removeAllLabel)}
          />
        )}
      </div>
    </div>
    {props.renderQuickFilters({
      onUpdateQuickFilterForField: props.onUpdateQuickFilterForField,
      onRemoveFilterTagFromField: props.onRemoveFilterTagFromField,
    })}
  </div>
);
FilterSearchBar.displayName = 'FilterSearchBar';
FilterSearchBar.propTypes = {
  intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
    .isRequired,
  initialValue: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onToggleFilterButton: PropTypes.func.isRequired,
  isFilterButtonActive: PropTypes.bool.isRequired,
  isFilterButtonDisabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  onClearAll: PropTypes.func.isRequired,
  showOnClearAll: PropTypes.bool.isRequired,
  searchInputPlaceholder: PropTypes.string,

  renderQuickFilters: PropTypes.func,
  onUpdateQuickFilterForField: PropTypes.func.isRequired,
  onRemoveFilterTagFromField: PropTypes.func.isRequired,
};
FilterSearchBar.defaultProps = {
  renderQuickFilters: () => null,
};

export default injectIntl(FilterSearchBar);
