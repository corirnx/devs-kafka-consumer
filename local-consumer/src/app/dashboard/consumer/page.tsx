'use client';

import PlayCircleIcon from "@heroicons/react/20/solid/PlayCircleIcon";
import Link from "next/link";
import { Suspense, useRef, useState } from "react";
import { ConsumerResponse } from "@/lib/types";
import InputField from "@/app/ui/text-input";
import DashboardSkeleton from "@/app/ui/loading";


export default function ConsumerViewer() {
    const [loading, setLoading] = useState(false);
    const refHost = useRef<HTMLInputElement>(null);
    const refTopic = useRef<HTMLInputElement>(null);
    const refConsumerId = useRef<HTMLInputElement>(null);

    const [consumerResponse, setConsumerResponse] = useState<ConsumerResponse>({ status: '', data: [], error: '' });

    const handleConsumeClick = async () => {
        setLoading(true);
        const consumerGroupId = refConsumerId.current?.value || 'defaultGroupId';
        const host = refHost.current?.value || '';
        const topic = refTopic.current?.value || '';
        if (!consumerGroupId || !host || !topic) {
            console.error('ConsumerGroupId is required');
            return;
        }

        try {
            const response = await fetch('/api/consumers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ host, topic, consumerGroupId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response from server:', errorData);
                throw new Error(`Failed to consume topic: ${errorData.message || response.statusText}`);
            }

            const responseData = await response.json();
            setConsumerResponse(responseData);
        } catch (error: any) {
            console.error('Error consuming topic:', error);
            setConsumerResponse({ status: 'error', data: [], error: error.message });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <h1 className={"mb-4 text-xl md:text-2xl text-center"} role="heading">
                Local Consumer
            </h1>
            <div className="flex mr-auto ml-auto justify-center">
                <div className="flex h-full flex-col px-3 py-4 md:px-2">
                    <div className="p-4 bg-gray-300 dark:bg-gray-700 rounded-lg h-max-96 overflow-y-auto">
                        <div className="flex items-start gap-2">
                            <InputField placeholder="host" name="inputHost" ref={refHost} />
                            <InputField placeholder="topic name" name="inputTopic" ref={refTopic} />
                            <InputField placeholder="consumer group id" name="inputConsumerGroupId" ref={refConsumerId} />
                        </div>
                        <div className="flex items-start mt-2">
                            <Link href='' onClick={handleConsumeClick}
                                className="flex h-[48px] w-full grow  gap-2 rounded-full 
                            md:flex-none md:justify-start md:p-2 md:px-3 p-3 
                            bg-green-500 hover:bg-green-400 ">
                                <PlayCircleIcon className="w-8 text-white hover:text-black rounded-full m-auto h-auto justify-center items-center" />
                            </Link>
                        </div>
                        <div className="flex items-start gap-2 mt-2">
                            <h4 className="font-bold">Response</h4>
                            <ul className="overflow-auto w-auto">
                                <Suspense fallback={<DashboardSkeleton />}>
                                    {loading ? (
                                        <li className="">
                                            <svg
                                                className="animate-spin h-8 w-8 text-gray-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                        </li>
                                    ) : (
                                        <>
                                            <li className="font-semibold">{consumerResponse.status}</li>
                                            {consumerResponse.error ? (
                                                <li>
                                                    <pre>{consumerResponse.error}</pre>
                                                </li>
                                            ) : (
                                                consumerResponse.data?.map((item, index) => (
                                                    <li key={index}>
                                                        <pre>{JSON.stringify(item, null, 2)}</pre>
                                                    </li>
                                                ))
                                            )}
                                        </>
                                    )}
                                </Suspense>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>




    );
}
