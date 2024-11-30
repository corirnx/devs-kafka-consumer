import React,{ useState } from "react";
import MessagesTable from "./messagesResultTable";
import { PartitionedMessages } from '@/lib/types';


interface PagedTableProps {
    partitionedMessages: PartitionedMessages[];
}

const PagedTable: React.FC<PagedTableProps> = ({ partitionedMessages }) => {
    const [currentPartitionIndex, setCurrentPartitionIndex] = useState(1);
    const itemsPerPage = 1;

    const totalPages = Math.ceil(partitionedMessages.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPartitionIndex < totalPages) {
            setCurrentPartitionIndex(currentPartitionIndex + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPartitionIndex > 1) {
            setCurrentPartitionIndex(currentPartitionIndex - 1);
        }
    };

    const startIndex = (currentPartitionIndex - 1) * itemsPerPage;
    const selectedMessages = partitionedMessages.slice(startIndex, startIndex + itemsPerPage);



    return (
        <div>
            <div className="flex justify-between mt-4 mb-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPartitionIndex === 1}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-white">
                    Partition {currentPartitionIndex} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPartitionIndex === totalPages}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            {partitionedMessages.length > 0 && (
                <MessagesTable partition={partitionedMessages[currentPartitionIndex]} />
            )}
        </div>
    );
};

export default PagedTable;