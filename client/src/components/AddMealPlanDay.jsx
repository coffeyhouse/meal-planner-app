import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from './PageContainer';
import NavBar from './NavBar';
import { RxPlus } from 'react-icons/rx';
import Card from './Card';
import CardContainer from './CardContainer';
import Modal from './Modal';
import Button from './Button';
import dayjs from 'dayjs';

function AddMealPlanDay() {
    const { mealPlanId } = useParams();
    const [mealPlan, setMealPlan] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [mealId, setMealId] = useState('');
    const [mealType, setMealType] = useState('');
    const [meals, setMeals] = useState([]);
    const [mealPlanDays, setMealPlanDays] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [dates, setDates] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const toggleModal = () => setModalOpen(!isModalOpen);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch list of meals available for selection
            const mealsResponse = await fetch('/api/meals');
            const mealsData = await mealsResponse.json();
            setMeals(mealsData);

            // Fetch the details of the specific meal plan by ID
            const mealPlanResponse = await fetch(`/api/meal-plans/${mealPlanId}`);
            const mealPlanData = await mealPlanResponse.json();
            setMealPlan(mealPlanData);
            setMealPlanDays(mealPlanData.MealPlanDays);

            // Set the start date as selected date only if no date has been selected yet
            if (!selectedDate) {
                const formattedStartDate = mealPlanData.startDate.split(' ')[0];
                setSelectedDate(formattedStartDate);
            }
        } catch (err) {
            console.error('Failed to fetch data', err);
            setError('Failed to fetch data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Fetch initial data
    }, [mealPlanId]);

    useEffect(() => {
        if (mealPlan) {
            setDates(getDateRange(mealPlan.startDate, mealPlan.endDate));
        }
    }, [mealPlan])

    useEffect(() => {
        if (dates && dates.length > 0 && !selectedDate) {
            setSelectedDate(dates[0].split('T')[0]);  // Ensure only the date part is set
        }
    }, [dates]);


    const getMealsForDate = (date) => {
        return mealPlanDays.filter(d => d.date.slice(0, 10) === date)
            .reduce((acc, curr) => {
                acc[curr.mealType.toLowerCase()] = curr.Meal;
                return acc;
            }, {});
    };

    const dateHasMeals = (date) => {
        const meals = getMealsForDate(date);
        return Object.keys(meals).length > 0; // Returns true if there are any meals for the date
    };

    const mealsForSelectedDate = getMealsForDate(selectedDate);

    function parseDate(input) {
        // Parse the input date string "YYYY-MM-DD HH:MM:SS.SSS +00:00"
        if (!input) return null;

        // Extract and split date and time parts
        const parts = input.match(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}\.\d{3}) ([+-]\d{2}:\d{2})/);
        if (!parts) {
            console.error("Invalid date format:", input);
            return null;
        }

        // Correctly format the string to ensure cross-browser compatibility
        const dateString = `${parts[1]}T${parts[2]}${parts[3]}`;

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.error("Invalid date parsed:", dateString);
            return null;
        }
        return date;
    }

    const getDateRange = (start, end) => {
        let startDate = parseDate(start);
        const endDate = parseDate(end);

        if (!startDate || !endDate) {
            console.error('Invalid start or end date', { start, end });
            return []; // Return an empty array if any date is invalid
        }

        const dates = [];
        while (startDate <= endDate) {
            dates.push(startDate.toISOString().split('T')[0]); // Ensure dates are pushed in YYYY-MM-DD format
            startDate = new Date(startDate.setDate(startDate.getDate() + 1)); // Move to the next day
        }

        return dates;
    };



    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/meal-plans/${mealPlanId}/meals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: selectedDate, mealId, mealType })
            });

            if (!response.ok) {
                throw new Error('Failed to add meal to the meal plan');
            }

            alert('Meal added successfully to the meal plan!');
            setMealType('');
            setMealId('');
            await fetchData(selectedDate);  // Re-fetch data after successful addition
            setModalOpen(false);
        } catch (error) {
            setError(error.message);
            console.error('Error adding meal to meal plan:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const weekdayInitials = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Helper function to extract the weekday initial and day of the month
    const formatDayAndWeekday = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const weekdayIndex = date.getDay(); // Gets the day of the week as a number (0-6)
        const weekdayInitial = weekdayInitials[weekdayIndex]; // Maps the number to a weekday initial
        return { day, weekdayInitial };
    };

    function openModal(meal) {
        setMealType(meal);
        toggleModal();
    }

    if (!mealPlan || !dates) return <p>Loading meal plan details...</p>;

    return (
        <>
            <PageContainer>
                <PageContainer.Header>
                    <NavBar
                        title="Add meal"
                        backButton="/"
                    />
                    <div className='flex flex-col gap-4'>
                        <div className='flex gap-2 w-full justify-between'>
                            {dates && dates.map(date => {
                                const { day, weekdayInitial } = formatDayAndWeekday(date);
                                const isSelectedDate = dayjs(date).format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD');
                                const hasMeals = dateHasMeals(date); // Check if the date has meals
                                return (
                                    <button key={date}
                                        className={`flex flex-col items-center rounded px-3 pb-1.5 ${isSelectedDate ? 'bg-[#FA691A] text-white' : 'bg-transparent text-black'}`}
                                        onClick={() => setSelectedDate(date)}
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className={`mt-[5px] h-[4px] w-[4px] rounded-full ${hasMeals ? (isSelectedDate ? 'bg-white' : 'bg-[#FA691A]') : 'bg-transparent'}`}></span>
                                           <div className='flex flex-col gap-1'>

                                            <p className='text-xs'>{weekdayInitial}</p>
                                            <p className='text-xs font-semibold'>{day}</p>
                                           </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </PageContainer.Header>
                <PageContainer.Content>
                    <p className='font-bold text-black/90 grow'>{dayjs(selectedDate).format('dddd D MMMM YYYY')}</p>
                    <div className='flex flex-col'>
                        {['breakfast', 'lunch', 'dinner'].map((type) => (
                            <CardContainer key={type}>
                                <p className='font-bold text-black/60 grow mt-4'>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
                                {mealsForSelectedDate[type] ? (
                                    <Card
                                        title={mealsForSelectedDate[type].name}
                                        description="w/ garlic bread"
                                        image={`https://picsum.photos/300?random=${Math.random()}`}
                                        buttonType="edit"
                                    />
                                ) : (
                                    <Button onClick={() => openModal(type)}>Add {type}</Button>
                                )}
                            </CardContainer>
                        ))}
                    </div>
                </PageContainer.Content>
            </PageContainer>

            {isModalOpen && (
                <Modal title="Select a meal" onClose={toggleModal}>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

                        <select className='rounded p-4 border bg-white' value={mealId} onChange={e => setMealId(e.target.value)} required>
                            <option value="">Choose one...</option>
                            {meals.map(meal => (
                                <option key={meal.id} value={meal.id}>{meal.name}</option>
                            ))}
                        </select>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add Meal'}
                        </Button>
                    </form>
                </Modal>
            )}
        </>
    );
}

export default AddMealPlanDay;
