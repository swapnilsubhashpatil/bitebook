import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRecipes } from "../utils/api.js";
import RecipeCard from "../components/RecipeCard.jsx";

function Home() {
  const [search, setSearch] = useState("");
  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes", search],
    queryFn: () => getRecipes(search),
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Explore Recipes</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, ingredients, or tags..."
        className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes?.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
