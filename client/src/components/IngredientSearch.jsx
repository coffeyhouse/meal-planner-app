import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import Modal from './common/Modal';
import Button from './common/Button';

function IngredientSearch({ onIngredientSelect, onClose }) {
    const [ingredients, setIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newIngredient, setNewIngredient] = useState({
        name: '',
        category: '',
        defaultUnit: '',
        defaultQuantity: ''
    });

    const toggleSearchModal = () => setIsSearchModalOpen(!isSearchModalOpen);
    const toggleCreateModal = () => setIsCreateModalOpen(!isCreateModalOpen);

    useEffect(() => {
        fetch('/api/ingredients')
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

    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleCreateIngredient = async () => {
        const response = await fetch('/api/ingredients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newIngredient)
        });
        if (response.ok) {
            const addedIngredient = await response.json();
            setIngredients([...ingredients, addedIngredient]);
            onIngredientSelect(addedIngredient);
            setIsCreateModalOpen(false);
            setNewIngredient({ name: '', category: '', defaultUnit: '', defaultQuantity: '' });
        } else {
            console.error('Failed to create ingredient');
        }
    };

    return (
        <>
            {isSearchModalOpen && (
                <Modal title="Search Ingredients" onClose={onClose}>
                    <input
                        type="text"
                        placeholder="Search for ingredients..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full border rounded p-2 mb-4"
                    />
                    <div className="max-h-80 overflow-y-auto">
                        {results.map(result => (
                            <div key={result.id} className="flex justify-between items-center py-2">
                                <div>
                                    <p className="font-semibold">{result.name}</p>
                                    <p className="text-sm text-gray-600">{result.category}</p>
                                </div>
                                <Button onClick={() => onIngredientSelect(result)}>
                                    Add
                                </Button>
                            </div>
                        ))}
                        <div className="flex justify-between items-center py-2">
                            <div>
                                <p className="font-semibold">Add new</p>
                                <p className="text-sm text-gray-600">Create a new ingredient</p>
                            </div>
                            <Button onClick={() => { toggleSearchModal(); toggleCreateModal(); }}>
                                Add new
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {isCreateModalOpen && (
                <Modal title="Add New Ingredient" onClose={() => { toggleCreateModal(); toggleSearchModal(); }}>
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
                    <div className="modal-action flex justify-end gap-2 mt-4">
                        <Button className="btn bg-blue-500 text-white" onClick={handleCreateIngredient}>
                            Create
                        </Button>
                        <Button className="btn bg-gray-300" onClick={() => { toggleCreateModal(); toggleSearchModal(); }}>
                            Cancel
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    );
}

export default IngredientSearch;
