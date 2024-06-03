// components/meal/MealGrid.jsx

import React from 'react';
import MealCard from './MealCard';
import { Link } from 'react-router-dom';
import { RxPlus } from 'react-icons/rx';

function MealGrid({ meals, onMealSelect }) {
    const action = onMealSelect ? "add" : "link";

    return (
        <div className={`grid ${action === "add" ? "" : "grid-cols-2"} gap-4`}>
            {meals.map(meal => (
                <div
                    key={meal.id}
                    onClick={() => onMealSelect && onMealSelect(meal)}
                    className='flex min-w-full'
                >
                    <MealCard meal={meal} action={action} />
                </div>
            ))}
            {
                action === "add" ? (
                    <Link className='rounded-2xl bg-white p-2 flex gap-3 shadow-lg shadow-gray-200 items-center w-full' to="/recipe-builder">
                        <div className={`flex p-2 items-start justify-end h-[70px] w-[85px] min-w-[85px] 
                    bg-cover bg-center bg-no-repeat 
                    bg-[url("https://pbs.twimg.com/media/CHM5quRXIAAV8H7.png")] rounded-2xl`}>
                        </div>
                        <div className='flex flex-col gap-1 grow'>
                            <p className='font-bold text-sm'>Add a meal</p>
                            <div className='flex gap-1 items-center'>
                                <div className={`h-[20px] w-[20px] rounded-full bg-black/10`}></div>
                                <p className='text-xs text-black/30 font-medium'>Make it tasty</p>
                            </div>
                        </div>
                        <button className='bg-[#353535] text-white rounded-lg w-6 h-6 flex items-center justify-center text-sm mx-2 min-w-6'><RxPlus /></button>
                    </Link>
                ) : (
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
                )
            }
           
        </div>
    );
}

export default MealGrid;
