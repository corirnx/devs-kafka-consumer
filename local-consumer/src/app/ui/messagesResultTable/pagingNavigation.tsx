import React, { useState } from 'react';

interface PagingNavigationProps {
    pagingTitle: string;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const PagingNavigation: React.FC<PagingNavigationProps> = ({ pagingTitle, totalItems, itemsPerPage, onPageChange }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            onPageChange(nextPage);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            onPageChange(prevPage);
        }
    };

    return (
        <div className="flex justify-between mt-4 mb-4">
            <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded disabled:opacity-50"
            >
                Previous
            </button>
            <span className="text-white">
                {pagingTitle} {currentPage} of {totalPages}
            </span>
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default PagingNavigation;