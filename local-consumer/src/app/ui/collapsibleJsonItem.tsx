import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface CollapsibleJsonItemProps {
    data: any;
}

const CollapsibleJsonItem: React.FC<CollapsibleJsonItemProps> = ({ data }) => {
    const [collapsed, setCollapsed] = useState(true);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div>
            <div className="flex items-start">
                <button onClick={toggleCollapse}
                    className="text-green-500 underline flex items-center">
                    {collapsed
                        ? <span className='flex items-center' role='expand'><ChevronRightIcon className="h-5 w-5" />expand</span>
                        : <span className='flex items-center' role='collapse'><ChevronDownIcon className="h-5 w-5" />collapse</span>}
                </button>

            </div>
            {!collapsed && (
                <pre className="whitespace-pre-wrap">
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}
        </div>
    );
};

export default CollapsibleJsonItem;