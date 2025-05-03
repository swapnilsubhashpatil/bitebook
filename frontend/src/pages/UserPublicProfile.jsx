import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRecipes } from "../utils/api.js";
import RecipeCard from "../components/RecipeCard.jsx";

function UserPublicProfile() {
  const { userId } = useParams();

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["userRecipes", userId],
    queryFn: () => getRecipes(),
    select: (recipes) =>
      recipes.filter((recipe) => recipe.createdBy._id === userId),
  });

  if (isLoading) return <p className="text-gray-600 text-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {recipes?.[0]?.createdBy?.username || "User"}'s Recipes
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes?.length ? (
          recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))
        ) : (
          <p className="text-gray-600 text-center">No public recipes found.</p>
        )}
      </div>
    </div>
  );
}

export default UserPublicProfile;
