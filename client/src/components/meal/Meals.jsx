import React, { useState, useEffect } from 'react';
import NavBar from '../common/NavBar';
import PageContainer from '../layout/PageContainer';
import { searchItems } from '../../utils/search';
import Modal from '../common/Modal';
import MealGrid from './MealGrid';
import SearchBar from '../common/SearchBar'; // Import the new SearchBar component

function Meals() {
    const [meals, setMeals] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch('/api/meals')
            .then(response => response.json())
            .then(data => setMeals(data))
            .catch(error => console.error('Error fetching meals:', error));
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredMeals = searchItems(meals, ['name'], searchQuery);

    return (
        <PageContainer>
            <PageContainer.Header>
                <NavBar title="Meals" />
                <SearchBar searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
            </PageContainer.Header>
            <PageContainer.Content>
                <MealGrid meals={filteredMeals} />
            </PageContainer.Content>
            {isModalOpen && (
                <Modal title="Meal filter" onClose={() => setIsModalOpen(false)}>
                    <p>There'll be some filters here of some sort.</p>
                </Modal>
            )}
        </PageContainer>
    );
}

export default Meals;
