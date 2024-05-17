import { useEffect, useState } from 'react';

function Ingredients() {
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState({ name: '', category: '' });

    useEffect(() => {
        fetch('http://192.168.86.198:5000/api/ingredients')
            .then(response => response.json())
            .then(data => setIngredients(data))
            .catch(error => console.error('Error fetching ingredients:', error));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://192.168.86.198:5000/api/ingredients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newIngredient)
        })
        .then(response => response.json())
        .then(data => {
            setIngredients([...ingredients, data]);
            setNewIngredient({ name: '', category: '' });
        })
        .catch(error => console.error('Failed to add ingredient:', error));
    };

    return (
        <div>
            <h1>Ingredients</h1>
            <ul>
                {ingredients.map(ingredient => (
                    <li key={ingredient.id}>{ingredient.name} ({ingredient.category})</li>
                ))}
            </ul>
            <h2>Add New Ingredient</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newIngredient.name}
                    onChange={e => setNewIngredient({ ...newIngredient, name: e.target.value })}
                    placeholder="Name"
                    required
                />
                <input
                    type="text"
                    value={newIngredient.category}
                    onChange={e => setNewIngredient({ ...newIngredient, category: e.target.value })}
                    placeholder="Category"
                    required
                />
                <button type="submit">Add Ingredient</button>
            </form>
        </div>
    );
}

export default Ingredients;
