// src/components/common/Input.jsx

import React from 'react';

function Input({ label, type = 'text', value, onChange, placeholder, className = '', required = false, disabled = false }) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && <label className="font-semibold text-sm">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="bg-white p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B9BE] disabled:bg-gray-200"
                required={required}
                disabled={disabled}
            />
        </div>
    );
}

export default Input;
