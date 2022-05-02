import React from 'react';
import { wrapDisplayName } from 'recompose';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { reportErrorToSentry } from '@commercetools-frontend/sentry';
import {
  omitVersion,
  matchesVersion,
  augmentWithVersion,
  hasQuery,
  decode,
  putToStorage,
  encodeToUrl,
} from './utils';

export class SearchViewRouterSearchQuery extends React.Component {
  static displayName = 'SearchViewRouterSearchQuery';

  static propTypes = {
    children: PropTypes.func.isRequired,

    storageSlice: PropTypes.string,
    version: PropTypes.number,
    initialSearchQuery: PropTypes.object,

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
    initialSearchQuery: {},
  };

  getSearchQuery = () => {
    if (!hasQuery(this.props.location)) {
      return this.props.initialSearchQuery;
    }

    let searchQuery;
    try {
      // NOTE: We do not augment the version to what's read from the url
      // as it should contain none (prior to the addition) or a version.
      // This allows us to bust the cached search query.
      searchQuery = decode(this.props.location.query.query);
    } catch (e) {
      searchQuery = augmentWithVersion(
        this.props.initialSearchQuery,
        this.props.version
      );

      /**
       * NOTE:
       *   This error is not really severe but worth tracking for visibility.
       *   The user likely tampered with the URL directly.
       *   To have some insights we add as `extraInfo` the `storageSlice`
       *   which contains the view (e.g. discounts-list) and `projectKey`. Moreover, we add the
       *   `rawQuery` which is the base64 encoded version to debug the problem.
       */
      reportErrorToSentry(
        new Error(
          'SearchViewRouterQuery: failed to parse from the url. Defaulting to iniital query.',
          {
            storageSlice: this.props.storageSlice,
            rawQuery: this.props.location.query.query,
            version: this.props.version,
          }
        )
      );
    }
    // NOTE: At this point we read the search query successfully or fell back to the initial
    // version. Now we compare versions to ensure having control over busting the cached query.
    if (!matchesVersion(searchQuery, this.props.version)) {
      searchQuery = this.props.initialSearchQuery;
    }

    // NOTE: In this case everything worked fine and we can restore.
    return omitVersion({
      ...this.props.initialSearchQuery,
      ...searchQuery,
    });
  };

  setSearchQuery = nextSearchQuery => {
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
  };

  render() {
    return this.props.children({
      searchQuery: this.getSearchQuery(),
      getSearchQuery: this.getSearchQuery,
      setSearchQuery: this.setSearchQuery,
    });
  }
}

export const EnhancedSearchViewRouterSearchQuery = withRouter(
  SearchViewRouterSearchQuery
);

export const withSearchViewRouterSearchQuery = ({
  propName = 'searchQuery',
  version = 1,
  storageSlice,
  initialSearchQuery,
} = {}) => WrappedComponent =>
  class extends React.Component {
    static displayName = wrapDisplayName(
      WrappedComponent,
      'withSearchViewRouterSearchQuery'
    );

    render() {
      return (
        <EnhancedSearchViewRouterSearchQuery
          initialSearchQuery={initialSearchQuery}
          version={version}
          storageSlice={storageSlice(this.props)}
        >
          {({ searchQuery, getSearchQuery, setSearchQuery }) => {
            const searchQueryProps = {
              [propName]: {
                value: searchQuery,
                set: setSearchQuery,
                get: getSearchQuery,
              },
            };

            return <WrappedComponent {...this.props} {...searchQueryProps} />;
          }}
        </EnhancedSearchViewRouterSearchQuery>
      );
    }
  };

export default EnhancedSearchViewRouterSearchQuery;
