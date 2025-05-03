import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useContext } from "react";
import { getRecipe, saveRecipe } from "../utils/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import CommentSection from "../components/CommentSection.jsx";
import LoginPromptModal from "../components/LoginPromptModal.jsx";
import { motion } from "framer-motion";

function RecipeDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => getRecipe(id),
  });

  const saveMutation = useMutation({
    mutationFn: () => saveRecipe(id),
    onSuccess: () => toast.success("Recipe saved!", { autoClose: 3000 }),
    onError: (error) => toast.error(error.message, { autoClose: 3000 }),
  });

  const handleSave = () => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }
    saveMutation.mutate();
  };

  if (isLoading) return <p className="text-gray-600 text-center">Loading...</p>;

  if (!recipe)
    return <p className="text-gray-600 text-center">Recipe not found.</p>;

  return (
    <motion.div
      className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{recipe.title}</h1>
      <div className="flex items-center mb-4">
        <p className="text-gray-600">Posted by </p>
        <Link
          to={`/user/${recipe.createdBy._id}`}
          className="text-orange-500 hover:underline ml-1"
        >
          {recipe.createdBy.username}
        </Link>
      </div>
      <img
        src={recipe.image || "https://via.placeholder.com/600"}
        alt={recipe.title}
        className="w-full h-96 object-cover rounded-lg mb-6"
      />
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={handleSave}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300"
        >
          Save Recipe
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Ingredients
          </h2>
          <ul className="list-disc pl-5 text-gray-600">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Instructions
          </h2>
          <p className="text-gray-600 whitespace-pre-line">
            {recipe.instructions}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {recipe.prepTime && (
          <p className="text-gray-600">
            <strong>Prep Time:</strong> {recipe.prepTime} minutes
          </p>
        )}
        {recipe.cookTime && (
          <p className="text-gray-600">
            <strong>Cook Time:</strong> {recipe.cookTime} minutes
          </p>
        )}
        {recipe.servings && (
          <p className="text-gray-600">
            <strong>Servings:</strong> {recipe.servings}
          </p>
        )}
        {recipe.difficulty && (
          <p className="text-gray-600">
            <strong>Difficulty:</strong>{" "}
            {recipe.difficulty.charAt(0).toUpperCase() +
              recipe.difficulty.slice(1)}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        {recipe.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-orange-100 text-orange-600 text-sm px-3 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <CommentSection recipeId={id} comments={recipe.comments} />
      <LoginPromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.div>
  );
}

export default RecipeDetails;
