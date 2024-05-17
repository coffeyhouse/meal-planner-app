import { useEffect, useState } from 'react';

function Meals() {
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        fetch('http://192.168.86.198:5000/api/meals')
            .then(response => response.json())
            .then(setMeals)
            .catch(error => console.error('Error fetching meals:', error));
    }, []);

    return (
        <div>
            <h3>Meals</h3>
            {meals && meals.length > 0 && meals.map(meal => (
                <div key={meal.id}>
                    <h4>{meal.name} - {meal.type} on {meal.date}</h4>
                    <ul>
                        {meal.ingredients && meal.ingredients.length > 0 && meal.ingredients.map((ingredient, index) => (
                            <li key={`${meal.id}-${index}`}>{ingredient.name} - {ingredient.quantity}</li>
                        ))}
                    </ul>
                </div>
            ))}            
        </div>
    );
}

export default Meals;
