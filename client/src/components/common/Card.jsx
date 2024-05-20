import React from "react";
import { Link } from "react-router-dom";
import { RxPencil2, RxEyeOpen, RxPlusCircled, RxTrash } from "react-icons/rx";

const buttonIcons = {
    view: <RxEyeOpen className="text-[#FA691A] mr-2" />,
    add: <RxPlusCircled className="text-[#FA691A] mr-2" />,
    edit: <RxPencil2 className="text-[#FA691A] mr-2" />,
    remove: <RxTrash className="text-red-600 mr-2" />
};

function Card({ title, description, image, buttonType, buttonLink, buttonClick = () => { } }) {
    const renderButton = () => {
        if (!buttonType || !buttonIcons[buttonType]) return null;

        if (buttonLink && buttonType !== "view" && buttonType !== "add") {
            return <button onClick={buttonClick} className="flex items-center">{buttonIcons[buttonType]}</button>;
        }

        return <span className="flex items-center">{buttonIcons[buttonType]}</span>;
    };

    const cardContent = (
        <div className="flex bg-white rounded p-2 gap-3 items-center shadow">
            {image && image !== "placeholder" && (
                <div
                    className={`h-[60px] w-[20%] 
                        bg-cover bg-center bg-no-repeat 
                        bg-[url("${image}")] rounded`}
                />
            )}

            {image === "placeholder" && (
                <div className="bg-black/20 rounded h-[60px] w-[20%]" />
            )}

            <div className="flex flex-col items-start grow gap-1">
                {title && <p className="font-bold text-black/90 text-sm">{title}</p>}
                {description && <p className="text-black/60 text-sm">{description}</p>}
            </div>

            <div>{renderButton()}</div>
        </div>
    );

    if (buttonLink) {
        return <Link to={buttonLink} className="block">{cardContent}</Link>;
    }

    if (buttonClick) {
        return <div onClick={buttonClick} className="cursor-pointer">{cardContent}</div>;
    }

    return cardContent;
}

export default Card;
