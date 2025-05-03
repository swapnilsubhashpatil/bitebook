import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRecipes } from "../utils/api.js";
import RecipeCard from "../components/RecipeCard.jsx";
import Navbar from "../components/Navbar.jsx";
import FloatingActionButton from "../components/FloatingActionButton.jsx";

function Home() {
  const [search, setSearch] = useState("");
  const [isVegOnly, setIsVegOnly] = useState(false);

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes", search, isVegOnly],
    queryFn: () => {
      const filterParams = {
        isPublic: true,
        tags: isVegOnly ? "vegetarian" : "",
      };
      return getRecipes(search, filterParams);
    },
  });

  const handleSearch = (term) => {
    setSearch(term);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Navbar
        onVegToggle={() => setIsVegOnly(!isVegOnly)}
        isVegOnly={isVegOnly}
        onSearch={handleSearch}
      />
      <div className="mt-1">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Explore Recipes
        </h1>
        {isLoading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes?.length ? (
              recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))
            ) : (
              <p className="text-gray-600 text-center col-span-full">
                No recipes found.
              </p>
            )}
          </div>
        )}
      </div>
      <FloatingActionButton />
    </div>
  );
}

export default Home;
