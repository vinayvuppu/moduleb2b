import PropTypes from 'prop-types';
import React from 'react';
import styles from './search-container.mod.css';

export default class extends React.PureComponent {
  static displayName = 'SearchContainer';

  static propTypes = {
    onUpdateSearch: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
  };

  handleUpdateSearch = ({ filters, searchText, page }) => {
    this.props.onUpdateSearch({
      filters,
      searchText,
      page,
    });
  };

  handleUpdateSorting = sorting => {
    this.props.onUpdateSearch({ sorting });
  };

  render() {
    return (
      <div className={styles.container}>
        {this.props.children({
          onUpdateSearch: this.handleUpdateSearch,
          onUpdateSorting: this.handleUpdateSorting,
        })}
      </div>
    );
  }
}
