// src/components/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from './common/NavBar';
import PageContainer from './layout/PageContainer';
import MealCard from './meal/MealCard';
import Heading from './common/Heading';
import { isThisWeek, isNextWeek, formatDate } from '../utils/date';
import useFetch from '../hooks/useFetch';

function HomePage() {
    const { data: meals, loading: mealsLoading, error: mealsError } = useFetch('/api/meals');
    const { data: mealPlans, loading: mealPlansLoading, error: mealPlansError } = useFetch('/api/meal-plans');

    const getMealPlans = (plans) => {
        let thisWeekPlan = null;
        let nextWeekPlan = null;

        if (plans) {
            const sortedData = plans.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            sortedData.forEach(plan => {
                if (isThisWeek(plan.startDate)) {
                    thisWeekPlan = plan;
                } else if (isNextWeek(plan.startDate)) {
                    nextWeekPlan = plan;
                }
            });
        }
        return { thisWeekPlan, nextWeekPlan };
    };

    const { thisWeekPlan, nextWeekPlan } = getMealPlans(mealPlans);

    const renderMeals = () => {
        return (meals || []).slice(0, 4).map((meal) => (
            <MealCard key={meal.id} meal={meal} variant="small" />
        ));
    };

    return (
        <PageContainer>
            <PageContainer.Header>
                <NavBar title="Welcome to Coffey Cuisine" />
            </PageContainer.Header>
            <PageContainer.Content>
                <div className="mt-8 flex flex-col gap-4">
                    <div className='flex gap-2 justify-between items-center'>
                        <Heading variant="h3">Meal plans</Heading>
                        <Link to="/meal-plans" className="text-[#FA691A] text-sm font-bold">See all</Link>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-8" style={{margin: "0 -16px"}}>
                        {mealPlansLoading ? <p>Loading meal plans...</p> : mealPlansError ? <p>Error loading meal plans: {mealPlansError}</p> : (
                            <>
                                {thisWeekPlan ? (
                                    <Link to={`/plan/${thisWeekPlan.id}/add-meals`} className='rounded-2xl bg-contain bg-center bg-no-repeat p-4 flex flex-col justify-end gap-2 shadow-lg shadow-gray-200 text-white min-w-[265px] h-[170px] bg-[url("/calendar-bg.png")]'>
                                        <p className='font-bold text-xl mt-[50px]'>This week</p>
                                        <div className='flex gap-1 items-center'>
                                            <p className='text-xs text-white/80 font-medium'>{formatDate(thisWeekPlan.startDate)} - {formatDate(thisWeekPlan.endDate)}</p>
                                        </div>
                                    </Link>
                                ) : (
                                    <Link className='rounded-2xl bg-[#70B9BE] p-3 flex flex-col gap-2 shadow-lg shadow-gray-200 text-white min-w-[66%]'>
                                        <p className='font-bold text-xl mt-[50px]'>This week</p>
                                        <div className='flex gap-1 items-center'>
                                            <p className='text-xs text-white/80 font-medium'>Add a plan</p>
                                        </div>
                                    </Link>
                                )}
                                {nextWeekPlan ? (
                                    <Link to={`/plan/${nextWeekPlan.id}/options`} className='rounded-2xl bg-contain bg-center bg-no-repeat p-4 flex flex-col justify-end gap-2 shadow-lg shadow-gray-200 text-white min-w-[265px] h-[170px] bg-[url("/calendar-bg.png")]'>
                                        <Heading variant="h3">Next week</Heading>
                                        <div className='flex gap-1 items-center'>
                                            <p className='text-xs text-white/80 font-medium'>{formatDate(nextWeekPlan.startDate)} - {formatDate(nextWeekPlan.endDate)}</p>
                                        </div>
                                    </Link>
                                ) : (
                                    <Link className='rounded-2xl bg-contain bg-center bg-no-repeat p-4 flex flex-col justify-end gap-2 shadow-lg shadow-gray-200 text-white min-w-[265px] h-[170px] bg-[url("/calendar-bg.png")]'>
                                        <p className='font-bold text-xl mt-[50px]'>Next week</p>
                                        <div className='flex gap-1 items-center'>
                                            <p className='text-xs text-white/80 font-medium'>Add a plan</p>
                                        </div>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className='flex gap-2 justify-between items-center'>
                        <Heading variant="h3">Our favourite meals</Heading>
                        <Link to="/meals" className="text-[#FA691A] text-sm font-bold">See all</Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {mealsLoading ? <p>Loading meals...</p> : mealsError ? <p>Error loading meals: {mealsError}</p> : renderMeals()}
                    </div>
                </div>
            </PageContainer.Content>
        </PageContainer>
    );
}

export default HomePage;
