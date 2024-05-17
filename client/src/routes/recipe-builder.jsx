import React, { useState, useEffect } from 'react';
import IngredientSearch from '../IngredientSearch';
import { Link, useParams, useNavigate } from "react-router-dom";
import Button from '../components/Button';
import NavBar from '../components/NavBar';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import CardContainer from '../components/CardContainer';

const baseUnits = [
    { label: 'grams', value: 'g' },
    { label: 'kilograms', value: 'kg' },
    { label: 'liters', value: 'l' },
    { label: 'milliliters', value: 'ml' },
    { label: 'cups', value: 'cups' },
    { label: 'tablespoons', value: 'tbsp' },
    { label: 'teaspoons', value: 'tsp' },
    { label: 'pieces', value: 'pcs' }
];


function RecipeBuilder() {
    const { mealId } = useParams();
    const navigate = useNavigate();
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentIngredient, setCurrentIngredient] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [addIngredients, setAddIngredients] = useState(false);
    const [commonUnits, setCommonUnits] = useState([...baseUnits]);
    const [isEditing, setIsEditing] = useState(true);

    useEffect(() => {
        if (mealId) {
            fetch(`/api/meals/${mealId}`)
                .then(response => response.json())
                .then(data => {
                    setRecipeName(data.name);
                    setIngredients(data.ingredients.map(ing => ({
                        ...ing,
                        id: ing.id,
                        name: ing.name,
                        quantity: ing.quantity.toString(), // Make sure to convert quantity to string if your input expects a string
                        unit: ing.unit
                    })));
                    setIsEditing(false);
                })
                .catch(error => console.error('Error fetching meal details:', error));
        }
    }, [mealId]);

    useEffect(() => {
        if (!mealId) {
            const savedMealData = localStorage.getItem('currentMeal');
            if (savedMealData) {
                const { recipeName, ingredients } = JSON.parse(savedMealData);
                console.log(recipeName, ingredients)
                if (recipeName || ingredients.length > 0) {
                    if (window.confirm("Do you want to continue with your previous meal?")) {
                        setRecipeName(recipeName);
                        setIngredients(ingredients);
                        localStorage.removeItem('currentMeal');
                    } else {
                        localStorage.removeItem('currentMeal'); // Clear the saved data if user does not want to use it
                    }
                }
            }
        }
    }, []);

    useEffect(() => {
        if (!mealId) {
            // Save the current state to localStorage
            const mealData = {
                recipeName,
                ingredients
            };
            localStorage.setItem('currentMeal', JSON.stringify(mealData));
            console.log(mealData)
        }
    }, [recipeName, ingredients]);


    const handleIngredientSelect = (ingredient) => {
        setCurrentIngredient(ingredient);
        setModalVisible(true);

        // Reset the units to the base each time an ingredient is selected
        let updatedUnits = [...baseUnits];

        // Add the default unit at the top if it's valid and not already included
        if (ingredient.defaultUnit && ingredient.defaultUnit.trim() !== '' && !baseUnits.some(u => u.value === ingredient.defaultUnit)) {
            updatedUnits = [{ label: ingredient.defaultUnit, value: ingredient.defaultUnit }, ...updatedUnits];
        }

        // Update the units state
        setCommonUnits(updatedUnits);

        // Set the unit to the default unit of the ingredient or reset if invalid
        setUnit(ingredient.defaultUnit && ingredient.defaultUnit.trim() !== '' ? ingredient.defaultUnit : '');
    };

    const addIngredientToRecipe = () => {
        if (quantity && unit) {
            const extendedIngredient = {
                ...currentIngredient,
                quantity,
                unit
            };
            setIngredients(prevIngredients => [...prevIngredients, extendedIngredient]);
        }
        setModalVisible(false);
        resetIngredientForm();
        setAddIngredients(false);
    };

    const resetIngredientForm = () => {
        setQuantity('');
        setUnit('');
        setCurrentIngredient(null);
    };

    const removeIngredient = (id) => {
        setIngredients(prevIngredients => prevIngredients.filter(item => item.id !== id));
    };

    function handleAddMeal() {
        const simplifiedIngredients = ingredients.map(ingredient => ({
            id: ingredient.id,
            unit: ingredient.unit,
            quantity: parseInt(ingredient.quantity)
        }));

        const meal = {
            name: recipeName,
            ingredients: simplifiedIngredients
        };

        console.log(meal);

        const url = mealId ? `/api/meals/${mealId}` : '/api/meals';
        const method = mealId ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(meal)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Meal saved:', data);
                alert(`Meal successfully ${mealId ? 'updated' : 'added'}!`);
                localStorage.removeItem('currentMeal');
                navigate('/meals');
                // Additional reset if necessary
            })
            .catch(error => {
                console.error(`Error ${mealId ? 'updating' : 'saving'} meal:`, error);
                alert(`Failed to ${mealId ? 'update' : 'add'} the meal. Please try again!`);
            });
    }

    return (
        <PageContainer>
            <PageContainer.Header>
                <NavBar
                    title="Meal builder"
                    backButton="/"
                />
            </PageContainer.Header>
            <PageContainer.Content>
                <div className='flex flex-col gap-2'>
                    <p className='font-bold text-black/60 grow mt-4'>Recipe name</p>
                    <input
                        type="text"
                        placeholder="Give it a name..."
                        className="bg-white p-2 border"
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        disabled={!isEditing}
                    />
                </div>

                <div className='flex items-center mb-2'>
                    <div className='grow'>
                        <p className='font-bold text-black/60 grow mt-4'>Ingredients</p>
                        <p className='text-sm font-light'>What's needed for this meal</p>
                    </div>
                    {isEditing && (
                        <Button
                            onClick={() => setAddIngredients(true)}
                        >
                            Add
                        </Button>
                    )
                    }
                </div>
                <div className='flex flex-col gap-2'>
                    {ingredients.length > 0 && (
                        <CardContainer>
                            {ingredients.map(ingredient => (
                                <Card
                                    title={ingredient.name}
                                    description={`${ingredient.quantity} ${ingredient.unit}`}
                                    buttonType="remove"
                                    buttonClick={isEditing ? () => removeIngredient(ingredient.id) : null}
                                />
                            ))}
                        </CardContainer>
                    )}
                    {isEditing && !mealId && (
                        <Button
                            onClick={handleAddMeal}
                            disabled={ingredients.length === 0 || !recipeName}
                        >
                            Save
                        </Button>
                    )}
                    {!isEditing && mealId && (
                        <Button
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </Button>
                    )}
                    {isEditing && mealId && (
                        <>
                            <Button
                                onClick={handleAddMeal}
                                disabled={ingredients.length === 0 || !recipeName}
                            >
                                Save
                            </Button>
                            <Button.Secondary
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel edit
                            </Button.Secondary>
                        </>
                    )}
                </div>
                {
                    addIngredients && <IngredientSearch onIngredientSelect={handleIngredientSelect} onClose={() => setAddIngredients(false)} />
                }
                {modalVisible && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Add Ingredient - {currentIngredient?.name}</h3>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Quantity</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter quantity"
                                    className="input input-bordered"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Unit</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}>
                                    <option value="" disabled={!unit}>Select a unit</option>
                                    {commonUnits.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>

                            </div>
                            <div className="modal-action">
                                <button className="btn btn-primary" disabled={!quantity || !unit} onClick={addIngredientToRecipe}>Add</button>
                                <button className="btn" onClick={() => setModalVisible(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </PageContainer.Content>
        </PageContainer>
    );
}

export default RecipeBuilder;
