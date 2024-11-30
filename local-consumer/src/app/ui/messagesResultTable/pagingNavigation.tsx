import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";

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
                role='paging-left'
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-green-300 hover:bg-green-200 text-black rounded disabled:opacity-50"
            >
                <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <span className="text-white">
                {pagingTitle} {currentPage} of {totalPages}
            </span>
            <button
                role='paging-right'
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-green-300 hover:bg-green-200 text-black rounded disabled:opacity-50"
            >
                <ArrowRightIcon className="h-5 w-5" />
            </button>
        </div>
    );
};

export default PagingNavigation;