import ConsumerViewer from "../consumer/page";

export default function Page() {

    return (
        <main className=''>
            <h1 className={"mb-4 text-xl md:text-2xl text-center"}>
                Local Consumer
            </h1>
            <div className="flex mr-auto ml-auto justify-center">
                <ConsumerViewer />
            </div>
        </main>
    );
}