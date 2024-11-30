import React, { useState } from 'react';
import CollapsibleJsonItem from '../collapsibleJsonItem';
import { PartitionedMessages } from '@/lib/types';
import TableHeaderCell from './tableHeaderCell';
import TableColumnCell from './tableColumnCell';

interface MessagesTableProps {
    partition: PartitionedMessages;
}

const MessagesTable: React.FC<MessagesTableProps> = ({ partition: data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(data.messages.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const selectedMessages = data.messages.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <TableHeaderCell headerTitle={"id"} />
                        <TableHeaderCell headerTitle={"partition"} />
                        <TableHeaderCell headerTitle={"key"} />
                        <TableHeaderCell headerTitle={"timestamp"} />
                        <TableHeaderCell headerTitle={"size"} />
                        <TableHeaderCell headerTitle={"offset"} />
                        <TableHeaderCell headerTitle={"header"} />
                        <TableHeaderCell headerTitle={"value"} />
                    </tr>
                </thead>
                <tbody className="bg-white divide-y text-black">
                    {selectedMessages.map((item, itemIndex) => (
                        <tr key={itemIndex}>
                            <TableColumnCell columnValue={startIndex + itemIndex} />
                            <TableColumnCell columnValue={item.partition} />
                            <TableColumnCell columnValue={item.key} />
                            <TableColumnCell columnValue={new Date(item.timestamp).toLocaleString()} />
                            <TableColumnCell columnValue={item.size} />
                            <TableColumnCell columnValue={item.offset} />
                            <TableColumnCell columnValue={
                                <CollapsibleJsonItem data={item.header} />
                            } />
                            <TableColumnCell columnValue={
                                <CollapsibleJsonItem data={item.message} />
                            } />
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-white">
                    Messages Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MessagesTable;