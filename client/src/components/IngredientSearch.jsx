// src/components/IngredientSearch.jsx

import React, { useState, useEffect } from 'react';
import Modal from './common/Modal';
import Button from './common/Button';
import { searchItems } from '../utils/search';
import useFetch from '../hooks/useFetch';
import Input from './common/Input';

function IngredientSearch({ onIngredientSelect, onClose }) {
    const { data: ingredients, loading: ingredientsLoading, error: ingredientsError } = useFetch('/api/ingredients');
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

    const results = searchItems(ingredients || [], ['name'], searchTerm);

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
                    <Input
                        placeholder="Search for ingredients..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full mb-4"
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
                    <div className='flex flex-col gap-2'>
                        <Input
                            label="Name"
                            value={newIngredient.name}
                            onChange={e => setNewIngredient({ ...newIngredient, name: e.target.value })}
                        />

                        <Input
                            label="Category"
                            value={newIngredient.category}
                            onChange={e => setNewIngredient({ ...newIngredient, category: e.target.value })}
                        />

                        <Input
                            label="Default unit"
                            value={newIngredient.defaultUnit}
                            onChange={e => setNewIngredient({ ...newIngredient, defaultUnit: e.target.value })}
                        />


                        <Input
                            type="number"
                            label="Default quantity"
                            value={newIngredient.defaultQuantity}
                            onChange={e => setNewIngredient({ ...newIngredient, defaultQuantity: e.target.value })}
                        />
                    </div>
                    <div className="modal-action flex justify-end gap-2 mt-4">
                        <Button onClick={handleCreateIngredient}>
                            Create
                        </Button>
                        <Button.Secondary onClick={() => { toggleCreateModal(); toggleSearchModal(); }}>
                            Cancel
                        </Button.Secondary>
                    </div>
                </Modal >
            )
            }
        </>
    );
}

export default IngredientSearch;
