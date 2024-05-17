import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import Button from '../components/Button';
import NavBar from '../components/NavBar';
import Card from '../components/Card';
import PageContainer from '../components/PageContainer';
import CardContainer from '../components/CardContainer';

function Meals() {
    const [meals, setMeals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/meals')  // Adjust the URL as necessary to match your API endpoint
            .then(response => response.json())
            .then(data => setMeals(data))
            .catch(error => console.error('Error fetching meals:', error));
    }, []);

    const handleBack = () => {
        navigate('/');  // Navigates back to the list of meals
    };

    return (
        <PageContainer>
            <PageContainer.Header>
                <NavBar
                    title="Meals"
                    backButton="/"
                />
            </PageContainer.Header>
            <PageContainer.Content>
                <CardContainer>
                    {meals.map(meal => (
                        <Card
                            key={meal.id}
                            title={meal.name}
                            image={`https://picsum.photos/300?random=${Math.random()}`}
                            buttonType="view"
                            buttonLink={`/recipe-builder/${meal.id}`}
                        >

                        </Card>
                    ))}
                </CardContainer>
            </PageContainer.Content>
        </PageContainer>
    );
}

export default Meals;
