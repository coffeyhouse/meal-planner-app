import React from "react";
import { RxCross1 } from "react-icons/rx";

function Modal({ title = "Modal title", onClose, children }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg p-6 w-4/5 max-w-lg shadow-lg relative">
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button 
                        onClick={onClose} 
                        aria-label="Close modal"
                        className="text-xl"
                    >
                        <RxCross1 />
                    </button>
                </div>
                <div className="mt-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
