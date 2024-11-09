'use client';

import PlayCircleIcon from "@heroicons/react/20/solid/PlayCircleIcon";
import Link from "next/link";
import { Suspense, useRef, useState } from "react";
import { ConsumerResponse } from "@/lib/types";
import InputField from "@/app/ui/text-input";
import LoadingCircle from "@/app/ui/loading";


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
                                <Suspense fallback={<LoadingCircle />}>
                                    {loading ? (
                                        <li className="">
                                            <LoadingCircle />
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
