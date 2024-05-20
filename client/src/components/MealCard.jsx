import React from 'react';
import { Link } from 'react-router-dom';
import { RxHeartFilled } from "react-icons/rx";

function MealCard({ meal }) {
    return (
        <Link to={`/recipe-builder/${meal.id}`} className='rounded-2xl bg-white p-3 flex flex-col gap-2 shadow-lg shadow-gray-200'>
            <div className={`flex p-2 items-start justify-end h-[100px] w-[100%] 
                    bg-cover bg-center bg-no-repeat 
                    bg-[url("${`https://picsum.photos/300?random=${meal.id}`}")] rounded-2xl`}>
                <div className='bg-white p-1 rounded-lg text-[#FA691A]'><RxHeartFilled /></div>
            </div>
            <p className='font-bold text-sm'>{meal.name}</p>
            <div className='flex gap-1 items-center'>
                <img src="https://m.media-amazon.com/images/I/71G-Y+X7YWL._CR0,0,2000,2000_._FMpng_.png" className='h-[20px]' alt="Author" />
                <p className='text-xs text-black/30 font-medium'>Pinch of Nom</p>
            </div>
        </Link>
    );
}

export default MealCard;
