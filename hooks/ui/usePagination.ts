// hooks/usePagination.ts

import { useState } from 'react';

export const usePagination = (
  defaultLimit: number | 'All' = 10
) => {
  const [page, setPage] = useState(1);

  const [limit, setLimit] =
    useState<number | 'All'>(
      defaultLimit
    );

  const resetPagination = () => {
    setPage(1);
    setLimit(defaultLimit);
  };

  return {
    page,
    setPage,

    limit,
    setLimit,

    resetPagination,
  };
};