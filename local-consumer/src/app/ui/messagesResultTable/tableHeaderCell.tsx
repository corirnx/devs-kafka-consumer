import React from 'react';

interface TableHeaderCellProps {
    headerTitle: React.ReactNode;
}

const TableHeaderCell: React.FC<TableHeaderCellProps> = ({ headerTitle: header }) => {
    return (
        <th className="px-6 py-3 bg-gray-200 text-left text-xs text-black uppercase tracking-wider">
            {header}
        </th>
    );
};

export default TableHeaderCell;