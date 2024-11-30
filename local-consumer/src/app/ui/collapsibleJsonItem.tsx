import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface CollapsibleJsonItemProps {
    data: Record<string, any> | undefined;
}

const CollapsibleJsonItem: React.FC<CollapsibleJsonItemProps> = ({ data }) => {
    const [collapsed, setCollapsed] = useState(true);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    if (data === undefined || Object.keys(data).length === 0) {
        console.log('data is undefined or empty');
        return (<></>);
    }

    const jsonString = JSON.stringify(data, null, 2);
    const preview = jsonString.length > 50 ? jsonString.substring(0, 50) + '...' : jsonString;

    return (
        <div>
            <div className="flex items-start">
                <button onClick={toggleCollapse}
                    className=" underline flex items-center">
                    {collapsed
                        ? <span className='flex items-center' role='expand'>
                            <ChevronRightIcon className="h-5 w-5 text-green-500 font-bold" />
                            {preview}
                        </span>
                        : <span className='flex items-center' role='collapse'>
                            <ChevronDownIcon className="h-5 w-5 text-green-500 font-bold" />
                            collapse
                        </span>}
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