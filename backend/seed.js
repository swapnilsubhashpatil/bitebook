import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Recipe from "./models/Recipe.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const sampleRecipes = [
  {
    title: "Classic Pancakes",
    ingredients: [
      "1 cup all-purpose flour",
      "1 tbsp sugar",
      "2 tsp baking powder",
      "1/2 tsp salt",
      "1 cup milk",
      "1 large egg",
      "2 tbsp melted butter",
    ],
    instructions:
      "1. In a large bowl, whisk together flour, sugar, baking powder, and salt.\n2. In another bowl, beat the egg and mix in milk and melted butter.\n3. Combine wet and dry ingredients, stirring until just blended.\n4. Heat a non-stick skillet over medium heat and pour 1/4 cup batter for each pancake.\n5. Cook until bubbles form on the surface, then flip and cook until golden brown.",
    image: "https://images.unsplash.com/photo-1565299543923-37dd37888d4e",
    tags: ["breakfast", "easy", "pancakes"],
    isPublic: true,
  },
  {
    title: "Vegetarian Stir-Fry",
    ingredients: [
      "2 cups broccoli florets",
      "1 red bell pepper, sliced",
      "1 carrot, sliced",
      "1 zucchini, sliced",
      "2 tbsp soy sauce",
      "1 tbsp sesame oil",
      "2 cloves garlic, minced",
      "1 tsp ginger, grated",
      "2 cups cooked rice",
    ],
    instructions:
      "1. Heat sesame oil in a large skillet over medium-high heat.\n2. Add garlic and ginger, sauté for 30 seconds.\n3. Add broccoli, bell pepper, carrot, and zucchini; stir-fry for 5-7 minutes until tender.\n4. Stir in soy sauce and cook for another 2 minutes.\n5. Serve over cooked rice.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    tags: ["vegetarian", "dinner", "quick"],
    isPublic: true,
  },
  {
    title: "Chocolate Chip Cookies",
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup unsalted butter, softened",
      "3/4 cup sugar",
      "3/4 cup brown sugar",
      "2 large eggs",
      "2 cups chocolate chips",
    ],
    instructions:
      "1. Preheat oven to 375°F (190°C).\n2. Mix flour, baking soda, and salt in a bowl.\n3. In another bowl, beat butter, sugar, and brown sugar until creamy.\n4. Add eggs one at a time, beating well.\n5. Gradually add dry ingredients, then stir in chocolate chips.\n6. Drop tablespoon-sized dough onto a baking sheet.\n7. Bake for 9-11 minutes until golden.",
    image: "https://images.unsplash.com/photo-1587056652820-fc0ca96e6c45",
    tags: ["dessert", "cookies", "baking"],
    isPublic: true,
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Recipe.deleteMany({});

    // Create a sample user
    const user = await User.create({
      username: "sampleuser",
      email: "sampleuser@example.com",
      password: "password123",
    });

    // Assign user as creator for all recipes
    const recipesWithUser = sampleRecipes.map((recipe) => ({
      ...recipe,
      createdBy: user._id,
    }));

    // Insert recipes
    await Recipe.insertMany(recipesWithUser);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
