import React, { useEffect, useState } from 'react';

function ShoppingList() {
    const [shoppingItems, setShoppingItems] = useState({});

    useEffect(() => {
        fetchShoppingList();
    }, []);

    const fetchShoppingList = () => {
        fetch('http://192.168.86.198:5000/api/shopping-list')
            .then(response => response.json())
            .then(data => {
                const categorizedItems = categorizeItems(data);
                setShoppingItems(categorizedItems);
            })
            .catch(error => console.error('Failed to fetch shopping list:', error));
    };

    const handleCreateShoppingList = () => {
        fetch('http://192.168.86.198:5000/api/shopping-list/create')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const categorizedItems = categorizeItems(data);
                setShoppingItems(categorizedItems);
                console.log('Shopping list created successfully:', data);
            })
            .catch(error => {
                console.error('Failed to create shopping list:', error);
            });
    };

    const categorizeItems = (items) => {
        return items.reduce((acc, item) => {
            const category = item.Ingredient.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});
    };

    return (
        <div>
            <h1>Shopping List</h1>
            <button onClick={handleCreateShoppingList}>Generate Shopping List</button>
            {Object.keys(shoppingItems).length ? (
                Object.entries(shoppingItems).map(([category, items]) => (
                    <div key={category}>
                        <h2>{category}</h2>
                        <ul>
                            {items.map(item => (
                                <li key={item.ingredientId}>
                                    {item.Ingredient.name} - {item.quantityNeeded} needed
                                    {item.meals && (
                                        <ul>
                                            {item.meals.map((meal, index) => (
                                                <li key={index}>{meal}</li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p>No items in the shopping list or data format incorrect.</p>
            )}
        </div>
    );
}

export default ShoppingList;
