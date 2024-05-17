import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from './routes/root';
import ErrorPage from './routes/error-page';
import RecipeBuilder from './routes/recipe-builder';
import Meals from './routes/meals';
import MealDetails from './routes/meal-details';
import MealPlanList from './components/MealPlanList';
import MealPlanForm from './components/MealPlanForm';
import AddMealPlanDay from './components/AddMealPlanDay';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <MealPlanList />,
      },
      {
        path: "plan/add",
        element: <MealPlanForm />,
      },
      {
        path: "plan/:mealPlanId",
        element: <AddMealPlanDay />,
      },
      {
        path: "recipe-builder",
        element: <RecipeBuilder />, // Route for creating a new meal
      },
      {
        path: "recipe-builder/:mealId",
        element: <RecipeBuilder />, // Route for editing an existing meal
      },
      {
        path: "meals",
        element: <Meals />,
      },
      {
        path: "meals/:mealId",
        element: <MealDetails />,
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
