// src/components/common/TextareaField.jsx
import React from 'react';

const TextareaField = ({ label, id, name, value, onChange, placeholder, disabled, icon, rows = 4 }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-3.5 text-gray-400">
                        {icon}
                    </div>
                )}
                <textarea
                    id={id}
                    name={name}
                    rows={rows}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`block w-full py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 ${icon ? 'pl-10 pr-3' : 'px-3'}`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};

export default TextareaField;