import { StarIcon } from '@heroicons/react/24/outline';

export default function DevsLogo() {
  return (
    <div className={'flex flex-row items-center leading-none text-white'}>
      <StarIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px] ">lazy</p>
    </div>
  );
}
