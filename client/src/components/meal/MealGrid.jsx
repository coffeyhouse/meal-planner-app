import React from 'react';
import MealCard from './MealCard';
import { Link } from 'react-router-dom';

function MealGrid({ meals, onMealSelect }) {
    const action = onMealSelect ? "add" : "link";

    return (
        <div className={`grid ${action === "add" ? "" : "grid-cols-2"} gap-4`}>
            {meals.map(meal => (
                <div key={meal.id} onClick={() => onMealSelect && onMealSelect(meal)}>
                    <MealCard meal={meal} action={action} />
                </div>
            ))}
            <Link to="/recipe-builder" className='rounded-2xl bg-white p-3 flex flex-col gap-2 shadow-lg shadow-gray-200'>
                <div className={`flex p-2 items-start justify-end h-[100px] w-[100%] 
                    bg-cover bg-center bg-no-repeat 
                    bg-[url("https://pbs.twimg.com/media/CHM5quRXIAAV8H7.png")] rounded-2xl`}>
                </div>
                <p className='font-bold text-sm'>Add a meal</p>
                <div className='flex gap-1 items-center'>
                    <div className={`h-[20px] w-[20px] rounded-full bg-black/10`}></div>
                    <p className='text-xs text-black/30 font-medium'>Make it tasty</p>
                </div>
            </Link>
        </div>
    );
}

export default MealGrid;
