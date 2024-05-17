import React, { useState } from 'react';
import Planner from './Planner';
import IngredientSearch from './IngredientSearch';
import RecipeBuilder from './RecipeBuilder';

function App() {
  const [shoppingList, setShoppingList] = useState([]);

  function createShoppingList() {
    fetch('http://192.168.86.198:5000/api/shopping-list/create')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create shopping list');
        }
        return response.json();
      })
      .then(data => {
        const groupedData = groupItemsByCategory(data);
        setShoppingList(groupedData); // Store grouped data in state
        document.getElementById('shoppingListModal').showModal();
      })
      .catch(error => {
        console.error('Error creating shopping list:', error);
        alert(error.message);
      });
  }


  function groupItemsByCategory(items) {
    return items.reduce((acc, item) => {
      const category = item.Ingredient.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  }

  return (
    <div className='flex flex-col items-center bg-gray-200'>
      <div className='max-w-[550px] w-full bg-white'>

        <div className="navbar bg-neutral text-neutral-content flex justify-between py-4">
          <button className="btn btn-ghost text-xl">mealPlanner</button>
          <button className='btn' onClick={createShoppingList}>Create shopping list</button>
        </div>
        <RecipeBuilder />
        {/* <IngredientSearch />
        <Planner /> */}
        <dialog id="shoppingListModal" className="modal">
          <div className="modal-box flex flex-col gap-4">
            <h3 className="font-bold text-2xl">Shopping List</h3>
            {Object.entries(shoppingList).map(([category, items]) => (
              <div key={category}>
                <h4 className="font-semibold">{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                <ul className="list-disc list-inside pl-5">
                  {items.map(item => (
                    <li key={item.ingredientId}>
                      {item.Ingredient.name} x{item.quantityNeeded}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>

      </div>
    </div>
  );
}

export default App;
