import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSavedRecipes,
  getRecipes,
  removeSavedRecipe,
  deleteRecipe,
  toggleRecipeVisibility,
} from "../utils/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard.jsx";

function UserProfile() {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("saved");

  const { data: savedRecipes, isLoading: savedLoading } = useQuery({
    queryKey: ["savedRecipes"],
    queryFn: getSavedRecipes,
    enabled: !!user,
  });

  const { data: myRecipes, isLoading: myRecipesLoading } = useQuery({
    queryKey: ["myRecipes"],
    queryFn: () => getRecipes(),
    enabled: !!user,
    select: (recipes) =>
      recipes.filter((recipe) => recipe.createdBy._id === user?._id),
  });

  const removeSavedMutation = useMutation({
    mutationFn: removeSavedRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries(["savedRecipes"]);
      toast.success("Recipe removed from saved!");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries(["myRecipes"]);
      queryClient.invalidateQueries(["recipes"]);
      toast.success("Recipe deleted!");
    },
    onError: (error) => toast.error(error.message),
  });

  const visibilityMutation = useMutation({
    mutationFn: toggleRecipeVisibility,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["myRecipes"]);
      queryClient.invalidateQueries(["recipes"]);
      toast.success(`Recipe is now ${data.isPublic ? "public" : "private"}`);
    },
    onError: (error) => toast.error(error.message),
  });

  if (!user) {
    return (
      <p className="text-gray-600">
        Please{" "}
        <Link to="/login" className="text-orange-500">
          login
        </Link>{" "}
        to view your profile.
      </p>
    );
  }

  if (savedLoading || myRecipesLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("saved")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "saved" ? "bg-orange-500 text-white" : "bg-gray-200"
          }`}
        >
          Saved Recipes
        </button>
        <button
          onClick={() => setActiveTab("myRecipes")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "myRecipes"
              ? "bg-orange-500 text-white"
              : "bg-gray-200"
          }`}
        >
          My Recipes
        </button>
      </div>

      {activeTab === "saved" && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Saved Recipes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes?.length ? (
              savedRecipes.map((recipe) => (
                <div key={recipe._id} className="relative">
                  <RecipeCard recipe={recipe} />
                  <button
                    onClick={() => removeSavedMutation.mutate(recipe._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No saved recipes yet.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "myRecipes" && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            My Recipes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRecipes?.length ? (
              myRecipes.map((recipe) => (
                <div key={recipe._id} className="relative">
                  <RecipeCard recipe={recipe} />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => visibilityMutation.mutate(recipe._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      {recipe.isPublic ? "Make Private" : "Make Public"}
                    </button>
                    <Link
                      to={`/edit-recipe/${recipe._id}`}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteMutation.mutate(recipe._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No recipes added yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
