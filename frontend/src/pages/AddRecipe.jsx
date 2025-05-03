import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { addRecipe } from "../utils/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

function AddRecipe() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const mutation = useMutation({
    mutationFn: addRecipe,
    onSuccess: () => {
      toast.success("Recipe added successfully!");
      navigate("/profile");
    },
    onError: (error) => toast.error(error.message),
  });

  if (!user) {
    return (
      <p className="text-gray-600">
        Please{" "}
        <a href="/login" className="text-orange-500">
          login
        </a>{" "}
        to add a recipe.
      </p>
    );
  }

  const onSubmit = (data) => {
    console.log("Add recipe form data:", data);
    // Process tags from input
    const additionalTags = data.tags
      ? data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [];
    // Include "vegetarian" tag only if selected
    const tags =
      data.isVegetarian === "vegetarian"
        ? ["vegetarian", ...additionalTags]
        : additionalTags;

    mutation.mutate({
      ...data,
      ingredients: data.ingredients
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item),
      tags,
      prepTime: data.prepTime ? parseInt(data.prepTime) : undefined,
      cookTime: data.cookTime ? parseInt(data.cookTime) : undefined,
      servings: data.servings ? parseInt(data.servings) : undefined,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Add New Recipe</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Title *
          </label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Ingredients (one per line) *
          </label>
          <textarea
            {...register("ingredients", {
              required: "Ingredients are required",
            })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows="5"
            placeholder="e.g., 2 cups flour\n1 tsp salt"
          />
          {errors.ingredients && (
            <p className="text-red-500 text-sm mt-1">
              {errors.ingredients.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Instructions *
          </label>
          <textarea
            {...register("instructions", {
              required: "Instructions are required",
            })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows="5"
          />
          {errors.instructions && (
            <p className="text-red-500 text-sm mt-1">
              {errors.instructions.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Image URL
          </label>
          <input
            type="text"
            {...register("image")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Recipe Type *
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="vegetarian"
                {...register("isVegetarian", {
                  required: "Please select a recipe type",
                })}
                className="form-radio h-5 w-5 text-orange-500"
                defaultChecked
              />
              <span className="ml-2 text-gray-700">Vegetarian</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="non-vegetarian"
                {...register("isVegetarian", {
                  required: "Please select a recipe type",
                })}
                className="form-radio h-5 w-5 text-orange-500"
              />
              <span className="ml-2 text-gray-700">Non-Vegetarian</span>
            </label>
          </div>
          {errors.isVegetarian && (
            <p className="text-red-500 text-sm mt-1">
              {errors.isVegetarian.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Additional Tags (comma-separated)
          </label>
          <input
            type="text"
            {...register("tags")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g., quick, dinner"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Prep Time (minutes)
          </label>
          <input
            type="number"
            {...register("prepTime")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Cook Time (minutes)
          </label>
          <input
            type="number"
            {...register("cookTime")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Servings
          </label>
          <input
            type="number"
            {...register("servings")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Difficulty
          </label>
          <select
            {...register("difficulty")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors duration-300"
        >
          Add Recipe
        </button>
      </form>
    </div>
  );
}

export default AddRecipe;
