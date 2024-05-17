import React, { useState, useEffect } from 'react';
import IngredientSearch from './IngredientSearch';

function RecipeBuilder() {
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentIngredient, setCurrentIngredient] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');

    const commonUnits = [
        { label: 'grams', value: 'g' },
        { label: 'kilograms', value: 'kg' },
        { label: 'liters', value: 'l' },
        { label: 'milliliters', value: 'ml' },
        { label: 'cups', value: 'cups' },
        { label: 'tablespoons', value: 'tbsp' },
        { label: 'teaspoons', value: 'tsp' },
        { label: 'pieces', value: 'pcs' }
    ];
    

    const handleIngredientSelect = (ingredient) => {
        setCurrentIngredient(ingredient);
        setModalVisible(true);
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
    };

    const resetIngredientForm = () => {
        setQuantity('');
        setUnit('');
        setCurrentIngredient(null);
    };

    const removeIngredient = (id) => {
        setIngredients(prevIngredients => prevIngredients.filter(item => item.id !== id));
    };

    return (
        <div className="recipe-builder">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Recipe Name</span>
                </label>
                <input 
                    type="text" 
                    placeholder="Enter recipe name..." 
                    className="input input-bordered"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                />
            </div>
            <label className="label">
                    <span className="label-text">Ingredient search</span>
                </label>
            <IngredientSearch onIngredientSelect={handleIngredientSelect} />
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
                                {commonUnits.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="modal-action">
                            <button className="btn btn-primary" onClick={addIngredientToRecipe}>Add</button>
                            <button className="btn" onClick={() => setModalVisible(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="ingredients-list mt-4">
                {ingredients.length > 0 && (
                    <ul className="menu p-2 bg-base-100 rounded-box w-full">
                        {ingredients.map(ingredient => (
                            <li key={ingredient.id} className="menu-item">
                                {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                                <button 
                                    className="btn btn-xs btn-error" 
                                    onClick={() => removeIngredient(ingredient.id)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default RecipeBuilder;
