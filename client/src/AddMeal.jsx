import React, { useState, useEffect } from 'react';

function AddMeal({ date, type, onSuccess, existingMeal }) {
    const [ingredients, setIngredients] = useState([]);
    const [newMeal, setNewMeal] = useState({
        name: '',
        date: date,
        type: type
    });
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [currentIngredient, setCurrentIngredient] = useState('');
    const [newIngredient, setNewIngredient] = useState({ name: '', category: '' });
    const [resetKey, setResetKey] = useState(0);


    useEffect(() => {
        fetch('http://192.168.86.198:5000/api/ingredients')
            .then(response => response.json())
            .then(setIngredients)
            .catch(error => console.error('Error fetching ingredients:', error));
    }, []);

    useEffect(() => {
        setNewMeal({
            name: existingMeal ? existingMeal.name : "",
            date: date,
            type: type
        })

        setSelectedIngredients(existingMeal ? existingMeal.ingredients : [])
    }, [existingMeal, resetKey])

    const handleAddMeal = async (event) => {
        event.preventDefault();
        try {
            const method = existingMeal ? 'PUT' : 'POST'; // Choose method based on if amending or adding
            const url = existingMeal ? `http://192.168.86.198:5000/api/meals/${existingMeal.id}` : 'http://192.168.86.198:5000/api/meals';
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newMeal.name,
                    date,
                    type,
                    ingredients: selectedIngredients.map(ing => ({ ...ing, quantity: ing.quantity }))
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update meal');
            }
            const addedMeal = await response.json();
            setNewMeal({ name: '', date: date, type: type });
            onSuccess();  // Reset and close modal
        } catch (error) {
            console.error('Failed to update meal:', error);
        }
    };

    const handleAddIngredient = async () => {
        try {
            const response = await fetch('http://192.168.86.198:5000/api/ingredients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newIngredient)
            });
            const addedIngredient = await response.json();
            setIngredients(prevIngredients => [...prevIngredients, addedIngredient]);
            const quantity = prompt("Enter the quantity for this ingredient:", "1"); // Move prompt here to ensure it's done after ingredient is added
            if (quantity) {
                setSelectedIngredients(prevSelectedIngredients => [
                    ...prevSelectedIngredients,
                    { id: addedIngredient.id, quantity }
                ]);
            }
            setNewIngredient({ name: '', category: '' });
        } catch (error) {
            console.error('Failed to add ingredient:', error);
        }
        document.getElementById('add_new_ingredient_modal').close();
    };

    const handleAddIngredientToList = (event) => {
        event.preventDefault();
        if (currentIngredient) {
            const existingIngredient = ingredients.find(ing => ing.id.toString() === currentIngredient);
            if (existingIngredient && !selectedIngredients.some(ing => ing.id.toString() === currentIngredient)) {
                const quantity = prompt("Enter the quantity for this ingredient:", "1");
                if (quantity) {
                    setSelectedIngredients(prevSelectedIngredients => [
                        ...prevSelectedIngredients,
                        { id: currentIngredient, quantity }
                    ]);
                    setCurrentIngredient(''); // Reset after adding
                }
            }
        }
    };

    const closeModal = () => {
        setResetKey(oldKey => oldKey + 1);
        setNewMeal({ name: '', date: date, type: type }); // Reset the meal state
        setSelectedIngredients([]);
        setCurrentIngredient("");
        document.getElementById('meal_modal').close();
    };

    async function deleteMeal(id) {
        try {
            const response = await fetch(`http://192.168.86.198:5000/api/meals/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorText = await response.text();  // Get the response text which might include why the request failed
                throw new Error(`Failed to delete meal: ${response.status} - ${errorText}`);
            }
            closeModal();
            onSuccess();
            document.getElementById('delete_modal').close();
        } catch (error) {
            console.error('Error deleting meal:', error);
            alert(error.message);  // Show the error message to the user
        }
    }

    return (
        <div className='flex flex-col gap-2'>
            <form onSubmit={handleAddMeal} className='flex flex-col gap-4'>
                <input className="input input-bordered w-full" value={newMeal.name} onChange={e => setNewMeal({ ...newMeal, name: e.target.value })} placeholder="Meal Name" required />
                <div className="join">
                    <select className="select select-bordered w-full join-item" value={currentIngredient} onChange={e => setCurrentIngredient(e.target.value)}>
                        <option value="" disabled>Select Ingredient</option>
                        {ingredients.map(ingredient => (
                            <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
                        ))}
                    </select>
                    <button className='btn join-item' onClick={handleAddIngredientToList}>+</button>
                </div>
                <button className='btn' onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('add_new_ingredient_modal').showModal()
                }}>Add new ingredient</button>
                <ul>
                    {selectedIngredients.map((ingredient, index) => {
                        const fullIngredient = ingredients.find(ing => ing.id === parseInt(ingredient.id));
                        return (
                            <li key={`${ingredient.id}-${index}`}>
                                {fullIngredient ? `${fullIngredient.name} - ${ingredient.quantity}` : 'Loading...'}
                            </li>
                        );
                    })}
                </ul>

                <button type="submit" className="btn btn-primary">Add Meal</button>
            </form>
            {/* <div className="divider"></div>
            */}
            <div className="modal-action">
                {existingMeal && (
                    <button className="btn btn-outline btn-error" onClick={() => document.getElementById('delete_modal').showModal()}>Delete</button>
                )}
                <form method="dialog">
                    <button className="btn" onClick={closeModal}>Close</button>
                </form>
            </div>
            <dialog id="delete_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Are you sure you want to delete?</h3>
                    <p className="py-4">Please confirm you want to delete <span className='font-semibold'>{existingMeal && existingMeal.name}</span>.</p>
                    <div className="modal-action">
                        <button className="btn btn-error" onClick={() => deleteMeal(existingMeal.id)}>Delete now</button>
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
            <dialog id="add_new_ingredient_modal" className="modal">
                <div className="modal-box flex flex-col gap-4">
                    <div className='flex flex-col gap-4'>
                        <h3 className="font-semibold text">Add New Ingredient</h3>
                        <input className="input input-bordered w-full" value={newIngredient.name} onChange={e => setNewIngredient({ ...newIngredient, name: e.target.value })} placeholder="Ingredient Name" required />
                        <select className="select select-bordered w-full" value={newIngredient.category} onChange={e => setNewIngredient({ ...newIngredient, category: e.target.value })} required>
                            <option value="">Select a category</option>
                            <option value="fruit-and-veg">Fruit and veg</option>
                            <option value="meat">Meat</option>
                            <option value="store-cupboard">Store cupboard</option>
                            <option value="drinks">Drinks</option>
                            <option value="bread">Bread</option>
                            <option value="household">Household</option>
                            <option value="other">Other</option>
                        </select>
                        <button onClick={handleAddIngredient} className="btn">Add Ingredient</button>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>

    );
}

export default AddMeal;
