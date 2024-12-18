import React, { useState } from 'react';
import CollapsibleJsonItem from '../collapsibleJsonItem';
import { PartitionedMessages } from '@/lib/types';
import TableHeaderCell from './tableHeaderCell';
import TableColumnCell from './tableColumnCell';
import PagingNavigation from './pagingNavigation';

interface MessagesTableProps {
    partition: PartitionedMessages;
}

const MessagesTable: React.FC<MessagesTableProps> = ({ partition }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const selectedMessages = partition.messages.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <TableHeaderCell headerTitle={"no."} />
                        <TableHeaderCell headerTitle={"partition"} />
                        <TableHeaderCell headerTitle={"key"} />
                        <TableHeaderCell headerTitle={"timestamp"} />
                        <TableHeaderCell headerTitle={"value"} />
                        <TableHeaderCell headerTitle={"header"} />
                        <TableHeaderCell headerTitle={"offset"} />
                        <TableHeaderCell headerTitle={"size"} />
                    </tr>
                </thead>
                <tbody className="bg-white divide-y text-black">
                    {selectedMessages.map((item, itemIndex) => (
                        <tr key={itemIndex}>
                            <TableColumnCell columnValue={startIndex + itemIndex} />
                            <TableColumnCell columnValue={item.partition} />
                            <TableColumnCell columnValue={item.key} />
                            <TableColumnCell columnValue={new Date(item.timestamp).toLocaleString()} />
                            <TableColumnCell columnValue={
                                <CollapsibleJsonItem data={item.message} />
                            } />
                            <TableColumnCell columnValue={
                                <CollapsibleJsonItem data={item.header || {}} />
                            } />
                            <TableColumnCell columnValue={item.offset} />
                            <TableColumnCell columnValue={item.size} />
                        </tr>
                    ))}
                </tbody>
            </table>
            <PagingNavigation
                pagingTitle={"Messages Page"}
                totalItems={partition.messages.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange} />
        </div>
    );
};

export default MessagesTable;