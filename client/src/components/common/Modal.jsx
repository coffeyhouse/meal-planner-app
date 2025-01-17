import React from "react";
import { RxCross1 } from "react-icons/rx";

function Modal({ title = "Modal title", onClose, children }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
            <div className="bg-[#F5F5F5] rounded-lg w-[95%] max-w-lg shadow-lg relative z-10 h-[90%] flex flex-col">
                <div className="flex justify-between items-center border-b pb-3 pt-6 pr-6 pl-6">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button 
                        onClick={onClose} 
                        aria-label="Close modal"
                        className="text-xl"
                    >
                        <RxCross1 />
                    </button>
                </div>
                <div className="mt-4 overflow-auto px-6 pt-3 pb-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
