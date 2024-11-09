import React, { forwardRef } from 'react';

interface InputFieldProps {
    placeholder?: string;
    name?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({ placeholder, name }, ref) => {
    return (
        <input
            type="text"
            name={name}
            placeholder={placeholder}
            ref={ref}
            className="gap-2 mb-2 h-10 sm:h-12 px-4 sm:px-5 py-2 pl-10 ml-0 w-full 
            border border-gray-200 outline-2 border-solid border-transparent transition-colors 
            flex items-center justify-left peer rounded-md bg-foreground text-background           
            hover:bg-[#383838] dark:hover:bg-green-100 
            text-sm sm:text-base md:text-md text-left 
            placeholder:text-gray-500 dark:text-black text-white"
        />
    );
});

export default InputField;