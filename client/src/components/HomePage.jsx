import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './common/NavBar';
import PageContainer from './layout/PageContainer';
import MealCard from './MealCard';
import Heading from './common/Heading';

function HomePage() {
    const [meals, setMeals] = useState([]);
    const [thisWeekPlan, setThisWeekPlan] = useState(null);
    const [nextWeekPlan, setNextWeekPlan] = useState(null);

    useEffect(() => {
        fetch('/api/meals')
            .then(response => response.json())
            .then(data => setMeals(data))
            .catch(error => console.error('Error fetching meals:', error));

        fetch('/api/meal-plans')
            .then(response => response.json())
            .then(data => {
                const sortedData = data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                sortedData.forEach(plan => {
                    if (isThisWeek(plan.startDate)) {
                        setThisWeekPlan(plan);
                    } else if (isNextWeek(plan.startDate)) {
                        setNextWeekPlan(plan);
                    }
                });
            })
            .catch(err => console.error('Failed to fetch meal plans', err));
    }, []);

    function formatDate(dateString) {
        const date = new Date(dateString.split(' ')[0]);
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    }

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
        return weekNo;
    }

    function isThisWeek(date) {
        const now = new Date();
        return getWeekNumber(now) === getWeekNumber(new Date(date.split(' ')[0]));
    }

    function isNextWeek(date) {
        const now = new Date();
        return getWeekNumber(now) + 1 === getWeekNumber(new Date(date.split(' ')[0]));
    }

    const renderMeals = () => {
        return meals.slice(0, 4).map((meal) => (
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
                        {thisWeekPlan ? (
                            <>
                                <Link to={`/plan/${thisWeekPlan.id}/add-meals`} className='rounded-2xl bg-contain bg-center bg-no-repeat p-4 flex flex-col justify-end gap-2 shadow-lg shadow-gray-200 text-white min-w-[265px] h-[170px] bg-[url("/calendar-bg.png")]  shadow-lg shadow-gray-200'>
                                    <p className='font-bold text-xl mt-[50px]'>This week</p>
                                    <div className='flex gap-1 items-center'>
                                        <p className='text-xs text-white/80 font-medium'>{formatDate(thisWeekPlan.startDate)} - {formatDate(thisWeekPlan.endDate)}</p>
                                    </div>
                                </Link>
                            </>
                        ) :
                            (
                                <>
                                    <Link className='rounded-2xl bg-[#70B9BE] p-3 flex flex-col gap-2 shadow-lg shadow-gray-200 text-white min-w-[66%]'>
                                        <p className='font-bold text-xl mt-[50px]'>This week</p>
                                        <div className='flex gap-1 items-center'>
                                            <p className='text-xs text-white/80 font-medium'>Add a plan</p>
                                        </div>
                                    </Link>
                                </>
                            )

                        }
                        {nextWeekPlan ? (
                            <>
                                <Link to={`/plan/${nextWeekPlan.id}/options`} className='rounded-2xl bg-contain bg-center bg-no-repeat p-4 flex flex-col justify-end gap-2 shadow-lg shadow-gray-200 text-white min-w-[265px] h-[170px] bg-[url("/calendar-bg.png")]'>
                                    <Heading variant="h3">Next week</Heading>
                                    <div className='flex gap-1 items-center'>
                                        <p className='text-xs text-white/80 font-medium'>{formatDate(nextWeekPlan.startDate)} - {formatDate(nextWeekPlan.endDate)}</p>
                                    </div>
                                </Link>
                            </>
                        ) :
                            (
                                <>
                                    <Link className='rounded-2xl bg-contain bg-center bg-no-repeat p-4 flex flex-col justify-end gap-2 shadow-lg shadow-gray-200 text-white min-w-[265px] h-[170px] bg-[url("/calendar-bg.png")]'>
                                        <p className='font-bold text-xl mt-[50px]'>Next week</p>
                                        <div className='flex gap-1 items-center'>
                                            <p className='text-xs text-white/80 font-medium'>Add a plan</p>
                                        </div>
                                    </Link>
                                </>
                            )

                        }
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className='flex gap-2 justify-between items-center'>
                        <Heading variant="h3">Our favourite meals</Heading>
                        <Link to="/meals" className="text-[#FA691A] text-sm font-bold">See all</Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {renderMeals()}
                    </div>
                </div>
            </PageContainer.Content>
        </PageContainer>
    );
}

export default HomePage;
