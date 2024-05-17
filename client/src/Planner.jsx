import React, { useState, useEffect } from 'react';
import AddMeal from './AddMeal';

function Planner() {
    const startDate = new Date('2024-05-24');
    const endDate = new Date('2024-05-31');
    const [mealDate, setMealDate] = useState('');
    const [mealType, setMealType] = useState('');
    const [meals, setMeals] = useState([]);
    const [mealsByDate, setMealsByDate] = useState({});
    const [existingMeal, setExistingMeal] = useState(null);


    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = () => {
        const formattedStartDate = startDate.toISOString().slice(0, 10);
        const formattedEndDate = endDate.toISOString().slice(0, 10);

        fetch(`http://192.168.86.198:5000/api/meals?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
            .then(response => response.json())
            .then(data => {
                setMeals(data);
                const mealsIndex = data.reduce((acc, meal) => {
                    const date = meal.date;
                    if (!acc[date]) {
                        acc[date] = [];
                    }
                    acc[date].push(meal);
                    return acc;
                }, {});
                setMealsByDate(mealsIndex);
            })
            .catch(error => console.error('Error fetching meals:', error));
    };

    const handleAddMealClick = (date, type) => {
        setMealDate(date.toISOString().slice(0, 10));
        setMealType(type);
    };

    const closeModal = () => {
        document.getElementById('meal_modal').close();
        fetchMeals();
    };

    const getDatesInRange = (start, end) => {
        const dateArray = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
            dateArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dateArray;
    };

    const dateArray = getDatesInRange(startDate, endDate);
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };

    return (
        <div className='px-5 mt-4'>
            {dateArray.map((date, index) => (
                <div key={index} className='flex flex-col gap-1'>
                    <h3 className="font-bold text-lg">{date.toLocaleDateString('en-GB', dateOptions)}</h3>
                    {['Breakfast', 'Lunch', 'Dinner'].map((type, typeIndex) => {
                        const dateKey = date.toISOString().slice(0, 10);
                        const dailyMeals = mealsByDate[dateKey] || [];
                        const mealForType = dailyMeals.find(meal => meal.type === type.toLowerCase());
                        return (
                            <div key={typeIndex} className='mt-2 p-4 border rounded-xl'>
                                {mealForType ? (
                                    <div className='flex items-center justify-between'>
                                        <div className='flex flex-col gap-1'>
                                            <h4 className="font-semibold text">{type}</h4>
                                            <p>{mealForType.name}</p>
                                        </div>
                                        <button className='btn w-[100px] btn-outline' onClick={() => {
                                            setMealDate(date.toISOString().slice(0, 10));
                                            setMealType(type.toLowerCase());
                                            setExistingMeal(mealForType); // Assuming mealForType contains the full meal data
                                            document.getElementById('meal_modal').showModal();
                                        }}>Amend</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex flex-col gap-1'>
                                                <h4 className="font-semibold text">{type}</h4>
                                            </div>
                                            <button className="btn w-[100px] btn-secondary btn-outline" onClick={() => {
                                                setExistingMeal(null);
                                                handleAddMealClick(date, type.toLowerCase());
                                                document.getElementById('meal_modal').showModal();
                                            }}>Add</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                    <div className="divider"></div>
                </div>
            ))}

            <dialog id="meal_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-2">{mealType.charAt(0).toUpperCase() + mealType.slice(1)} ({mealDate})</h3>
                    <AddMeal date={mealDate} type={mealType} onSuccess={closeModal} existingMeal={existingMeal} />
                </div>
            </dialog>
        </div>
    );
}

export default Planner;
