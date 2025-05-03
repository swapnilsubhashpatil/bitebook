import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  image: { type: String },
  tags: [{ type: String }],
  isPublic: { type: Boolean, default: true },
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: { type: Number, required: true, min: 1, max: 5 },
    },
  ],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Recipe", recipeSchema);
