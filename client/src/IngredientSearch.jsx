import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

function IngredientSearch({ onIngredientSelect, onClose }) {
    const [ingredients, setIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newIngredientModalVisible, setNewIngredientModalVisible] = useState(false);
    const [newIngredient, setNewIngredient] = useState({
        name: '',
        category: '',
        defaultUnit: '',
        defaultQuantity: ''
    });


    useEffect(() => {
        fetch('http://192.168.86.198:5000/api/ingredients')
            .then(response => response.json())
            .then(data => setIngredients(data))
            .catch(error => console.error('Error fetching ingredients:', error));
    }, []);

    const fuse = new Fuse(ingredients, {
        keys: ['name'],
        includeScore: true,
        threshold: 0.3
    });

    const results = searchTerm ? fuse.search(searchTerm).map(result => result.item) : ingredients;

    const groupedResults = results.reduce((acc, item) => {
        const category = item.category || 'Other';  // Default category if none specified
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleCreateIngredient = async () => {
        const response = await fetch('http://192.168.86.198:5000/api/ingredients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newIngredient)
        });
        if (response.ok) {
            const addedIngredient = await response.json();
            setIngredients([...ingredients, addedIngredient]);
            // Set the added ingredient as the current ingredient in the RecipeBuilder component
            onIngredientSelect(addedIngredient);  // Assumes onIngredientSelect can handle this logic
            setNewIngredientModalVisible(false);
            // Optionally reset the newIngredient state
            setNewIngredient({ name: '', category: '', defaultUnit: '', defaultQuantity: '' });
        } else {
            console.error('Failed to create ingredient');
        }
    };

    return (
        <>
            <div className="absolute top-0 left-0 bg-black/50 w-full px-3 py-10 min-h-screen max-w-[500px]">
                <div className='bg-[#ECE3DC] min-h-screen p-4 rounded-xl'>
                    <p className='text-center px-2 py-1 rounded-full text bg-[#EC6856] text-white text mb-4' onClick={onClose} >Close</p>
                    <input
                        type="text"
                        placeholder="Search for ingredients..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="input input-bordered w-full rounded-2xl"
                    />
                    {searchTerm && (
                        <>
                            <div className='grid grid-cols-1 gap-4 mt-8 bg-[#FAF6EB] rounded-2xl p-4'>
                                {
                                    results && results.map(result => (
                                        <div className='flex gap-4 border-b border-b-black/10 pb-4 items-center'>
                                            <div className='grow flex flex-col items-start gap-1'>
                                                <p className='font-semibold'>{result.name}</p>
                                                <p className='text-xs'>{result.category}</p>
                                            </div>
                                            <button
                                                className=' px-4 py-1 rounded-xl text bg-[#B5DCA8] font-semibold text-black text-sm shadow'
                                                onClick={() => onIngredientSelect(result)}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    ))
                                }
                                <div className='flex gap-4 pb-4 items-center'>
                                    <div className='grow flex flex-col items-start gap-1'>
                                        <p className='font-semibold'>Add new</p>
                                        <p className='text-xs'>Add new</p>
                                    </div>
                                    <button
                                        className='px-4 py-1 rounded-xl text bg-[#B5DCA8] font-semibold text-black text-sm shadow'
                                        onClick={() => setNewIngredientModalVisible(true)}
                                    >
                                        Add new
                                    </button>

                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {newIngredientModalVisible && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Add New Ingredient</h3>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Name"
                                className="input input-bordered"
                                value={newIngredient.name}
                                onChange={e => setNewIngredient({ ...newIngredient, name: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Category</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Category"
                                className="input input-bordered"
                                value={newIngredient.category}
                                onChange={e => setNewIngredient({ ...newIngredient, category: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Default Unit</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Default Unit"
                                className="input input-bordered"
                                value={newIngredient.defaultUnit}
                                onChange={e => setNewIngredient({ ...newIngredient, defaultUnit: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Default Quantity</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Default Quantity"
                                className="input input-bordered"
                                value={newIngredient.defaultQuantity}
                                onChange={e => setNewIngredient({ ...newIngredient, defaultQuantity: e.target.value })}
                            />
                        </div>
                        <div className="modal-action">
                            <button className="btn btn-primary" onClick={handleCreateIngredient}>Create</button>
                            <button className="btn" onClick={() => setNewIngredientModalVisible(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default IngredientSearch;
