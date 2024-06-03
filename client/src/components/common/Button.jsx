// src/components/common/Button.jsx

import React from "react";

function Button({ children, className = '', ...rest }) {
    return (
        <button
            className={`px-4 py-2 font-semibold text-white text-sm disabled:bg-[#FA691A]/20 bg-[#70B9BE] rounded-xl ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
}

Button.Secondary = function Secondary({ children, className = '', ...rest }) {
    return (
        <button
            className={`px-4 py-2 font-semibold text-sm disabled:bg-[#FA691A]/20 border border-[#70B9BE] rounded-xl text-[#70B9BE] ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

Button.Destructive = function Destructive({ children, className = '', ...rest }) {
    return (
        <button
            className={`px-4 py-2 font-semibold text-sm bg-red-500 border border-red-500 rounded-xl text-white ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
