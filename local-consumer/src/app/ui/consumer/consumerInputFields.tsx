import Link from "next/link";
import InputField from "../text-input";
import PlayCircleIcon from "@heroicons/react/20/solid/PlayCircleIcon";

interface ConsumerInputFieldsProps {
    refHost: React.RefObject<HTMLInputElement>;
    refTopic: React.RefObject<HTMLInputElement>;
    refConsumerId: React.RefObject<HTMLInputElement>;
    handleConsumeClick: () => void;
  }
  
  const ConsumerInputFields: React.FC<ConsumerInputFieldsProps> = ({ refHost, refTopic, refConsumerId, handleConsumeClick }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField placeholder="host" name="inputHost" ref={refHost} />
        <InputField placeholder="topic name" name="inputTopic" ref={refTopic} />
        <InputField placeholder="consumer group id" name="inputConsumerGroupId" ref={refConsumerId} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Link href='' onClick={handleConsumeClick}
            className="flex h-[48px] w-auto w-max:15 grow gap-2 rounded-full 
            md:flex-none md:justify-start md:p-2 md:px-3 p-3 
            bg-green-500 hover:bg-green-400">
            <PlayCircleIcon className="w-8 text-white hover:text-black rounded-full m-auto h-auto justify-center items-center" />
          </Link>
        </div>
      </div>
    );
  };
  
  export default ConsumerInputFields;