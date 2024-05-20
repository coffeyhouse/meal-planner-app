import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import NavBar from '../common/NavBar';
import Card from '../common/Card';
import PageContainer from '../layout/PageContainer';
import CardContainer from '../common/CardContainer';

function MealPlanList() {
    const [mealPlans, setMealPlans] = useState([]);
    const [thisWeekPlan, setThisWeekPlan] = useState(null);
    const [nextWeekPlan, setNextWeekPlan] = useState(null);
    const [previousWeeksPlans, setPreviousWeeksPlans] = useState([]);
    const navigate = useNavigate();

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

                setPreviousWeeksPlans(tempPreviousWeeks.reverse());
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

    return (
        <PageContainer>
            <PageContainer.Header>
                <NavBar title="Meal Plans" />
            </PageContainer.Header>
            <PageContainer.Content>
                <CardContainer>
                    <p className="font-bold text-black/60 grow mt-4">This Week</p>
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
                            buttonLink="plan/add"
                        />
                    )}
                </CardContainer>
                <CardContainer>
                    <p className="font-bold text-black/60 grow mt-4">Next Week</p>
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
                            buttonLink="plan/add"
                        />
                    )}
                </CardContainer>
                <CardContainer>
                    <p className="font-bold text-black/60 grow mt-4">Previous weeks</p>
                    <CardContainer>
                        {previousWeeksPlans.length > 0 ? (
                            previousWeeksPlans.map(plan => (
                                <Card
                                    key={plan.id}
                                    title={`${formatDate(plan.startDate)} - ${formatDate(plan.endDate)}`}
                                    description={generateDescription(plan)}
                                    buttonType="view"
                                    buttonClick={() => handlePlanClick(plan.id)}
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
