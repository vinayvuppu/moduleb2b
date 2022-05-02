import React from 'react';
import { DefaultPageSize } from '../../utils/constants';

const usePaginationState = () => {
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(DefaultPageSize);
  const [sorting, setSorting] = React.useState({
    key: 'createdAt',
    order: 'desc',
  });
  const onSortingChange = React.useCallback(
    (key, order) => setSorting({ key, order }),
    []
  );

  return {
    perPage: {
      current: perPage,
      onChange: setPerPage,
    },
    page: {
      current: page,
      onChange: setPage,
    },
    sorting: {
      current: sorting,
      onChange: onSortingChange,
    },
  };
};

export default usePaginationState;
