import React, { useState, useEffect } from 'react';
import IngredientSearch from '../IngredientSearch';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import NavBar from '../common/NavBar';
import PageContainer from '../layout/PageContainer';
import Card from '../common/Card';
import CardContainer from '../common/CardContainer';
import Modal from '../common/Modal';
import Heading from '../common/Heading';
import Input from '../common/Input';
import Select from '../common/Select';

const baseUnits = [
    { label: 'grams', value: 'g' },
    { label: 'kilograms', value: 'kg' },
    { label: 'liters', value: 'l' },
    { label: 'milliliters', value: 'ml' },
    { label: 'cups', value: 'cups' },
    { label: 'tablespoons', value: 'tbsp' },
    { label: 'teaspoons', value: 'tsp' },
    { label: 'pieces', value: 'pcs' }
];

function RecipeBuilder() {
    const { mealId } = useParams();
    const navigate = useNavigate();
    const [recipeName, setRecipeName] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIngredient, setCurrentIngredient] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [addIngredients, setAddIngredients] = useState(false);
    const [commonUnits, setCommonUnits] = useState([...baseUnits]);
    const [isEditing, setIsEditing] = useState(true);
    const [imageURL, setImageURL] = useState('');

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    useEffect(() => {
        if (mealId) {
            fetch(`/api/meals/${mealId}`)
                .then(response => response.json())
                .then(data => {
                    setRecipeName(data.name);
                    setAuthorName(data.author || '');
                    setIngredients(data.ingredients.map(ing => ({
                        ...ing,
                        id: ing.id,
                        name: ing.name,
                        quantity: ing.quantity.toString(),
                        unit: ing.unit
                    })));
                    setImageURL(data.imageUrl || '');
                    setIsEditing(false);
                })
                .catch(error => console.error('Error fetching meal details:', error));
        }
    }, [mealId]);

    useEffect(() => {
        if (!mealId) {
            const savedMealData = localStorage.getItem('currentMeal');
            if (savedMealData) {
                const { recipeName, authorName, ingredients, imageURL } = JSON.parse(savedMealData);
                if (recipeName || ingredients.length > 0) {
                    if (window.confirm("Do you want to continue with your previous meal?")) {
                        setRecipeName(recipeName);
                        setAuthorName(authorName);
                        setIngredients(ingredients);
                        setImageURL(imageURL);
                        localStorage.removeItem('currentMeal');
                    } else {
                        localStorage.removeItem('currentMeal');
                    }
                }
            }
        }
    }, []);

    useEffect(() => {
        if (!mealId) {
            const mealData = {
                recipeName,
                authorName,
                ingredients,
                imageURL
            };
            localStorage.setItem('currentMeal', JSON.stringify(mealData));
        }
    }, [recipeName, authorName, ingredients, imageURL]);

    const handleIngredientSelect = (ingredient) => {
        setCurrentIngredient(ingredient);
        setIsModalOpen(true);

        let updatedUnits = [...baseUnits];

        if (ingredient.defaultUnit && ingredient.defaultUnit.trim() !== '' && !baseUnits.some(u => u.value === ingredient.defaultUnit)) {
            updatedUnits = [{ label: ingredient.defaultUnit, value: ingredient.defaultUnit }, ...updatedUnits];
        }

        setCommonUnits(updatedUnits);
        setUnit(ingredient.defaultUnit && ingredient.defaultUnit.trim() !== '' ? ingredient.defaultUnit : '');
    };

    const addIngredientToRecipe = () => {
        if (quantity && unit) {
            const extendedIngredient = {
                ...currentIngredient,
                quantity,
                unit
            };
            setIngredients(prevIngredients => [...prevIngredients, extendedIngredient]);
        }
        setIsModalOpen(false);
        resetIngredientForm();
        setAddIngredients(false);
    };

    const resetIngredientForm = () => {
        setQuantity('');
        setUnit('');
        setCurrentIngredient(null);
    };

    const removeIngredient = (id) => {
        setIngredients(prevIngredients => prevIngredients.filter(item => item.id !== id));
    };

    const handleAddMeal = () => {
        const simplifiedIngredients = ingredients.map(ingredient => ({
            id: ingredient.id,
            unit: ingredient.unit,
            quantity: parseInt(ingredient.quantity)
        }));

        const meal = {
            name: recipeName,
            authorName,
            ingredients: simplifiedIngredients,
            imageUrl: imageURL
        };

        const url = mealId ? `/api/meals/${mealId}` : '/api/meals';
        const method = mealId ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(meal)
        })
            .then(response => response.json())
            .then(data => {
                alert(`Meal successfully ${mealId ? 'updated' : 'added'}!`);
                localStorage.removeItem('currentMeal');
                navigate('/meals');
            })
            .catch(error => {
                alert(`Failed to ${mealId ? 'update' : 'add'} the meal. Please try again!`);
                console.error(`Error ${mealId ? 'updating' : 'saving'} meal:`, error);
            });
    };

    const handleImageUpload = () => {
        if (imageURL.trim() === '') {
            alert('Please enter a valid image URL');
            return;
        }

        fetch('/api/upload-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: imageURL, mealId })
        })
            .then(response => response.json())
            .then(data => {
                setImageURL(data.imageUrl);
                alert('Image uploaded successfully!');
            })
            .catch(error => {
                alert('Failed to upload image. Please try again!');
                console.error('Error uploading image:', error);
            });
    };

    return (
        <PageContainer>
            <PageContainer.Header>
                <NavBar title="Meal builder" />
            </PageContainer.Header>
            <PageContainer.Content>
                <div className='flex flex-col gap-4'>
                    <Input
                        label="Recipe name"
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        placeholder="Give it a name..."
                        disabled={!isEditing}
                    />
                    <Input
                        label="Author name"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="Enter author name..."
                        disabled={!isEditing}
                    />
                    <Input
                        label="Image URL"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                        placeholder="Enter image URL..."
                        disabled={!isEditing}
                    />
                    {isEditing && (
                        <Button onClick={handleImageUpload}>Upload Image</Button>
                    )}
                    <div>
                        <div className="flex items-center mb-2">
                            <div className="grow">
                                <Heading variant="h3">Ingredients</Heading>
                                <p className="text-sm font-light">{ingredients.length} item{ingredients.length > 1 ? "s" : ""}</p>
                            </div>
                            {isEditing && (
                                <Button onClick={() => setAddIngredients(true)}>Add</Button>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            {ingredients.length > 0 && (
                                <CardContainer>
                                    {ingredients.map(ingredient => (
                                        <Card
                                            key={ingredient.id}
                                            title={ingredient.name}
                                            description={`${ingredient.quantity} ${ingredient.unit}`}
                                            buttonType="remove"
                                            buttonClick={isEditing ? () => removeIngredient(ingredient.id) : null}
                                        />
                                    ))}
                                </CardContainer>
                            )}
                            {isEditing && !mealId && (
                                <Button onClick={handleAddMeal} disabled={ingredients.length === 0 || !recipeName}>Save</Button>
                            )}
                            {!isEditing && mealId && (
                                <Button onClick={() => setIsEditing(true)}>Edit</Button>
                            )}
                            {isEditing && mealId && (
                                <>
                                    <Button onClick={handleAddMeal} disabled={ingredients.length === 0 || !recipeName}>Save</Button>
                                    <Button.Secondary onClick={() => setIsEditing(false)}>Cancel edit</Button.Secondary>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {addIngredients && <IngredientSearch onIngredientSelect={handleIngredientSelect} onClose={() => setAddIngredients(false)} />}
                {isModalOpen && (
                    <Modal title={`Add Ingredient - ${currentIngredient?.name}`} onClose={toggleModal}>
                        <div className='flex flex-col gap-4'>

                            <Input
                                label="Quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Enter quantity"
                            />

                            <Select
                                label="Unit"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                options={commonUnits}
                            />
                            
                            <div className="modal-action flex justify-end gap-2 mt-4">
                                <Button onClick={addIngredientToRecipe} disabled={!quantity || !unit}>Add</Button>
                                <Button.Secondary onClick={toggleModal}>Cancel</Button.Secondary>
                            </div>
                        </div>
                    </Modal>
                )}
            </PageContainer.Content>
        </PageContainer>
    );
}

export default RecipeBuilder;
