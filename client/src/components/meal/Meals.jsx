import React, { useState, useEffect } from 'react';
import NavBar from '../common/NavBar';
import PageContainer from '../layout/PageContainer';
import MealCard from '../MealCard'; // Import the new MealCard component

function Meals() {
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        fetch('/api/meals')
            .then(response => response.json())
            .then(data => setMeals(data))
            .catch(error => console.error('Error fetching meals:', error));
    }, []);   

    return (
        <PageContainer>
            <PageContainer.Header>
                <NavBar title="Meals" />
            </PageContainer.Header>
            <PageContainer.Content>
                <div className="grid grid-cols-2 gap-4">
                    {meals.map(meal => (
                        <MealCard key={meal.id} meal={meal} />
                    ))}
                </div>
            </PageContainer.Content>
        </PageContainer>
    );
}

export default Meals;
