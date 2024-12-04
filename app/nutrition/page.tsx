"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface Recipe {
  image: string;
  label: string;
  protein: number;
  sugar: number;
  calories: number;
  fat: number;
  id: string;
  url: string;
}

export default function RecipeSearch() {
  const { setIsAuth, isLoggedIn }: any = useAuth();
  const router = useRouter();

  const edamamKey = process.env.NEXT_PUBLIC_EDAMAM_API_KEY;
  const edamamID = process.env.NEXT_PUBLIC_EDAMAM_API_ID;
  console.log(edamamID, edamamKey);
  const EDAMAM_API_URL = "https://api.edamam.com/api/recipes/v2";

  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("salad");
  const [loading, setLoadingState] = useState(false);
  const [showSavedRecipes, setShowSavedRecipes] = useState(false);

  const fetchRecipes = useCallback(
    async (query: string) => {
      const token = localStorage.getItem("token");
      console.log(isLoggedIn);
      if (token && isLoggedIn) {
        setLoadingState(true);
        try {
          const res = await fetch(
            `${EDAMAM_API_URL}?type=public&q=${encodeURIComponent(
              query
            )}&app_id=${edamamID}&app_key=${edamamKey}`
          );

          if (res.ok) {
            const data = await res.json();
            const recipes = data.hits.map((item: any) => {
              const nutrients = item.recipe.totalNutrients;
              return {
                label: item.recipe.label,
                image: item.recipe.image,
                url: item.recipe.url,
                calories: Math.round(nutrients.ENERC_KCAL.quantity),
                fat: Math.round(nutrients.FAT.quantity),
                protein: Math.round(nutrients.PROCNT.quantity),
                sugar: Math.round(nutrients.SUGAR.quantity),
                id: item.recipe.uri,
              };
            });
            setIsAuth(true);
            setRecipes(recipes);
          } else {
            router.push("/login");
            console.error("Failed to fetch recipes");
            setIsAuth(false);
          }
        } catch (err) {
          setIsAuth(false);
          console.error(`Error fetching recipes: ${err}`);
          router.push("/login");
        } finally {
          setLoadingState(false);
        }
      } else {
        setLoadingState(false);
      }
    },
    [edamamID, edamamKey, router, setIsAuth, isLoggedIn]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && !isLoggedIn) {
      router.push("/login");
    }
    fetchRecipes(searchQuery);
  }, [fetchRecipes, router, searchQuery, isLoggedIn]);

  const loadSavedRecipes = () => {
    const saved = localStorage.getItem("saved_recipes");
    return saved ? JSON.parse(saved) : [];
  };

  const saveRecipe = (recipe: any) => {
    const savedRecipes = loadSavedRecipes();

    if (!savedRecipes.some((saved: any) => saved.id === recipe.id)) {
      savedRecipes.push(recipe);
      localStorage.setItem("saved_recipes", JSON.stringify(savedRecipes));
      setSavedRecipes(savedRecipes);
      alert("Your recipe has been saved!");
    }
  };

  const isRecipeSaved = (recipeId: string) => {
    const savedRecipes = loadSavedRecipes();
    return savedRecipes.some((saved: any) => saved.id === recipeId);
  };

  useEffect(() => {
    setSavedRecipes(loadSavedRecipes());
  }, []);

  const removeSavedRecipe = (recipeId: string) => {
    const updatedSavedRecipes = savedRecipes.filter(
      (recipe) => recipe.id !== recipeId
    );
    localStorage.setItem("saved_recipes", JSON.stringify(updatedSavedRecipes));
    setSavedRecipes(updatedSavedRecipes);
  };

  return (
    <div className="bg-neutral-800 min-h-screen py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Find the perfect recipe for today!
      </h1>
      <div className="w-full flex justify-center mb-6 p-4">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-6 py-3 w-3/4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
      </div>

      <button
        onClick={() => setShowSavedRecipes(!showSavedRecipes)}
        className="mb-4 text-black bg-white hover:bg-neutral-200 rounded-md px-4 py-2"
      >
        {showSavedRecipes ? "Hide Saved Recipes" : "Show Saved Recipes"}
      </button>

      {showSavedRecipes && savedRecipes.length > 0 && (
        <div className="w-full my-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Saved Recipes
          </h2>
          <ul className="text-white">
            {savedRecipes.map((recipe: any, index: number) => (
              <li
                key={index}
                className="mb-2 flex items-center justify-between"
              >
                <a
                  href={recipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                >
                  {recipe.label}
                </a>
                <button
                  onClick={() => removeSavedRecipe(recipe.id)}
                  className="text-red-800 ml-1 bg-neutral-800 hover:bg-neutral-800"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading ? (
        <p className="text-center text-white">Loading recipes...</p>
      ) : recipes.length > 0 ? (
        <div className="w-full overflow-x-auto my-10">
          <div className="flex gap-10 justify-start items-start flex-nowrap my-44">
            {recipes.map((recipe: Recipe, index) => (
              <div
                key={index}
                className="flex-none w-[400px] h-[600px] bg-white rounded-lg shadow-md p-4 py-8"
              >
                <img
                  src={recipe.image}
                  alt={recipe.label}
                  className="rounded-lg overflow-hidden w-full h-[300px] object-cover"
                />
                <h3 className="text-lg font-semibold mt-4 text-gray-800 text-center truncate">
                  {recipe.label}
                </h3>
                <p className="text-gray-800 text-sm text-center">
                  <span className="block">
                    Calories: {recipe.calories} kcal
                  </span>
                  <span className="block">Fat: {recipe.fat} g</span>
                  <span className="block">Protein: {recipe.protein} g</span>
                  <span className="block">Sugar: {recipe.sugar} g</span>
                </p>
                <a
                  href={recipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-gray-500 mt-4"
                >
                  View Recipe
                </a>

                <button
                  onClick={() => saveRecipe(recipe)}
                  className="block text-center text-white bg-neutral-500 hover:bg-neutral-800 rounded-md mt-4 w-full"
                  disabled={isRecipeSaved(recipe.id)}
                >
                  {isRecipeSaved(recipe.id) ? "Saved" : "Save Recipe"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-white">
          No recipes found. Try searching for something else.
        </p>
      )}
    </div>
  );
}
