import Recipe from "../models/Recipe.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const createRecipe = async (req, res) => {
  const {
    title,
    ingredients,
    instructions,
    image,
    tags,
    prepTime,
    cookTime,
    servings,
    difficulty,
  } = req.body;

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
      prepTime,
      cookTime,
      servings,
      difficulty,
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
  const {
    title,
    ingredients,
    instructions,
    image,
    tags,
    prepTime,
    cookTime,
    servings,
    difficulty,
  } = req.body;

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
    recipe.prepTime = prepTime !== undefined ? prepTime : recipe.prepTime;
    recipe.cookTime = cookTime !== undefined ? cookTime : recipe.cookTime;
    recipe.servings = servings !== undefined ? servings : recipe.servings;
    recipe.difficulty = difficulty || recipe.difficulty;

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
  const {
    search,
    tags,
    difficulty,
    prepTime,
    servings,
    userRecipes,
    isPublic,
  } = req.query;
  try {
    let query = {};

    if (userRecipes === "true" && req.user) {
      query.createdBy = req.user._id;
    } else if (isPublic === "true") {
      query.isPublic = true;
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: { $regex: `^${escapedSearch}`, $options: "i" } },
        { ingredients: { $regex: `^${escapedSearch}`, $options: "i" } },
        { tags: { $regex: `^${escapedSearch}`, $options: "i" } },
      ];
    }

    if (tags) {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      query.tags = { $all: tagArray };
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (prepTime) {
      query.prepTime = { $lte: parseInt(prepTime) };
    }

    if (servings) {
      query.servings = parseInt(servings);
    }

    const recipes = await Recipe.find(query).populate(
      "createdBy",
      "username _id"
    );
    res.json(recipes);
  } catch (error) {
    console.error("Get recipes error:", {
      message: error.message,
      stack: error.stack,
      query: req.query,
    });
    res.status(400).json({ message: error.message });
  }
};

export const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("createdBy", "username _id")
      .populate({
        path: "comments",
        populate: { path: "userId", select: "username _id" },
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
    console.error("Get recipe error:", {
      message: error.message,
      stack: error.stack,
    });
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
      "username _id"
    );
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Post comment error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(400).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    recipe.comments = recipe.comments.filter(
      (id) => id.toString() !== commentId
    );
    await recipe.save();
    await Comment.deleteOne({ _id: commentId });

    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Delete comment error:", {
      message: error.message,
      stack: error.stack,
    });
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
    console.error("Save recipe error:", {
      message: error.message,
      stack: error.stack,
    });
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
    console.error("Remove saved recipe error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(400).json({ message: error.message });
  }
};

export const getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedRecipes",
      populate: { path: "createdBy", select: "username _id" },
    });
    res.json(user.savedRecipes);
  } catch (error) {
    console.error("Get saved recipes error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(400).json({ message: error.message });
  }
};
