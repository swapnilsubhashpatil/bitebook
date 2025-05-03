import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

function RecipeCard({ recipe }) {
  const averageRating = recipe.ratings?.length
    ? (
        recipe.ratings.reduce((sum, r) => sum + r.rating, 0) /
        recipe.ratings.length
      ).toFixed(1)
    : "N/A";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={recipe.image || "https://via.placeholder.com/300"}
        alt={recipe.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{recipe.title}</h3>
        <div className="flex items-center mt-2">
          <FaStar className="text-yellow-400" />
          <span className="ml-1 text-gray-600">{averageRating}</span>
        </div>
        <Link
          to={`/recipe/${recipe._id}`}
          className="mt-4 inline-block text-orange-500 hover:text-orange-600 font-medium"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
}

export default RecipeCard;
