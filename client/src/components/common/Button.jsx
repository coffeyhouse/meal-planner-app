import React from "react";

function Button({ children, ...rest }) {
    return (
        <button
            className='px-4 py-2 font-semibold text-white text-sm disabled:bg-[#FA691A]/20 bg-[#70B9BE] rounded-xl px-3'
            {...rest}
        >
            {children}
        </button>
    )
}

Button.Secondary = function Secondary({ children, ...rest }) {
    return (
        <button
        className='px-4 py-2 font-semibold text-sm disabled:bg-[#FA691A]/20 border border-[#70B9BE] rounded-xl px-3 text-[#70B9BE]'
        {...rest}
    >
        {children}
    </button>
    );
};

export default Button;