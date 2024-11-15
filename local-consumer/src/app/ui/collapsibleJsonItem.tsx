import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface CollapsibleJsonItemProps {
    data: any;
    key: any;
}

const CollapsibleJsonItem: React.FC<CollapsibleJsonItemProps> = ({ data, key }) => {
    const [collapsed, setCollapsed] = useState(true);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <li key={key}>
            <div className="flex items-start">
                <button onClick={toggleCollapse}
                    className="text-green-500 underline">
                    {collapsed
                        ? <span><ChevronRightIcon className="h-5 w-5" />expand</span>
                        : <span><ChevronDownIcon className="h-5 w-5" />collapse</span>}
                </button>

            </div>
            {!collapsed && (
                <pre className="whitespace-pre-wrap">
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}
        </li>
    );
};

export default CollapsibleJsonItem;