import React from "react";
import Heading from "./Heading";

function ShoppingList({ items, onClose }) {
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
                                {item.Ingredient.name} - {item.quantityNeeded} {item.unit || item.Ingredient.defaultUnit}
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
