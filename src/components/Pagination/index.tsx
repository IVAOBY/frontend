import React from 'react';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const generatePageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        className={`rounded-md bg-atmos-700 px-3 py-1 text-white ${
          currentPage === 1 ? 'cursor-not-allowed' : ''
        }`}
        disabled={currentPage === 1}
      >
        <IconChevronLeft />
      </button>

      {generatePageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`min-w-10 px-3 py-1 transition ${
            currentPage === page
              ? 'rounded-md bg-atmos-700 text-white'
              : 'rounded-md bg-gray-300 text-gray-700 hover:bg-ocean-600 hover:text-white'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        className={`rounded-md bg-atmos-700 px-3 py-1 text-white ${
          currentPage === totalPages ? 'cursor-not-allowed' : ''
        }`}
        disabled={currentPage === totalPages}
      >
        <IconChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
