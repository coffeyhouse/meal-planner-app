// src/components/mealPlan/MealPlanForm.jsx

import React, { useState } from 'react';
import NavBar from '../common/NavBar';
import PageContainer from '../layout/PageContainer';
import Button from '../common/Button';
import Heading from '../common/Heading';
import Input from '../common/Input';
import Notification from '../common/Notification';

function MealPlanForm() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [notification, setNotification] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/meal-plans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ startDate, endDate })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setMessage('Meal plan created successfully!');
            setNotification({ message: 'Meal plan created successfully!', type: 'success' });
        } catch (error) {
            console.error('Failed to create meal plan:', error);
            setMessage('Failed to create meal plan. Please try again later.');
            setNotification({ message: 'Failed to create meal plan. Please try again later.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <PageContainer.Header>
                <NavBar title="Create a meal plan" />
            </PageContainer.Header>
            <PageContainer.Content>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
                    <Input
                        label="Start date"
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        required
                    />
                    <Input
                        label="End date"
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        required
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Meal Plan'}
                    </Button>
                </form>
                {message && <p>{message}</p>}
                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </PageContainer.Content>
        </PageContainer>
    );
}

export default MealPlanForm;
