import React from 'react';
import { PiSlidersHorizontal } from "react-icons/pi";

function SearchBar({ searchQuery, handleSearchChange }) {
    return (
        <div className='flex gap-2 mb-4 w-full'>
            <input
                type="text"
                className='px-3 py-2 border border-black/20 rounded-xl w-full grow'
                placeholder='Search...'
                value={searchQuery}
                onChange={handleSearchChange}
            />
            <button className='bg-[#70B9BE] rounded-xl px-3'>
                <PiSlidersHorizontal className='text-lg text-white' />
            </button>
        </div>
    );
}

export default SearchBar;
