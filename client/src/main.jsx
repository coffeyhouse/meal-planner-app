import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from './routes/Root';
import ErrorPage from './routes/ErrorPage';
import RecipeBuilder from './components/meal/RecipeBuilder';
import Meals from './components/meal/Meals';
import MealPlanList from './components/mealPlan/MealPlanList';
import MealPlanForm from './components/mealPlan/MealPlanForm';
import AddMealPlanDay from './components/mealPlan/AddMealPlanDay';
import HomePage from './components/HomePage';
import MealPlanOptions from './components/mealPlan/MealPlanOptions';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "meal-plans",
        element: <MealPlanList />,
      },
      {
        path: "meal-plans/plan/add",
        element: <MealPlanForm />,
      },
      {
        path: "plan/:mealPlanId/options",
        element: <MealPlanOptions />,
      },
      {
        path: "plan/:mealPlanId/add-meals",
        element: <AddMealPlanDay />,
      },
      {
        path: "recipe-builder",
        element: <RecipeBuilder />,
      },
      {
        path: "recipe-builder/:mealId",
        element: <RecipeBuilder />,
      },
      {
        path: "meals",
        element: <Meals />,
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
