// components/meal/MealCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { RxPlus, RxHeartFilled } from 'react-icons/rx';

function getRandomColor(name) {
    const colors = ['#FFB6C1', '#FFD700', '#ADFF2F', '#20B2AA', '#87CEFA', '#FF69B4', '#CD5C5C', '#FFA500', '#DA70D6', '#7B68EE'];
    const hash = Array.from(name).reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
}

function MealCard({ meal, action, onClick }) {
    const authorName = meal.author || 'Coffey special  ';
    const authorImage = meal.authorImage || '';
    const authorColor = getRandomColor(authorName);

    if (action === "add") {
        return (
            <div className='rounded-2xl bg-white p-2 flex gap-3 shadow-lg shadow-gray-200 items-center w-full' onClick={onClick}>
                <div className={`flex p-2 items-start justify-end h-[70px] w-[85px] min-w-[85px] 
                    bg-cover bg-center bg-no-repeat 
                    bg-[url("${meal.imageUrl ? `${window.location.origin.replace(window.location.port, '5000')}${meal.imageUrl}` : `https://picsum.photos/300?random=${meal.id}`}")] rounded-2xl`}>
                </div>
                <div className='flex flex-col gap-1 grow'>
                    <p className='font-bold text-sm'>{meal.name}</p>
                    <div className='flex gap-1 items-center'>
                        {authorImage ? (
                            <div className={`h-[20px] w-[20px] rounded-full bg-cover bg-center bg-no-repeat 
                            bg-[url("${authorImage}")]`} alt={authorName}> </div>
                        ) : (
                            <div className={`h-[20px] w-[20px] rounded-full bg-[${authorColor}]/50`}></div>
                        )}
                        <p className='text-xs text-black/30 font-medium'>{authorName}</p>
                    </div>
                </div>
                <button className='bg-[#353535] text-white rounded-lg w-6 h-6 flex items-center justify-center text-sm mx-2 min-w-6'><RxPlus /></button>
            </div>
        );
    }

    return (
        <Link to={`/recipe-builder/${meal.id}`} className='rounded-2xl bg-white p-3 flex flex-col gap-2 shadow-lg shadow-gray-200 w-full' onClick={onClick}>
            <div className={`flex p-2 items-start justify-end h-[100px] w-[100%] 
                    bg-cover bg-center bg-no-repeat 
                    bg-[url("${meal.imageUrl ? `${window.location.origin.replace(window.location.port, '5000')}${meal.imageUrl}` : `https://picsum.photos/300?random=${meal.id}`}")] rounded-2xl`}>
                <div className='bg-white p-1 rounded-lg text-[#FA691A]'><RxHeartFilled /></div>
            </div>
            <p className='font-bold text-sm'>{meal.name}</p>
            <div className='flex gap-1 items-center'>
                {authorImage ? (
                    <div className={`h-[20px] w-[20px] rounded-full bg-cover bg-center bg-no-repeat 
                    bg-[url("${authorImage}")]`} alt={authorName}> </div>
                ) : (
                    <div className={`h-[20px] w-[20px] rounded-full bg-[${authorColor}]/50`}></div>
                )}
                <p className='text-xs text-black/30 font-medium'>{authorName}</p>
            </div>
        </Link>
    );
}

export default MealCard;
