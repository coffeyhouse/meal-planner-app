// src/components/mealPlan/MealPlanList.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../common/NavBar';
import Card from '../common/Card';
import PageContainer from '../layout/PageContainer';
import CardContainer from '../common/CardContainer';
import Heading from '../common/Heading';
import { isThisWeek, isNextWeek, formatDate } from '../../utils/date';
import useFetch from '../../hooks/useFetch';

function MealPlanList() {
    const { data: mealPlans, loading, error } = useFetch('/api/meal-plans');
    const navigate = useNavigate();

    const sortedMealPlans = mealPlans?.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)) || [];
    const thisWeekPlan = sortedMealPlans.find(plan => isThisWeek(plan.startDate));
    const nextWeekPlan = sortedMealPlans.find(plan => isNextWeek(plan.startDate));
    const previousWeeksPlans = sortedMealPlans.filter(plan => !isThisWeek(plan.startDate) && !isNextWeek(plan.startDate)).reverse();

    const getMealCounts = (plan) => {
        const mealCounts = { breakfast: 0, lunch: 0, dinner: 0 };
        plan.MealPlanDays.forEach(day => {
            if (day.mealType in mealCounts) {
                mealCounts[day.mealType]++;
            }
        });
        return mealCounts;
    };

    const generateDescription = (plan) => {
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
    };

    const handlePlanClick = (planId) => {
        navigate(`/plan/${planId}/options`);
    };

    return (
        <PageContainer>
            <PageContainer.Header>
                <NavBar title="Meal Plans" />
            </PageContainer.Header>
            <PageContainer.Content>
                <div className='flex flex-col gap-4'>
                    <CardContainer>
                        <Heading variant="h3">This Week</Heading>
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
                    <CardContainer>
                        <Heading variant="h3">Next Week</Heading>
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
                        <Heading variant="h3">Previous weeks</Heading>
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
                </div>
            </PageContainer.Content>
        </PageContainer>
    );
}

export default MealPlanList;
