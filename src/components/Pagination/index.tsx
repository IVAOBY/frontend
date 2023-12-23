import React from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, className }) => {
    const generatePageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className={`flex gap-1 items-center justify-center ${className}`}>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    className={`px-3 py-1 bg-ivao-blue text-white rounded-md ${
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
                    className={`px-3 py-1 min-w-10 ${
                        currentPage === page
                            ? 'bg-ivao-blue text-white rounded-md'
                            : 'bg-ivao-grey text-gray-700 hover:bg-ivao-lightBlue hover:text-white rounded-md'
                    }`}
                >
                    {page}
                </button>
            ))}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    className={`px-3 py-1 bg-ivao-blue text-white rounded-md ${
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