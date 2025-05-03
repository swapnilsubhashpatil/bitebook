import express from "express";
import {
  createRecipe,
  editRecipe,
  deleteRecipe,
  toggleRecipeVisibility,
  getRecipes,
  getRecipe,
  postComment,
  deleteComment,
  saveRecipe,
  removeSavedRecipe,
  getSavedRecipes,
} from "../controllers/recipeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createRecipe);
router.put("/:id", protect, editRecipe);
router.delete("/:id", protect, deleteRecipe);
router.patch("/:id/visibility", protect, toggleRecipeVisibility);
router.get("/", getRecipes);
router.get("/:id", getRecipe);
router.post("/:id/comments", protect, postComment);
router.delete("/:id/comments/:commentId", protect, deleteComment);
router.post("/:id/save", protect, saveRecipe);
router.delete("/:id/save", protect, removeSavedRecipe);
router.get("/users/saved", protect, getSavedRecipes);

export default router;
