import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { deepEqual } from 'fast-equals';
import { compose } from 'recompose';
import withPendingRequests from '../../../../utils/with-pending-requests';
import injectTracking from '../../tracking/inject-tracking';
import SearchContainer from '../search-container';
import SearchFilterContainer from '../search-filter-container';
import Filters from '../filters';
import FilterSearchBar from '../filter-search-bar';
import FiltersContainer from '../filters-container';
import Pagination from '../pagination';
import styles from './search-view.mod.css';

const messages = defineMessages({
  noResultsText: {
    id: 'Search.View.noResults',
    description: 'Text for no results',
    defaultMessage: 'There are no results matching your search criteria.',
  },
});

const checkIfDataHasChanged = (prevResultIds, nextResultIds) =>
  deepEqual(prevResultIds, nextResultIds);

export class SearchView extends React.Component {
  static displayName = 'SearchView';

  static propTypes = {
    // The action creator to make the search request.
    onSearch: PropTypes.func.isRequired,
    searchInputPlaceholder: PropTypes.string,
    onFilterChange: PropTypes.func,
    // The hook allowing a parent to influence filter state before
    // it is being dispatched
    transformSearchFilterStateBeforeSet: PropTypes.func,
    trackingPrefix: PropTypes.string,
    // Function called to render the table with following arguments:
    // {
    //   rowCount,
    //   results,
    //   sorting,
    //   onSortChange,
    //   registerMeasurementCache
    // }
    filterDefinitions: PropTypes.objectOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        filterTypes: PropTypes.objectOf(
          PropTypes.shape({
            filterComponent: PropTypes.func.isRequired,
            tagComponent: PropTypes.func.isRequired,
            label: PropTypes.string.isRequired,
            canBeAppliedMultipleTimes: PropTypes.bool,
          })
        ).isRequired,
      })
    ).isRequired,
    noResultsText: PropTypes.string,
    areFiltersVisible: PropTypes.bool,

    // Search related props
    searchText: PropTypes.string,
    sorting: PropTypes.shape({
      key: PropTypes.string.isRequired,
      order: PropTypes.string.isRequired,
    }).isRequired,
    filters: PropTypes.objectOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          value: PropTypes.any,
        })
      )
    ),
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    pageSizes: PropTypes.arrayOf(PropTypes.number.isRequired),
    results: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          id: PropTypes.string.isRequired,
        }),
      ])
    ),
    total: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,

    children: PropTypes.func.isRequired,

    // Action creators
    setSearchFiltersState: PropTypes.func.isRequired,

    // Quick filters
    renderQuickFilters: PropTypes.func,

    // HoC
    track: PropTypes.func.isRequired,
    pendingRequests: PropTypes.shape({
      increment: PropTypes.func.isRequired,
      decrement: PropTypes.func.isRequired,
      isLoading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    areFiltersVisible: true,
    trackingPrefix: '',
    transformSearchFilterStateBeforeSet: filterState => filterState,
  };

  measurementCache = null;

  componentDidMount() {
    this.handleUpdateSearch();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    // Take this opportunity to reset the table measurement cache.
    if (
      this.measurementCache &&
      (this.props.count !== nextProps.count ||
        checkIfDataHasChanged(
          this.props.results.map(r => r.id),
          nextProps.results.map(r => r.id)
        ))
    )
      this.measurementCache.clearAll();
  }

  shouldComponentUpdate(nextProps) {
    return !nextProps.pendingRequests.isLoading;
  }

  registerMeasurementCache = cache => {
    this.measurementCache = cache;
  };

  // Those are the props necessary to build the request in the action creator
  getOptionsForSearchRequest = (searchOptions = {}) => ({
    searchText: this.props.searchText,
    sorting: this.props.sorting,
    filters: this.props.filters,
    page: this.props.page,
    perPage: this.props.perPage,
    track: this.props.track,
    ...searchOptions,
  });

  handleUpdateSearch = searchOptions => {
    const optionsForSearchRequest = this.props.transformSearchFilterStateBeforeSet(
      this.getOptionsForSearchRequest(searchOptions),
      Object.keys(searchOptions || {})
    );

    if (searchOptions)
      this.props.setSearchFiltersState(optionsForSearchRequest);

    const result = this.props.onSearch(optionsForSearchRequest);

    // onSearch could return a promise (do something async) or
    // not (do something sync), so we wait for the return value and only
    // show the spinners when a promise was returned (when the return value has ".then")
    if (result && result.then) {
      this.props.pendingRequests.increment();
      result.then(
        () => {
          this.props.pendingRequests.decrement();
        },
        error => {
          this.props.pendingRequests.decrement();
          throw error;
        }
      );
    }
  };

  handleSortChange = (columnKey, sortDirection) => {
    this.handleUpdateSearch({
      sorting: {
        key: columnKey,
        order: sortDirection.toLowerCase(),
      },
    });
  };

  handlePageChange = page => {
    this.handleUpdateSearch({ page });
  };

  handlePerPageChange = perPage => {
    let page = this.props.page;
    // if the switch would cause a completly empty page
    if (this.props.total < (this.props.page - 1) * perPage) {
      page = Math.ceil(this.props.total / perPage);
    }

    this.handleUpdateSearch({ perPage, page });
  };

  createSearchFilterContainerRenderer = ({ onUpdateSearch }) => ({
    isEditMode,
    toggleFilters,
  }) => (
    <div>
      <FiltersContainer
        fieldDefinitions={this.props.filterDefinitions}
        filteredFields={this.props.filters}
        onUpdateSearch={onUpdateSearch}
        searchText={this.props.searchText}
        isEditMode={isEditMode}
        onChange={this.props.onFilterChange}
        trackingPrefix={this.props.trackingPrefix}
      >
        {({
          searchText,
          onClearAll,
          showOnClearAll,
          onChangeSearchText,
          onCancelFilterChanges,
          onApplyFilters,
          onUpdateFilterForField,
          onRemoveFilterFromField,
          onAddFilterToField,
          onAddField,
          onClearFiltersFromField,
          onRemoveFilterTagFromField,
          filteredFields,
          hasChangesInFilters,
          hasChangesInTextSearch,
          onUpdateQuickFilterForField,
        }) => (
          <div>
            <FilterSearchBar
              initialValue={searchText}
              onSubmit={onApplyFilters}
              isFilterButtonActive={isEditMode}
              isFilterButtonDisabled={hasChangesInFilters}
              onToggleFilterButton={toggleFilters}
              onClearAll={onClearAll}
              showOnClearAll={showOnClearAll}
              onChange={onChangeSearchText}
              searchInputPlaceholder={this.props.searchInputPlaceholder}
              renderQuickFilters={this.props.renderQuickFilters}
              onUpdateQuickFilterForField={onUpdateQuickFilterForField}
              onRemoveFilterTagFromField={onRemoveFilterTagFromField}
            />
            <Filters
              trackingPrefix={this.props.trackingPrefix}
              filteredFields={filteredFields}
              fieldDefinitions={this.props.filterDefinitions}
              isEditMode={isEditMode}
              onToggleEditMode={toggleFilters}
              onUpdateFilterForField={onUpdateFilterForField}
              onRemoveFilterFromField={onRemoveFilterFromField}
              onAddFilterToField={onAddFilterToField}
              onAddField={onAddField}
              onApplyFilters={onApplyFilters}
              onCancelFilterChanges={onCancelFilterChanges}
              onRemoveFilterTagFromField={onRemoveFilterTagFromField}
              onClearFiltersFromField={onClearFiltersFromField}
              showSaveToolbar={hasChangesInFilters || hasChangesInTextSearch}
            />
          </div>
        )}
      </FiltersContainer>
    </div>
  );

  render() {
    const hasNoResults = Boolean(
      this.props.total === 0 && !this.props.pendingRequests.isLoading
    );

    return (
      <div className={styles['container-flex']}>
        {this.props.areFiltersVisible ? (
          <SearchContainer onUpdateSearch={this.handleUpdateSearch}>
            {searchProps => (
              <SearchFilterContainer onChange={this.props.onFilterChange}>
                {this.createSearchFilterContainerRenderer(searchProps)}
              </SearchFilterContainer>
            )}
          </SearchContainer>
        ) : null}
        {(hasNoResults || this.props.count > 0) && (
          <div className={styles.results}>
            {this.props.count > 0 && (
              <div className={styles['container-flex']}>
                {this.props.children({
                  searchText: this.props.searchText,
                  rowCount: this.props.count,
                  results: this.props.results,
                  sorting: this.props.sorting,
                  onSortChange: this.handleSortChange,
                  registerMeasurementCache: this.registerMeasurementCache,
                  footer: (
                    <Pagination
                      pageSizes={this.props.pageSizes}
                      totalItems={this.props.total}
                      perPage={this.props.perPage}
                      onPerPageChange={this.handlePerPageChange}
                      page={this.props.page}
                      onPageChange={this.handlePageChange}
                    />
                  ),
                })}
              </div>
            )}
            {hasNoResults && (
              <span className={styles['no-results']}>
                {this.props.noResultsText ? (
                  this.props.noResultsText
                ) : (
                  <FormattedMessage {...messages.noResultsText} />
                )}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default compose(injectTracking, withPendingRequests())(SearchView);
