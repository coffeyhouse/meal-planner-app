import React from "react"
import { RxChevronLeft } from "react-icons/rx";
import { Link } from "react-router-dom";


function NavBar({ title, backButton }) {
    return (
        <div className='py-2'>
            {
                backButton && (
                    <Link
                        to={backButton}
                        className='absolute font-bold left-0 top-0 h-[45px] w-[45px] flex items-center justify-center'
                    >
                        <RxChevronLeft />
                    </Link>
                )
            }

            <p className='text-center font-bold'>{title}</p>
        </div>
    )
}

export default NavBar;