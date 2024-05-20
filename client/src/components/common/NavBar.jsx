import React from "react";
import { RxChevronLeft } from "react-icons/rx";
import { useNavigate, useLocation } from "react-router-dom";

function NavBar({ title }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        if (window.history.length > 2) {
            navigate(-1); // Go back one step in history
        }
    };

    // Do not show back button on the homepage
    const isHomePage = location.pathname === "/";

    return (
        <div className='pt-6 pb-2 relative'>
            {
                !isHomePage && window.history.length > 2 && (
                    <button
                        onClick={handleBack}
                        className='absolute font-bold left-0 top-3 h-[45px] w-[45px] flex items-center justify-center'
                    >
                        <RxChevronLeft />
                    </button>
                )
            }

            <p className='text-center font-bold'>{title}</p>
        </div>
    );
}

export default NavBar;
