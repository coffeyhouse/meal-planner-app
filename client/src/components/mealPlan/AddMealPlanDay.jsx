import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '../layout/PageContainer';
import NavBar from '../common/NavBar';
import CardContainer from '../common/CardContainer';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ShoppingList from '../common/ShoppingList';
import Heading from '../common/Heading';
import MealGrid from '../meal/MealGrid';
import SearchBar from '../common/SearchBar';
import dayjs from 'dayjs';
import { getDateRange, formatDayAndWeekday } from '../../utils';
import { searchItems } from '../../utils/search';
import MealCard from '../meal/MealCard';
import { RxCross1 } from "react-icons/rx";

function AddMealPlanDay() {
    const { mealPlanId } = useParams();
    const [mealPlan, setMealPlan] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [mealType, setMealType] = useState('');
    const [meals, setMeals] = useState([]);
    const [mealPlanDays, setMealPlanDays] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [dates, setDates] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // Add search query state
    const [shoppingList, setShoppingList] = useState(null);
    const [isShoppingListModalOpen, setIsShoppingListModalOpen] = useState(false);
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);
    const [editingMealType, setEditingMealType] = useState(''); // Add state for editing meal type
    const [selectedMeal, setSelectedMeal] = useState(null);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        if (isModalOpen) {
            setEditingMealType(''); // Reset editingMealType when the modal is closed
        }
    };

    const toggleShoppingListModal = () => setIsShoppingListModalOpen(!isShoppingListModalOpen);
    const toggleMealModal = () => setIsMealModalOpen(!isMealModalOpen);

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

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredMeals = searchItems(meals, ['name'], searchQuery);

    const handleMealSelect = async (meal) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/meal-plans/${mealPlanId}/meals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: selectedDate, mealId: meal.id, mealType: editingMealType || mealType }) // Use editingMealType if set
            });

            if (!response.ok) {
                throw new Error('Failed to add meal to the meal plan');
            }

            await fetchData(selectedDate);
            setIsModalOpen(false);
            setEditingMealType(''); // Reset editingMealType
        } catch (error) {
            setError(error.message);
            console.error('Error adding meal to meal plan:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMeal = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/meal-plans/${mealPlanId}/meals/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: selectedDate, mealType: editingMealType })
            });

            if (!response.ok) {
                throw new Error('Failed to delete meal from the meal plan');
            }

            await fetchData(selectedDate);
            setIsMealModalOpen(false);
            setEditingMealType('');
        } catch (error) {
            setError(error.message);
            console.error('Error deleting meal from meal plan:', error);
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
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    function openModal(meal) {
        setMealType(meal);
        setEditingMealType(''); // Reset editingMealType
        toggleModal();
    }

    function handleMealCardClick(data, type) { 
        const meal = meals.find(meal => meal.id === data.id);
        console.log(meal);
        setEditingMealType(type);
        setSelectedMeal(meal); 
        toggleMealModal();
    }

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
                                        className={`flex flex-col items-center rounded px-3 pb-1.5 ${isSelectedDate ? 'bg-[#70B9BE] text-white' : 'bg-transparent text-black'}`}
                                        onClick={() => setSelectedDate(date)}
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className={`mt-1 h-1 w-1 rounded-full ${hasMeals ? (isSelectedDate ? 'bg-white' : 'bg-[#70B9BE]') : 'bg-transparent'}`}></span>
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
                                    <MealCard meal={mealsForSelectedDate[type]} action="add" onClick={() => handleMealCardClick(mealsForSelectedDate[type], type)} />
                                ) : (
                                    <Button.Secondary onClick={() => openModal(type)}>Add {type}</Button.Secondary>
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
                    <div className='flex flex-col gap-2'>
                        {editingMealType && (
                            <span className='mb-8 flex flex-col'>
                                <Button.Destructive onClick={handleDeleteMeal}>Delete meal</Button.Destructive>
                            </span>
                        )}
                        <div className='flex flex-col'>
                            <SearchBar searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
                            <MealGrid meals={filteredMeals} onMealSelect={handleMealSelect} />
                        </div>
                    </div>
                </Modal>
            )}

            {isShoppingListModalOpen && (
                <Modal title="Shopping List" onClose={toggleShoppingListModal}>
                    <ShoppingList items={shoppingList} onClose={toggleShoppingListModal} />
                </Modal>
            )}

            {isMealModalOpen && (
                <div className='absolute left-0 top-0 w-full h-full flex justify-center bg-black/30'>
                    <div className='bg-white w-full md:w-[395px] rounded-t-xl'>
                        {
                            selectedMeal.imageUrl && (
                                // <img
                                //     className='rounded-lg shadow w-full'
                                //     src={`${window.location.origin.replace(window.location.port, '5000')}${selectedMeal.imageUrl}`}
                                // />
                                <>
                                    <div className={`relative h-[350px] w-full bg-center bg-cover bg-[url("${selectedMeal.imageUrl ? `${window.location.origin.replace(window.location.port, '5000')}${selectedMeal.imageUrl}` : `https://picsum.photos/300?random=${selectedMeal.id}`}")]`}>
                                        <div className='bg-gradient-to-b from-white/20 w-full h-[350px] h-full absolute top-0 z-10'></div>
                                    </div>
                                    <button
                                        onClick={toggleMealModal}
                                        aria-label="Close modal"
                                        className="absolute top-0 text-xl bg-white rounded-xl p-3 shadow-lg shadow-black/30 m-4 z-20"
                                    >
                                        <RxCross1 />
                                    </button>
                                </>

                            )
                        }

                        <div className='absolute w-full rounded-t-2xl p-8 flex flex-col gap-4 bg-white mt-[-20px]'>
                            <div className='flex flex-col gap-1'>
                                <p className='text-xl font-bold'>{selectedMeal.name}</p>
                                <p className='text-sm mb-2'>By <span className='font-medium'>{selectedMeal.author || "Coffey special"}</span></p>
                                <Heading variant="h3">Ingredients</Heading>
                                <ul className='text-sm mb-4'>
                                    {selectedMeal.ingredients.map(ingredient => <li>{ingredient.name} - {ingredient.quantity} {ingredient.unit} </li>)}
                                </ul>
                                <Button.Destructive onClick={handleDeleteMeal}>Remove from plan</Button.Destructive>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddMealPlanDay;
