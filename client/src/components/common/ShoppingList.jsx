import React, { useState } from "react";
import Heading from "./Heading";
import { RxChevronDown, RxChevronUp } from 'react-icons/rx';

function ShoppingList({ items, onClose }) {
    const categorizedItems = items.reduce((acc, item) => {
        const category = item.Ingredient.category || "Uncategorized";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    const [expandedCategories, setExpandedCategories] = useState(
        Object.keys(categorizedItems).reduce((acc, category) => {
            acc[category] = true;
            return acc;
        }, {})
    );

    const toggleCategory = (category) => {
        setExpandedCategories(prevState => ({
            ...prevState,
            [category]: !prevState[category]
        }));
    };

    return (
        <div className="flex flex-col gap-4" >
            {Object.keys(categorizedItems).map(category => (
                <div key={category}>
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleCategory(category)}>
                        <Heading variant="h3" className="mt-4">{category}</Heading>
                        <div className="flex items-center gap-4">
                            <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">{categorizedItems[category].length} items</span>
                            {expandedCategories[category] ? <RxChevronUp /> : <RxChevronDown />}
                        </div>
                    </div>
                    {expandedCategories[category] && (
                        <ul className="list-disc pl-5">
                            {categorizedItems[category].map(item => (
                                <li key={item.ingredientId} className="mb-2">
                                    <div className="flex items-center justify-between">
                                        <span>
                                            {item.Ingredient.name} - {item.quantityNeeded} {item.unit || item.Ingredient.defaultUnit || ''}
                                        </span>
                                    </div>
                                    <ul className="list-disc pl-5 text-gray-600 text-sm">
                                        {item.meals.map((meal, index) => (
                                            <li key={index}>
                                                Added for {meal.name}: {meal.quantity} {item.unit}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
            <div className="flex justify-end mt-4">
                <button onClick={onClose} className="px-4 py-2 rounded bg-[#FA691A] font-semibold text-white text-sm">
                    Close
                </button>
            </div>
        </div>
    );
}

export default ShoppingList;
