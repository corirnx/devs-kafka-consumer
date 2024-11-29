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
                    className=" underline flex items-center">
                    {collapsed
                        ? <span className='flex items-center' role='expand'>
                            <ChevronRightIcon className="h-5 w-5 text-green-500 font-bold" />
                            <div className='hover:font-bold'>
                                expand
                            </div>
                        </span>
                        : <span className='flex items-center' role='collapse'>
                            <ChevronDownIcon className="h-5 w-5 text-green-500 font-bold" />
                            <div className='hover:font-bold'>
                                collapse
                            </div>
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