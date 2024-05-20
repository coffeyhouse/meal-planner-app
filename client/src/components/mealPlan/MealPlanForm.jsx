import React, { useState } from 'react';
import NavBar from '../common/NavBar';
import PageContainer from '../layout/PageContainer';
import Button from '../common/Button';
import Heading from '../common/Heading';

function MealPlanForm() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

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
            console.log(result); // For debugging purposes
        } catch (error) {
            console.error('Failed to create meal plan:', error);
            setMessage('Failed to create meal plan. Please try again later.');
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
                <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-full'>
                    <Heading variant="h3">Start date</Heading>
                    <input
                        className="bg-white p-2 border w-full"
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        required
                    />
                    <Heading variant="h3">End date</Heading>
                    <input
                        className="bg-white p-2 border"
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
            </PageContainer.Content>
        </PageContainer>
    );
}

export default MealPlanForm;
