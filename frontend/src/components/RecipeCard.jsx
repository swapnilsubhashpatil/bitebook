import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function RecipeCard({ recipe }) {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
      whileHover={{ y: -5 }}
    >
      <Link to={`/recipe/${recipe._id}`}>
        <img
          src={recipe.image || "https://placehold.co/300x200?text=Recipe+Image"}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {recipe.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {recipe.instructions}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default RecipeCard;
