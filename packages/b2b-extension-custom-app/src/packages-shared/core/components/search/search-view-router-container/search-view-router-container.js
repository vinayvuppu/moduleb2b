import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { getIn } from 'formik';
import React from 'react';
import { reportErrorToSentry } from '@commercetools-frontend/sentry';
import SearchView from '../search-view';
import {
  omitVersion,
  matchesVersion,
  augmentWithVersion,
  getFromStorage,
  putToStorage,
  removeFromStorage,
  hasQuery,
  hasStorage,
  decode,
  encodeToUrl,
} from './utils';

const ERROR_CODE_SEARCH_QUERY_VERSION_MISMATCH = 'searchQueryVersionMismatch';

export class SearchViewRouterContainer extends React.PureComponent {
  static displayName = 'SearchViewRouterContainer';

  static propTypes = {
    storageSlice: PropTypes.string,
    onChange: PropTypes.func,
    version: PropTypes.number,

    // withRouter
    location: PropTypes.shape({
      search: PropTypes.string,
      pathname: PropTypes.string,
      query: PropTypes.shape({
        query: PropTypes.string,
      }),
    }).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
      createHref: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    version: 1,
    onChange: () => {},
  };

  componentDidMount() {
    const searchOptions = this.restoreSearchOptions();
    if (searchOptions) {
      const nextTo = this.props.history.createHref({
        pathname: this.props.location.pathname,
        search: encodeToUrl(
          augmentWithVersion(searchOptions),
          this.props.location.search
        ),
      });

      this.props.history.replace(nextTo);
    }
  }

  restoreSearchOptions = () => {
    /**
     * NOTE:
     *   Restoring from storage should only occur if a storageSlice is defined
     *   not query is present in the url (which should take precedence) and
     *   there actually is an item stored.
     */
    if (
      !this.props.storageSlice ||
      hasQuery(this.props.location) ||
      !hasStorage(this.props.storageSlice)
    )
      return null;

    let searchQuery = null;
    try {
      searchQuery = getFromStorage(this.props.storageSlice);

      if (!matchesVersion(searchQuery, this.props.version)) {
        // NOTE: throwing triggers the removal of the previously cached version.
        throw Error(ERROR_CODE_SEARCH_QUERY_VERSION_MISMATCH);
      }
    } catch (e) {
      searchQuery = null;
      removeFromStorage(this.props.storageSlice);

      /**
       * NOTE:
       *   This error is not really severe but worth tracking for visibility.
       *   The user likely tampered with the URL or the localstorage
       *   entry directly.
       *   To have some insights we add as `extraInfo` the `storageSlice`
       *   which contains the view (e.g. discounts-list) and `projectKey`. Moreover, we add the
       *   `rawQuery` which is the base64 encoded version to debug the problem.
       */
      e.message !== ERROR_CODE_SEARCH_QUERY_VERSION_MISMATCH &&
        reportErrorToSentry(
          new Error(
            'SearchViewRouterContainer: failed to restore and parse from localStorage. Removing faulty entry.',
            {
              storageSlice: this.props.storageSlice,
              rawQuery: window.localStorage.getItem(this.props.storageSlice),
            }
          )
        );
    }

    const searchQueryWithoutVersion = omitVersion(searchQuery);

    // NOTE:
    //    Given `omit` receives `null` it returns an empty object.
    //    Given `omit` receives an object with only `{ __version: Int }` it returns an empty object.
    //    Then we must return null to indicate there is no cached search query.
    return Object.keys(searchQueryWithoutVersion).length > 0
      ? searchQueryWithoutVersion
      : null;
  };

  handleSetSearchFilterState = nextSearchOptions => {
    /**
     * NOTE:
     *    Attempt to parse the previous query to embed
     *    it into the url again. Unparsed prev and next
     *    can not be combined.
     */
    let parsedPreviousSearchQuery;

    try {
      const previousSearchQuery = getIn(this.props.location, 'query.query');

      if (previousSearchQuery) {
        parsedPreviousSearchQuery = decode(previousSearchQuery);
      }
    } catch (e) {
      // NOTE: Kind of have to, to not have an empty `catch` block.
      parsedPreviousSearchQuery = {};
    }

    const nextSearchQuery = {
      ...parsedPreviousSearchQuery,
      ...nextSearchOptions,
    };

    if (this.props.storageSlice) {
      putToStorage(
        this.props.storageSlice,
        augmentWithVersion(nextSearchQuery, this.props.version)
      );
    }

    const nextTo = this.props.history.createHref({
      pathname: this.props.location.pathname,
      search: encodeToUrl(
        augmentWithVersion(nextSearchQuery, this.props.version),
        this.props.location.search
      ),
    });

    this.props.history.replace(nextTo);

    this.props.onChange(nextSearchQuery);
  };

  /**
   * NOTE:
   *   When using the router container fetching is handled by the
   *   parent's lifecycle. E.g. a Discount Code list re-renders (receives new props)
   *   and performes fetching via e.g. Apollo. Loading state is then handled up
   *   the tree and not within the `SearchView`. The `onSearch` prop is meant to
   *   return a promise as defined in the `SearchView`. If a parent needs to
   *   be informed about changes in `searchOptions` use `onChange`.
   */
  handleOnSearch = () => {};

  render() {
    const initialSearchQuery = this.restoreSearchOptions();

    return (
      <SearchView
        {...this.props}
        onSearch={this.handleOnSearch}
        setSearchFiltersState={this.handleSetSearchFilterState}
        {...initialSearchQuery}
      />
    );
  }
}

export default withRouter(SearchViewRouterContainer);
