import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import * as searchActions from '../../../actions/search';
import {
  selectIsSearchSliceInitialized,
  selectSearchFilters,
  selectSearchResults,
  selectSearchTotal,
  selectSearchCount,
} from '../../../reducers/search';
import SearchView from '../search-view';

// This component is exported only for testing. Use `SearchViewWithReduxState`.
export class SearchViewContainer extends React.PureComponent {
  static displayName = 'SearchViewContainer';

  static propTypes = {
    initialSliceState: PropTypes.object,
    isSearchSliceInitialized: PropTypes.bool.isRequired,
    searchSliceName: PropTypes.string.isRequired,
    // Action creators
    initializeSearchSlice: PropTypes.func.isRequired,
    setSearchFiltersState: PropTypes.func.isRequired,
  };

  static defaultProps = { initialSliceState: {} };

  componentDidMount() {
    if (!this.props.isSearchSliceInitialized)
      this.props.initializeSearchSlice(
        this.props.initialSliceState,
        this.props.searchSliceName
      );
  }

  handleSetSearchFilterState = opts => {
    this.props.setSearchFiltersState(opts, this.props.searchSliceName);
  };

  render() {
    return this.props.isSearchSliceInitialized ? (
      <SearchView
        {...this.props}
        setSearchFiltersState={this.handleSetSearchFilterState}
      />
    ) : null;
  }
}

const mapStateToProps = (state, ownProps) => {
  const searchSliceName = ownProps.searchSliceName;
  const initialSliceState = ownProps.initialSliceState;
  const isSearchSliceInitialized = selectIsSearchSliceInitialized(
    state,
    searchSliceName
  );
  return isSearchSliceInitialized
    ? {
        isSearchSliceInitialized,
        ...selectSearchFilters(state, searchSliceName),
        results: selectSearchResults(state, searchSliceName),
        total: selectSearchTotal(state, searchSliceName),
        count: selectSearchCount(state, searchSliceName),
      }
    : { isSearchSliceInitialized, initialSliceState };
};
const mapDispatchToProps = {
  initializeSearchSlice: searchActions.initializeSearchSlice,
  setSearchFiltersState: searchActions.setSearchFiltersState,
};

// eslint-disable-next-line import/prefer-default-export
export const SearchViewWithReduxState = connect(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  // If the parent component manages some state about the table outside of it,
  // and the state changes, the table will not be re-rendered because the
  // (connected) props didn't change, thus `connect` will prevent the child to
  // render again (and therefore the table).
  // For now, until we find a better solution, we disable the equality checks
  // done by `connect`, causing always a re-render.
  { pure: false }
)(SearchViewContainer);
