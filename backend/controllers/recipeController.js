import Recipe from "../models/Recipe.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const createRecipe = async (req, res) => {
  const { title, ingredients, instructions, image, tags } = req.body;

  try {
    if (!title || !ingredients || !instructions) {
      return res
        .status(400)
        .json({ message: "Title, ingredients, and instructions are required" });
    }

    const recipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      image,
      tags,
      createdBy: req.user._id,
      isPublic: true,
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error("Create recipe error:", {
      message: error.message,
      stack: error.stack,
      body: req.body,
    });
    res
      .status(400)
      .json({ message: error.message || "Failed to create recipe" });
  }
};

export const editRecipe = async (req, res) => {
  const { title, ingredients, instructions, image, tags } = req.body;

  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this recipe" });
    }

    recipe.title = title || recipe.title;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.image = image !== undefined ? image : recipe.image;
    recipe.tags = tags || recipe.tags;

    await recipe.save();
    res.json(recipe);
  } catch (error) {
    console.error("Edit recipe error:", {
      message: error.message,
      stack: error.stack,
      body: req.body,
    });
    res.status(400).json({ message: error.message || "Failed to edit recipe" });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this recipe" });
    }

    await Recipe.deleteOne({ _id: req.params.id });
    res.json({ message: "Recipe deleted" });
  } catch (error) {
    console.error("Delete recipe error:", {
      message: error.message,
      stack: error.stack,
    });
    res
      .status(400)
      .json({ message: error.message || "Failed to delete recipe" });
  }
};

export const toggleRecipeVisibility = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this recipe" });
    }

    recipe.isPublic = !recipe.isPublic;
    await recipe.save();
    res.json({ isPublic: recipe.isPublic });
  } catch (error) {
    console.error("Toggle visibility error:", {
      message: error.message,
      stack: error.stack,
    });
    res
      .status(400)
      .json({ message: error.message || "Failed to toggle visibility" });
  }
};

export const getRecipes = async (req, res) => {
  const { search } = req.query;
  try {
    const query = search
      ? {
          $and: [
            { isPublic: true },
            {
              $or: [
                { title: { $regex: search, $options: "i" } },
                { ingredients: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } },
              ],
            },
          ],
        }
      : { isPublic: true };
    const recipes = await Recipe.find(query)
      .populate("createdBy", "username")
      .populate("comments");
    res.json(recipes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("createdBy", "username")
      .populate({
        path: "comments",
        populate: { path: "userId", select: "username" },
      });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    if (
      !recipe.isPublic &&
      (!req.user || recipe.createdBy.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Recipe is private" });
    }
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rateRecipe = async (req, res) => {
  const { rating } = req.body;
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const existingRating = recipe.ratings.find(
      (r) => r.userId.toString() === req.user._id.toString()
    );
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      recipe.ratings.push({ userId: req.user._id, rating });
    }

    await recipe.save();
    res.json({ message: "Rating updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const postComment = async (req, res) => {
  const { content } = req.body;
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const comment = await Comment.create({
      recipeId: req.params.id,
      userId: req.user._id,
      content,
    });

    recipe.comments.push(comment._id);
    await recipe.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      "userId",
      "username"
    );
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const saveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user.savedRecipes.includes(req.params.id)) {
      user.savedRecipes.push(req.params.id);
      await user.save();
    }

    res.json({ message: "Recipe saved" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeSavedRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const user = await User.findById(req.user._id);
    user.savedRecipes = user.savedRecipes.filter(
      (id) => id.toString() !== req.params.id
    );
    await user.save();

    res.json({ message: "Recipe removed from saved" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedRecipes",
      populate: { path: "createdBy", select: "username" },
    });
    res.json(user.savedRecipes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
