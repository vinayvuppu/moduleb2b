import PropTypes from 'prop-types';
import React from 'react';
import SearchView from '../search-view';

export class SearchViewControlledContainer extends React.Component {
  static displayName = 'SearchViewControlledContainer';

  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  handleChange = nextSearchOptions => {
    this.props.onChange(nextSearchOptions);
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
    return (
      <SearchView
        {...this.props}
        onSearch={this.handleOnSearch}
        setSearchFiltersState={this.handleChange}
        {...this.props.value}
      />
    );
  }
}

export default SearchViewControlledContainer;
