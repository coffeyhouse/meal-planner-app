import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './common/NavBar';
import PageContainer from './layout/PageContainer';
import Button from './common/Button';
import { RxHeartFilled } from "react-icons/rx";
import MealCard from './MealCard';

function HomePage() {
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        fetch('/api/meals')
            .then(response => response.json())
            .then(data => setMeals(data))
            .catch(error => console.error('Error fetching meals:', error));
    }, []);

    const renderMeals = () => {
        return meals.slice(0, 4).map((meal) => (
            <MealCard key={meal.id} meal={meal} />
        ));
    };

    return (
        <PageContainer>
            <PageContainer.Header>
                <NavBar title="Welcome to Coffey Cuisine" />
            </PageContainer.Header>
            <PageContainer.Content>
                <div className="flex flex-col items-center gap-4">
                    <Link to="/meal-plans">
                        <Button>Meal Plans</Button>
                    </Link>
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
            </PageContainer.Content>
        </PageContainer>
    );
}

export default HomePage;
