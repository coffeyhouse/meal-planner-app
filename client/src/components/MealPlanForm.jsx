import React, { useState } from 'react';
import NavBar from './NavBar';
import PageContainer from './PageContainer';
import Button from './Button';

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
                <NavBar title="Create a meal plan" backButton="/" />
            </PageContainer.Header>
            <PageContainer.Content>
                <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-full'>
                    <p className='font-bold text-black/60 grow mt-4'>Start date</p>
                    <input
                        className="bg-white p-2 border w-full"
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        required
                    />
                    <p className='font-bold text-black/60 grow mt-4'>End date</p>
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
