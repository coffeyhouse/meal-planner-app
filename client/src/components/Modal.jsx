import React from "react"
import { RxCross1 } from "react-icons/rx";

function Modal({ title = "Modal title", onClose, children }) {
    return (
        <div className="absolute top-0 left-0 w-full bg-black/40 h-full flex items-center justify-center shadow">
            <div className="bg-[#F5F5F5] w-[80%] rounded p-4 flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                    <p className="grow font-bold">{title}</p>
                    <button onClick={onClose}><RxCross1 /></button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default Modal;
