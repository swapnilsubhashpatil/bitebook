import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRecipe, editRecipe } from "../utils/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

function EditRecipe() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => getRecipe(id),
    onSuccess: (data) => {
      reset({
        title: data.title,
        ingredients: data.ingredients.join("\n"),
        instructions: data.instructions,
        image: data.image || "",
        tags: data.tags.join(", "),
      });
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => editRecipe(id, data),
    onSuccess: () => {
      toast.success("Recipe updated successfully!");
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
        to edit a recipe.
      </p>
    );
  }

  if (isLoading) return <p>Loading...</p>;

  if (recipe.createdBy._id !== user._id) {
    return (
      <p className="text-gray-600">
        You are not authorized to edit this recipe.
      </p>
    );
  }

  const onSubmit = (data) => {
    console.log("Edit recipe form data:", data);
    mutation.mutate({
      ...data,
      ingredients: data.ingredients
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item),
      tags: data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Recipe</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Ingredients (one per line)
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
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Instructions</label>
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
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Image URL (optional)
          </label>
          <input
            type="text"
            {...register("image")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Tags (comma-separated, optional)
          </label>
          <input
            type="text"
            {...register("tags")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g., vegetarian, quick, dinner"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600"
        >
          Update Recipe
        </button>
      </form>
    </div>
  );
}

export default EditRecipe;
