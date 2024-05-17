import React from "react";
import { Link } from "react-router-dom";
import { RxPencil2, RxEyeOpen, RxPlusCircled, RxTrash  } from "react-icons/rx";

function Card({ title, description, image, buttonType, buttonLink, buttonClick = () => { } }) {
    return (
        <div className='flex bg-white rounded p-2 gap-3 items-center shadow'>
            {image && image !== "placeholder" && (
                <div
                    className={`h-[60px] w-[20%] 
                        bg-cover bg-center bg-no-repeat 
                        bg-[url("${image}")] rounded`}
                >
                </div>
            )}

            {image && image === "placeholder" && (
                <div className='bg-black/20 rounded h-[60px] w-[20%]'>&nbsp;</div>
            )}

            <div className='flex flex-col items-start grow gap-1'>
                {title && (
                    <p className='font-bold text-black/90 text-sm'>
                        {title}
                    </p>
                )}

                {description && (
                    <p className='text-black/60 text-sm'>
                        {description}
                    </p>
                )}
            </div>
            <div>
                {buttonType === "view" && buttonLink && (
                    <Link to={buttonLink}>
                        <RxEyeOpen className='text-[#FA691A] mr-2' />
                    </Link>
                )}
                {buttonType === "add" && buttonLink && (
                    <Link to={buttonLink}>
                        <RxPlusCircled className='text-[#FA691A] mr-2' />
                    </Link>
                )}
                {buttonType === "edit" && (buttonClick || buttonLink) && (
                    <a onClick={buttonClick}>
                        <RxPencil2 className='text-[#FA691A] mr-2' />
                    </a>
                )}
                 {buttonType === "remove" && (buttonClick || buttonLink) && (
                    <button onClick={buttonClick} title="Delete">
                        <RxTrash className='text-red-600 mr-2' />
                    </button>
                )}

            </div>
        </div>
    )
}

export default Card;