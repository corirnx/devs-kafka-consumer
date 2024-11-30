import React from 'react';

interface TableHeaderCellProps {
    headerTitle: React.ReactNode;
}

const TableHeaderCell: React.FC<TableHeaderCellProps> = ({ headerTitle }) => {
    return (
        <th className="px-6 py-3 bg-gray-200 text-left text-xs text-black uppercase tracking-wider">
            {headerTitle}
        </th>
    );
};

export default TableHeaderCell;