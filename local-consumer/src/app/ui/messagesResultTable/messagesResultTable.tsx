import React from 'react';
import CollapsibleJsonItem from '../collapsibleJsonItem';
import { PartitionedMessages } from '@/lib/types';
import TableHeaderCell from './tableHeaderCell';
import TableColumnCell from './tableColumnCell';

interface MessagesTableProps {
    partition: PartitionedMessages;
}

const MessagesTable: React.FC<MessagesTableProps> = ({ partition: data }) => {
    return (
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
                {data.messages.map((item, itemIndex) => (
                    <tr key={itemIndex}>
                        <TableColumnCell columnValue={itemIndex} />
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
    );
};

export default MessagesTable;