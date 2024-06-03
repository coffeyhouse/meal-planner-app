// src/components/common/Select.jsx

import React from 'react';

function Select({ label, value, onChange, options, className = '', required = false, disabled = false }) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && <label className="font-semibold text-sm">{label}</label>}
            <select
                value={value}
                onChange={onChange}
                className="bg-white p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B9BE] disabled:bg-gray-200"
                required={required}
                disabled={disabled}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Select;
