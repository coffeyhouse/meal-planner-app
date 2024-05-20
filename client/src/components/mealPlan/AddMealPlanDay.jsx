import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '../layout/PageContainer';
import NavBar from '../common/NavBar';
import Card from '../common/Card';
import CardContainer from '../common/CardContainer';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ShoppingList from '../common/ShoppingList';
import Heading from '../common/Heading';
import dayjs from 'dayjs';
import { getDateRange, parseDate, formatDayAndWeekday } from '../../utils';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shoppingList, setShoppingList] = useState(null);
    const [isShoppingListModalOpen, setIsShoppingListModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const toggleShoppingListModal = () => setIsShoppingListModalOpen(!isShoppingListModalOpen);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const mealsResponse = await fetch('/api/meals');
            const mealsData = await mealsResponse.json();
            setMeals(mealsData);

            const mealPlanResponse = await fetch(`/api/meal-plans/${mealPlanId}`);
            const mealPlanData = await mealPlanResponse.json();
            setMealPlan(mealPlanData);
            setMealPlanDays(mealPlanData.MealPlanDays);

            if (!selectedDate) {
                const formattedStartDate = mealPlanData.startDate.split(' ')[0];
                setSelectedDate(formattedStartDate);
            }
        } catch (err) {
            setError('Failed to fetch data.');
            console.error('Failed to fetch data', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [mealPlanId]);

    useEffect(() => {
        if (mealPlan) {
            setDates(getDateRange(mealPlan.startDate, mealPlan.endDate));
        }
    }, [mealPlan]);

    useEffect(() => {
        if (dates && dates.length > 0 && !selectedDate) {
            setSelectedDate(dates[0].split('T')[0]);
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
        return Object.keys(meals).length > 0;
    };

    const mealsForSelectedDate = getMealsForDate(selectedDate);

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
            await fetchData(selectedDate);
            setIsModalOpen(false);
        } catch (error) {
            setError(error.message);
            console.error('Error adding meal to meal plan:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateShoppingList = async () => {
        try {
            const response = await fetch(`/api/shopping-list/create/${mealPlanId}`);
            if (!response.ok) {
                throw new Error('Failed to generate shopping list');
            }
            const shoppingListData = await response.json();
            setShoppingList(shoppingListData);
            toggleShoppingListModal();
            alert('Shopping list created successfully!');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    if (!mealPlan || !dates) return <p>Loading meal plan details...</p>;

    return (
        <>
            <PageContainer>
                <PageContainer.Header>
                    <NavBar title="Add meal" />
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 w-full justify-between">
                            {dates && dates.map(date => {
                                const { day, weekdayInitial } = formatDayAndWeekday(date);
                                const isSelectedDate = dayjs(date).format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD');
                                const hasMeals = dateHasMeals(date);
                                return (
                                    <button
                                        key={date}
                                        className={`flex flex-col items-center rounded px-3 pb-1.5 ${isSelectedDate ? 'bg-orange-500 text-white' : 'bg-transparent text-black'}`}
                                        onClick={() => setSelectedDate(date)}
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className={`mt-1 h-1 w-1 rounded-full ${hasMeals ? (isSelectedDate ? 'bg-white' : 'bg-orange-500') : 'bg-transparent'}`}></span>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs">{weekdayInitial}</p>
                                                <p className="text-xs font-semibold">{day}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </PageContainer.Header>
                <PageContainer.Content>
                    <Heading variant="h4">{dayjs(selectedDate).format('dddd D MMMM YYYY')}</Heading>
                    <div className="flex flex-col gap-4 mt-4">
                        {['breakfast', 'lunch', 'dinner'].map((type) => (
                            <CardContainer key={type}>
                                <Heading variant="h3" className="mt-4">{type.charAt(0).toUpperCase() + type.slice(1)}</Heading>
                                {mealsForSelectedDate[type] ? (
                                    <Card
                                        title={mealsForSelectedDate[type].name}
                                        description="Future state to add sides"
                                        image={`https://picsum.photos/300?random=${Math.random()}`}
                                        buttonType="edit"
                                    />
                                ) : (
                                    <Button onClick={() => openModal(type)}>Add {type}</Button>
                                )}
                            </CardContainer>
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button onClick={generateShoppingList}>Create Shopping List</Button>
                    </div>
                </PageContainer.Content>
            </PageContainer>

            {isModalOpen && (
                <Modal title="Select a meal" onClose={toggleModal}>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <select
                            className="rounded p-4 border bg-white"
                            value={mealId}
                            onChange={e => setMealId(e.target.value)}
                            required
                        >
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

            {isShoppingListModalOpen && (
                <Modal title="Shopping List" onClose={toggleShoppingListModal}>
                    <ShoppingList items={shoppingList} onClose={toggleShoppingListModal} />
                </Modal>
            )}
        </>
    );
}

export default AddMealPlanDay;
