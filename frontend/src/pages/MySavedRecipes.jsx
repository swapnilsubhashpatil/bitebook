import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSavedRecipes } from "../utils/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import RecipeCard from "../components/RecipeCard.jsx";

function MySavedRecipes() {
  const { user } = useContext(AuthContext);
  const { data: recipes, isLoading } = useQuery({
    queryKey: ["savedRecipes"],
    queryFn: getSavedRecipes,
    enabled: !!user,
  });

  if (!user)
    return (
      <p className="text-gray-600">
        Please{" "}
        <a href="/login" className="text-orange-500">
          login
        </a>{" "}
        to view saved recipes.
      </p>
    );
  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        My Saved Recipes
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes?.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default MySavedRecipes;
