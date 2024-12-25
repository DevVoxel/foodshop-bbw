import { useState, useEffect } from "react";
import MealItem from "./MealItem";
import Button from "./UI/Button";
export default function Meals() {
  const [loadedMeals, setLoadedMeals] = useState([]);
  const [isSorted, setIsSorted] = useState(false);
  const [sortedMeals, setSortedMeals] = useState([]);

  useEffect(() => {
    async function fetchMeals() {
      try {
        const response = await fetch("http://localhost:3000/meals");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const meals = await response.json();
        console.log("meals", meals);
        setLoadedMeals(meals);
      } catch (error) {
        console.error("Failed to fetch meals:", error);
      }
    }

    fetchMeals();
  }, []);

  useEffect(() => {
    if (isSorted) {
      const sorted = [...loadedMeals].sort((a, b) => a.price - b.price);
      setSortedMeals(sorted);
    } else {
      setSortedMeals([...loadedMeals]);
    };
  }, [isSorted, loadedMeals]);

  return (
    <>
      <Button onClick = {() => setIsSorted(!isSorted)}>Toggle Sort</Button>
      <ul id="meals">
        {sortedMeals.map((meal) => (
          <MealItem key={meal.id} meal={meal} />
        ))}
      </ul>
    </>
  );
}
