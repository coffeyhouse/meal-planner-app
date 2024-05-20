import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './common/NavBar';
import PageContainer from './layout/PageContainer';
import Button from './common/Button';
import MealCard from './MealCard';
import Card from './common/Card';
import CardContainer from './common/CardContainer';

function HomePage() {
    const [meals, setMeals] = useState([]);
    const [thisWeekPlan, setThisWeekPlan] = useState(null);
    const [nextWeekPlan, setNextWeekPlan] = useState(null);
    const navigate = useNavigate();

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

    function getMealCounts(plan) {
        const mealCounts = { breakfast: 0, lunch: 0, dinner: 0 };
        plan.MealPlanDays.forEach(day => {
            if (day.mealType in mealCounts) {
                mealCounts[day.mealType]++;
            }
        });
        return mealCounts;
    }

    function generateDescription(plan) {
        const { breakfast, lunch, dinner } = getMealCounts(plan);
        if (breakfast === 0 && lunch === 0 && dinner === 0) {
            return 'No meals added yet';
        }
        const pluralize = (count, noun) => {
            if (noun === 'lunch') {
                return `${count} ${count !== 1 ? 'lunches' : 'lunch'}`;
            }
            return `${count} ${noun}${count !== 1 ? 's' : ''}`;
        };
        return `${pluralize(breakfast, 'breakfast')}, ${pluralize(lunch, 'lunch')}, and ${pluralize(dinner, 'dinner')}.`;
    }

    const handlePlanClick = (planId) => {
        navigate(`/plan/${planId}/options`);
    };

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
                    <h2 className="text-xl font-bold">This Week's Meal Plan</h2>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar">
                        {thisWeekPlan && (
                            <>
                                <Link to={`/plan/${thisWeekPlan.id}/options`} className='rounded-2xl bg-[#70B9BE] p-3 flex flex-col gap-2 shadow-lg shadow-gray-200 text-white min-w-[66%]'>
                                    <p className='font-bold text-lg mt-[50px]'>This week</p>
                                    <div className='flex gap-1 items-center'>
                                        <p className='text-xs text-white/80 font-medium'>{formatDate(thisWeekPlan.startDate)} - {formatDate(thisWeekPlan.endDate)}</p>
                                    </div>
                                </Link>
                                <Link to={`/plan/${thisWeekPlan.id}/options`} className='rounded-2xl bg-[#70B9BE] p-3 flex flex-col gap-2 shadow-lg shadow-gray-200 text-white min-w-[66%]'>
                                    <p className='font-bold text-lg mt-[50px]'>Next week</p>
                                    <div className='flex gap-1 items-center'>
                                        <p className='text-xs text-white/80 font-medium'>{formatDate(thisWeekPlan.startDate)} - {formatDate(thisWeekPlan.endDate)}</p>
                                    </div>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                    <div className='flex gap-2 justify-between items-center'>
                        <p className="font-bold text-black/60 grow">Our favourite meals</p>
                        <Link to="/meals" className="text-[#FA691A] text-sm font-bold">See all</Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {renderMeals()}
                    </div>
                </div>
                <div className="mt-8 flex flex-col gap-4">
                    <h2 className="text-xl font-bold">This Week's Meal Plan</h2>
                    <CardContainer>
                        {thisWeekPlan ? (
                            <Card
                                key={thisWeekPlan.id}
                                title={`${formatDate(thisWeekPlan.startDate)} - ${formatDate(thisWeekPlan.endDate)}`}
                                description={generateDescription(thisWeekPlan)}
                                buttonType="view"
                                buttonClick={() => handlePlanClick(thisWeekPlan.id)}
                            />
                        ) : (
                            <Card
                                title="No plan yet"
                                description="Click to add a plan for this week."
                                buttonType="add"
                                buttonLink="/plan/add"
                            />
                        )}
                    </CardContainer>
                </div>
                <div className="mt-8 flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Next Week's Meal Plan</h2>
                    <CardContainer>
                        {nextWeekPlan ? (
                            <Card
                                key={nextWeekPlan.id}
                                title={`${formatDate(nextWeekPlan.startDate)} - ${formatDate(nextWeekPlan.endDate)}`}
                                description={generateDescription(nextWeekPlan)}
                                buttonType="view"
                                buttonClick={() => handlePlanClick(nextWeekPlan.id)}
                            />
                        ) : (
                            <Card
                                title="No plan yet"
                                description="Click to add a plan for next week."
                                buttonType="add"
                                buttonLink="/plan/add"
                            />
                        )}
                    </CardContainer>
                </div>
            </PageContainer.Content>
        </PageContainer>
    );
}

export default HomePage;
