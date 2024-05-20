import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Button from '../common/Button';


function MealDetails() {
    const { mealId } = useParams();
    const navigate = useNavigate();
    const [meal, setMeal] = useState(null);

    useEffect(() => {
        fetch(`/api/meals/${mealId}`)
            .then(response => response.json())
            .then(data => setMeal(data))
            .catch(error => console.error('Error fetching meal details:', error));
    }, [mealId]);

    const handleBack = () => {
        navigate('/meals');  // Navigates back to the list of meals
    };

    if (!meal) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Button onClick={handleBack}>Back to Meals</Button>
            <h1 className='text-xl font-bold'>{meal.name}</h1>
            <h2 className='font-semibold mt-2'>Ingredients:</h2>
            <ul>
                {meal.ingredients.map(ingredient => (
                    <li key={ingredient.id}>{ingredient.name} - {ingredient.quantity} {ingredient.unit}</li>
                ))}
            </ul>
        </>
    );
}

export default MealDetails;
