import React, { useEffect, useState } from 'react'

const InputBox = ({ name, type, id, value, label, max, required = false, specificationLabel, onChange, placeholder, disabled  }) => {

    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        // Update local state when the external value changes
        setInputValue(value);
    }, [value]);

    const handleChange = (e) => {
        setInputValue(e.target.value);
        onChange(name, e.target.value);
    };
    
    const isDisabled = disabled ? true : false;

    return (
        <div className='flex flex-col flex-start'>
            
            {   label == '' ? null :
                <label className="flex mb-2">
                    {required && <span className='text-red-500'>*</span>} {specificationLabel ? specificationLabel : label}:
                </label>
            }

            {/* {
                disabled ?
                <input 
                    name={name}
                    type={type}
                    value={inputValue}
                    id={id}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className='w-[100%] rounded-md p-2 pl-12 border border-gray-300'
                    disabled
                />
                :
                null
            } */}

            {
                type == "date" ? 
                <input 
                    name={name}
                    type={type}
                    value={inputValue}
                    id={id}
                    max={max}
                    onChange={handleChange}
                    className='w-[100%] rounded-md p-2 pl-12 border border-gray-300'
                />
                :
                disabled ?
                <input 
                    name={name}
                    type={type}
                    value={inputValue}
                    id={id}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`
                        w-[100%] 
                        rounded-md 
                        p-2 
                        pl-12 
                        border 
                        border-gray-300
                        text-gray-500
                        bg-white
                        cursor-not-allowed
                    `}
                    disabled
                />
                :
                <input 
                    name={name}
                    type={type}
                    value={inputValue}
                    id={id}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className='w-[100%] rounded-md p-2 pl-12 border border-gray-300'
                />
            }
            
            
        </div>
    )
}

export default InputBox