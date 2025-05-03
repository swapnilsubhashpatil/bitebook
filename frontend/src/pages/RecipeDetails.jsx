import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useContext } from "react";
import { getRecipe, rateRecipe, saveRecipe } from "../utils/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import RatingStars from "../components/RatingStars.jsx";
import CommentSection from "../components/CommentSection.jsx";
import LoginPromptModal from "../components/LoginPromptModal.jsx";

function RecipeDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => getRecipe(id),
  });

  const rateMutation = useMutation({
    mutationFn: (rating) => rateRecipe(id, rating),
    onSuccess: () => toast.success("Rating submitted!", { autoClose: 3000 }),
    onError: (error) => toast.error(error.message, { autoClose: 3000 }),
  });

  const saveMutation = useMutation({
    mutationFn: () => saveRecipe(id),
    onSuccess: () => toast.success("Recipe saved!", { autoClose: 3000 }),
    onError: (error) => toast.error(error.message, { autoClose: 3000 }),
  });

  const handleRate = (rating) => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }
    rateMutation.mutate(rating);
  };

  const handleSave = () => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }
    saveMutation.mutate();
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{recipe.title}</h1>
      <img
        src={recipe.image || "https://via.placeholder.com/600"}
        alt={recipe.title}
        className="w-full h-96 object-cover rounded-lg mb-6"
      />
      <div className="flex items-center space-x-4 mb-6">
        <RatingStars
          onRate={handleRate}
          initialRating={
            recipe.ratings.find((r) => r.userId === user?._id)?.rating || 0
          }
        />
        <button
          onClick={handleSave}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Save Recipe
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <p className="text-gray-600">{recipe.instructions}</p>
        </div>
      </div>
      <CommentSection recipeId={id} comments={recipe.comments} />
      <LoginPromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default RecipeDetails;
