import React from "react";

function Button({ children, ...rest }) {
    return (
        <button
            className='px-4 py-2 rounded text bg-[#FA691A] font-semibold text-white text-sm disabled:bg-[#FA691A]/20'
            {...rest}
        >
            {children}
        </button>
    )
}

Button.Secondary = function Secondary({ children, ...rest }) {
    return (
        <button
        className='px-4 py-2 rounded text text-[#FA691A] font-semibold bg-white border text-sm disabled:bg-[#FA691A]/20'
        {...rest}
    >
        {children}
    </button>
    );
};

export default Button;