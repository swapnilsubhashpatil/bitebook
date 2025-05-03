import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  image: { type: String },
  tags: [{ type: String }],
  isPublic: { type: Boolean, default: true },
  prepTime: { type: Number },
  cookTime: { type: Number },
  servings: { type: Number },
  difficulty: { type: String, enum: ["easy", "medium", "hard"] },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Recipe", recipeSchema);
