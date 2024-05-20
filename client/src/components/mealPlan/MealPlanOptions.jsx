import React from 'react';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../common/NavBar';
import PageContainer from '../layout/PageContainer';
import Button from '../common/Button';

function MealPlanOptions() {
    const { mealPlanId } = useParams();

    return (
        <PageContainer>
            <PageContainer.Header>
                <NavBar title="Meal Plan Options" />
            </PageContainer.Header>
            <PageContainer.Content>
                <div className="flex flex-col items-center gap-4">
                    <Link to={`/plan/${mealPlanId}/add-meals`}>
                        <Button>Add Meals to Meal Plan</Button>
                    </Link>
                    <Link to={`/plan/${mealPlanId}/create-shopping-list`}>
                        <Button>Create Shopping List</Button>
                    </Link>
                </div>
            </PageContainer.Content>
        </PageContainer>
    );
}

export default MealPlanOptions;
