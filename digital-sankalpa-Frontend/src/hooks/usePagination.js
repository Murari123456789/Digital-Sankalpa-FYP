import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const usePagination = (defaultPage = 1, defaultPerPage = 12) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page') || defaultPage, 10),
    perPage: defaultPerPage,
    totalItems: 0,
    totalPages: 0,
  });

  // Update when URL parameters change
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || defaultPage, 10);
    setPagination(prev => ({
      ...prev,
      currentPage: page,
    }));
  }, [searchParams, defaultPage]);

  // Set total items and calculate total pages
  const setTotalItems = (total) => {
    const totalPages = Math.ceil(total / pagination.perPage);
    setPagination(prev => ({
      ...prev,
      totalItems: total,
      totalPages: totalPages,
    }));
  };

  // Navigate to a specific page
  const goToPage = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  // Go to next page
  const nextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      goToPage(pagination.currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (pagination.currentPage > 1) {
      goToPage(pagination.currentPage - 1);
    }
  };

  return {
    pagination,
    setTotalItems,
    goToPage,
    nextPage,
    prevPage,
  };
};