// src/components/common/ShoppingList.jsx

import React, { useState } from "react";
import Heading from "./Heading";
import { RxChevronDown, RxChevronUp } from 'react-icons/rx';

function ShoppingList({ items, onClose }) {
    const [expandedItems, setExpandedItems] = useState({});

    const toggleExpand = (id) => {
        setExpandedItems(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const categorizedItems = items.reduce((acc, item) => {
        const category = item.Ingredient.category || "Uncategorized";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    return (
        <div>
            {Object.keys(categorizedItems).map(category => (
                <div key={category}>
                    <Heading variant="h3" className="mt-4">{category}</Heading>
                    <ul className="list-disc pl-5">
                        {categorizedItems[category].map(item => (
                            <li key={item.ingredientId} className="mb-2">
                                <div className="flex items-center justify-between">
                                    <span>
                                        {item.Ingredient.name} - {item.quantityNeeded} {item.unit || item.Ingredient.defaultUnit || ''}
                                    </span>
                                    <button onClick={() => toggleExpand(item.ingredientId)} className="flex items-center">
                                        <span>{item.meals.length} meal{item.meals.length > 1 ? 's' : ''}</span>
                                        {expandedItems[item.ingredientId] ? <RxChevronUp /> : <RxChevronDown />}
                                    </button>
                                </div>
                                {expandedItems[item.ingredientId] && (
                                    <ul className="list-disc pl-5 text-gray-600 text-sm">
                                        {item.meals.map((meal, index) => (
                                            <li key={index}>
                                                {meal.name}: {meal.quantity} {item.unit}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <div className="flex justify-end mt-4">
                <button onClick={onClose} className="px-4 py-2 rounded text bg-[#FA691A] font-semibold text-white text-sm">
                    Close
                </button>
            </div>
        </div>
    );
}

export default ShoppingList;
