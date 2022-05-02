import PropTypes from 'prop-types';
import React from 'react';
import { Collapsible } from '@commercetools-frontend/ui-kit';
import { SEARCH_FILTERS_EVENTS } from '..';
import Shadow from '../../shadow';
import styles from './search-filter-container.mod.css';

const SearchFilterContainer = props => (
  <Shadow depth="1" className={styles.container}>
    <Collapsible isDefaultClosed={true}>
      {({ isOpen, toggle }) => {
        props.onChange({
          eventName: SEARCH_FILTERS_EVENTS.toggleEditMode,
          isOpen,
        });
        return props.children({
          isEditMode: isOpen,
          toggleFilters: toggle,
        });
      }}
    </Collapsible>
  </Shadow>
);
SearchFilterContainer.displayName = 'SearchFilterContainer';
SearchFilterContainer.propTypes = {
  children: PropTypes.func.isRequired,
  onChange: PropTypes.func,
};
SearchFilterContainer.defaultProps = {
  onChange: () => {},
};

export default SearchFilterContainer;
