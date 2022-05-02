import PropTypes from 'prop-types';
import React from 'react';
import PerPageSwitcher from '../../tables/paginators/per-page-switcher';
import RangePaginator, {
  getTotalPages,
} from '../../tables/paginators/range-paginator';
import styles from './pagination.mod.css';

const RESULTS_PER_PAGE_OPTIONS = [20, 50];

const Pagination = props => {
  // calculate itemsOnPage from total, page and perPage
  const totalPages = getTotalPages(props.totalItems, props.perPage);
  const itemsOnPage =
    props.page === totalPages
      ? props.totalItems - props.perPage * (props.page - 1)
      : props.perPage;

  return (
    <div className={styles.container}>
      <div>
        <PerPageSwitcher
          perPage={props.perPage}
          itemsOnPage={itemsOnPage}
          onPerPageChange={props.onPerPageChange}
          options={props.pageSizes}
        />
      </div>
      <div>
        <RangePaginator
          totalItems={props.totalItems}
          perPage={props.perPage}
          page={props.page}
          onPageChange={props.onPageChange}
        />
      </div>
    </div>
  );
};
Pagination.displayName = 'Pagination';
Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  pageSizes: PropTypes.arrayOf(PropTypes.number.isRequired),

  onPerPageChange: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
Pagination.defaultProps = {
  pageSizes: RESULTS_PER_PAGE_OPTIONS,
};

export default Pagination;
