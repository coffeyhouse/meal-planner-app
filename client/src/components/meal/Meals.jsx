// src/components/meal/Meals.jsx

import React, { useState } from 'react';
import NavBar from '../common/NavBar';
import PageContainer from '../layout/PageContainer';
import { searchItems } from '../../utils/search';
import Modal from '../common/Modal';
import MealGrid from './MealGrid';
import SearchBar from '../common/SearchBar';
import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

function Meals() {
    const { data: meals, loading, error } = useFetch('/api/meals');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredMeals = searchItems(meals || [], ['name'], searchQuery);

    return (
        <PageContainer>
            <PageContainer.Header>
                <NavBar title="Meals" />
                <SearchBar searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
            </PageContainer.Header>
            <PageContainer.Content>
                {loading && <LoadingSpinner />}
                {error && <ErrorMessage message={error} />}
                {!loading && !error && <MealGrid meals={filteredMeals} />}
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
