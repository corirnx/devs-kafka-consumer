import React, { useState } from "react";
import MessagesTable from "./messagesResultTable";
import { PartitionedMessages } from '@/lib/types';
import PagingNavigation from "./pagingNavigation";


interface PagedTableProps {
    partitionedMessages: PartitionedMessages[];
}

const PagedTable: React.FC<PagedTableProps> = ({ partitionedMessages }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const currentIndex = (currentPage - 1) * itemsPerPage;

    return (
        <div>
            <PagingNavigation
                pagingTitle={"Partition"}
                totalItems={partitionedMessages.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange} />
            {partitionedMessages.length > 0 && (
                <MessagesTable partition={partitionedMessages[currentIndex]} />
            )}
        </div>
    );
};

export default PagedTable;