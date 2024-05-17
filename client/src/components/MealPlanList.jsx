import React, { useState, useEffect } from 'react';
import Button from './Button';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import Card from './Card';
import PageContainer from './PageContainer';
import CardContainer from './CardContainer';

function MealPlanList() {
    const [mealPlans, setMealPlans] = useState([]);
    const [thisWeekPlan, setThisWeekPlan] = useState(null);
    const [nextWeekPlan, setNextWeekPlan] = useState(null);
    const [previousWeeksPlans, setPreviousWeeksPlans] = useState([]);

    useEffect(() => {
        fetch('/api/meal-plans')
            .then(response => response.json())
            .then(data => {
                const sortedData = data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                let tempPreviousWeeks = [];

                sortedData.forEach(plan => {
                    if (isThisWeek(plan.startDate)) {
                        setThisWeekPlan(plan);
                    } else if (isNextWeek(plan.startDate)) {
                        setNextWeekPlan(plan);
                    } else {
                        tempPreviousWeeks.push(plan);
                    }
                });

                // Only set the state once with the sorted previous weeks
                setPreviousWeeksPlans(tempPreviousWeeks.reverse()); // Sort by most recent first
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

    return (
        <PageContainer>
            <PageContainer.Header>
                <NavBar
                    title="Home"
                />
                <div className='flex gap-2'>
                    <Link
                        to={`recipe-builder`}
                        className='border-b border-[#FA691A] text-xs p-1 font-semibold text-black/90'
                    >
                        Recipe builder
                    </Link>

                    <Link
                        to={`meals`}
                        className='border-b border-[#FA691A] text-xs p-1 font-semibold text-black/90'
                    >
                        Meals
                    </Link>
                </div>
            </PageContainer.Header>
            <PageContainer.Content>
                    <CardContainer>
                        <p className='font-bold text-black/60 grow mt-4'>This Week</p>
                        {thisWeekPlan ? (
                            <Card
                                key={thisWeekPlan.id}
                                title={`${formatDate(thisWeekPlan.startDate)} - ${formatDate(thisWeekPlan.endDate)}`}
                                description="5 breakfasts, 4 lunches and 7 dinners."
                                buttonType="view"
                                buttonLink={`plan/${thisWeekPlan.id}`}
                            />
                        ) : (
                            <Card
                            title="No plan yet"
                            description="Click to add a plan for this week."
                            buttonType="add"
                            buttonLink={`plan/add`}
                        />
                        )}
                    </CardContainer>
                    <CardContainer>
                        <p className='font-bold text-black/60 grow mt-4'>Next Week</p>
                        {nextWeekPlan ? (
                            <Card
                                key={nextWeekPlan.id}
                                title={`${formatDate(nextWeekPlan.startDate)} - ${formatDate(nextWeekPlan.endDate)}`}
                                description="Desc here..."
                                buttonType="view"
                                buttonLink={`plan/${nextWeekPlan.id}`}
                            />
                        ) : (
                            <Card
                                title="No plan yet"
                                description="Click to add a plan for next week."
                                buttonType="add"
                                buttonLink={`plan/add`}
                            />

                        )}
                    </CardContainer>
                    <CardContainer>
                        <p className='font-bold text-black/60 grow mt-4'>Previous weeks</p>
                        <CardContainer>
                            {previousWeeksPlans.length > 0 ? (
                                previousWeeksPlans.map(plan => (
                                    <Card
                                        key={plan.id}
                                        title={`${formatDate(plan.startDate)} - ${formatDate(plan.endDate)}`}
                                        description="Details about meals here..."
                                        buttonType="view"
                                        buttonLink={`plan/${plan.id}`}
                                    />
                                ))
                            ) : (                                
                                <Card title="No previous meal plans available." />
                            )}
                        </CardContainer>
                    </CardContainer>
            </PageContainer.Content>
        </PageContainer>

    );
}

export default MealPlanList;
