import React from 'react';

interface TableColumnCellProps {
    columnValue: React.ReactNode;
}

const TableColumnCell: React.FC<TableColumnCellProps> = ({ columnValue: value }) => {
    return (
        <td className="px-6 py-4 whitespace-nowrap">{value}</td>
    );
};

export default TableColumnCell;