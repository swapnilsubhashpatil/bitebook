import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Recipe from "./models/Recipe.js";
import { connectDB } from "./config/db.js";

dotenv.config();

// 25 unique recipes with valid image links
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
      "1. In a large bowl, whisk together flour, sugar, baking powder, and salt.\n2. In another bowl, beat the egg and mix in milk and melted butter.\n3. Combine wet and dry ingredients, stirring until just blended.\n4. Heat a non-stick skillet over medium heat and pour 1/4 cup batter for each pancake.\n5. Cook until bubbles form, flip, and cook until golden.",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["breakfast", "easy", "pancakes"],
    isPublic: true,
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "easy",
  },
  {
    title: "Vegetable Stir Fry",
    ingredients: [
      "2 cups broccoli florets",
      "1 red bell pepper, sliced",
      "1 carrot, julienned",
      "1 zucchini, sliced",
      "2 tbsp soy sauce",
      "1 tbsp sesame oil",
      "2 cloves garlic, minced",
      "1 tsp ginger, grated",
      "1 tbsp vegetable oil",
    ],
    instructions:
      "1. Heat vegetable oil in a wok or large skillet over high heat.\n2. Add garlic and ginger, stir for 30 seconds.\n3. Add vegetables and stir-fry for 4-5 minutes until crisp-tender.\n4. Add soy sauce and sesame oil, toss to combine.\n5. Serve immediately.",
    image:
      "https://images.pexels.com/photos/9016833/pexels-photo-9016833.jpeg?auto=compress&cs=tinysrgb&w=600",
    tags: ["vegetarian", "dinner", "quick"],
    isPublic: true,
    prepTime: 15,
    cookTime: 10,
    servings: 2,
    difficulty: "medium",
  },
  {
    title: "Chocolate Chip Cookies",
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup unsalted butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup packed brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups semisweet chocolate chips",
    ],
    instructions:
      "1. Preheat oven to 375°F (190°C).\n2. Combine flour, baking soda and salt in small bowl.\n3. Beat butter, sugars and vanilla in large mixer bowl until creamy.\n4. Add eggs one at a time, beating well after each addition.\n5. Gradually beat in flour mixture.\n6. Stir in chocolate chips.\n7. Drop by rounded tablespoon onto ungreased baking sheets.\n8. Bake for 9 to 11 minutes or until golden brown.",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["dessert", "baking", "cookies"],
    isPublic: true,
    prepTime: 20,
    cookTime: 10,
    servings: 24,
    difficulty: "easy",
  },
  {
    title: "Grilled Chicken Salad",
    ingredients: [
      "2 boneless, skinless chicken breasts",
      "6 cups mixed greens",
      "1 cucumber, sliced",
      "1 cup cherry tomatoes, halved",
      "1/4 red onion, thinly sliced",
      "1/4 cup olive oil",
      "2 tbsp lemon juice",
      "1 tsp Dijon mustard",
      "Salt and pepper to taste",
    ],
    instructions:
      "1. Season chicken with salt and pepper and grill until cooked through (165°F internal temp).\n2. Let rest for 5 minutes, then slice.\n3. In a large bowl, combine greens, cucumber, tomatoes and onion.\n4. Whisk together olive oil, lemon juice, mustard, salt and pepper for dressing.\n5. Add chicken to salad and drizzle with dressing.",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["healthy", "salad", "lunch"],
    isPublic: true,
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    difficulty: "easy",
  },
  {
    title: "Spaghetti Bolognese",
    ingredients: [
      "1 lb spaghetti",
      "1 lb ground beef",
      "1 onion, diced",
      "2 garlic cloves, minced",
      "1 carrot, diced",
      "1 celery stalk, diced",
      "28 oz canned crushed tomatoes",
      "2 tbsp tomato paste",
      "1/2 cup red wine",
      "1 tsp dried oregano",
      "Salt and pepper to taste",
      "Parmesan cheese for serving",
    ],
    instructions:
      "1. Cook spaghetti according to package directions.\n2. In a large pot, brown ground beef over medium heat.\n3. Add onion, garlic, carrot and celery, cook until softened.\n4. Stir in tomatoes, tomato paste, wine and oregano.\n5. Simmer for 30 minutes, season with salt and pepper.\n6. Serve sauce over cooked spaghetti with grated Parmesan.",
    image:
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["dinner", "italian", "pasta"],
    isPublic: true,
    prepTime: 15,
    cookTime: 40,
    servings: 4,
    difficulty: "medium",
  },
  {
    title: "Avocado Toast",
    ingredients: [
      "2 slices sourdough bread",
      "1 ripe avocado",
      "1 tbsp lemon juice",
      "1/4 tsp red pepper flakes",
      "Salt and pepper to taste",
      "2 eggs (optional)",
      "Microgreens for garnish",
    ],
    instructions:
      "1. Toast bread until golden and crisp.\n2. Mash avocado with lemon juice, salt and pepper.\n3. Spread avocado mixture on toast.\n4. Top with red pepper flakes and microgreens.\n5. Optional: Top with a poached or fried egg.",
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["breakfast", "vegan", "quick"],
    isPublic: true,
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    difficulty: "easy",
  },
  {
    title: "Chicken Tikka Masala",
    ingredients: [
      "1.5 lbs boneless chicken, cubed",
      "1 cup yogurt",
      "2 tbsp lemon juice",
      "2 tsp cumin",
      "2 tsp paprika",
      "1 onion, diced",
      "3 garlic cloves, minced",
      "1 tbsp ginger, grated",
      "15 oz tomato sauce",
      "1 cup heavy cream",
      "1 tbsp garam masala",
      "Fresh cilantro for garnish",
    ],
    instructions:
      "1. Marinate chicken in yogurt, lemon juice, cumin and paprika for 1 hour.\n2. Grill or broil chicken until lightly charred.\n3. In a pan, sauté onion, garlic and ginger until soft.\n4. Add tomato sauce and simmer for 10 minutes.\n5. Stir in cream and garam masala, add chicken.\n6. Simmer for 10 minutes, garnish with cilantro.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["indian", "dinner", "spicy"],
    isPublic: true,
    prepTime: 70,
    cookTime: 30,
    servings: 4,
    difficulty: "medium",
  },
  {
    title: "Greek Yogurt Parfait",
    ingredients: [
      "1 cup Greek yogurt",
      "1/2 cup granola",
      "1/2 cup mixed berries",
      "1 tbsp honey",
      "1 tbsp chia seeds",
    ],
    instructions:
      "1. In a glass, layer half the yogurt.\n2. Add half the granola and half the berries.\n3. Repeat layers.\n4. Drizzle with honey and sprinkle chia seeds on top.",
    image:
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["breakfast", "healthy", "snack"],
    isPublic: true,
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: "easy",
  },
  {
    title: "Margherita Pizza",
    ingredients: [
      "1 lb pizza dough",
      "1/2 cup tomato sauce",
      "8 oz fresh mozzarella, sliced",
      "1/4 cup fresh basil leaves",
      "2 tbsp olive oil",
      "Salt to taste",
    ],
    instructions:
      "1. Preheat oven to 475°F (245°C).\n2. Roll out dough on a floured surface.\n3. Spread tomato sauce over dough.\n4. Arrange mozzarella slices on top.\n5. Bake for 10-12 minutes until crust is golden.\n6. Remove from oven, drizzle with olive oil, sprinkle with salt and basil.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["italian", "dinner", "vegetarian"],
    isPublic: true,
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    difficulty: "medium",
  },
  {
    title: "Berry Smoothie",
    ingredients: [
      "1 banana",
      "1 cup mixed berries",
      "1 cup almond milk",
      "1 tbsp peanut butter",
      "1 tsp honey",
      "1/2 cup ice cubes",
    ],
    instructions:
      "1. Place all ingredients in a blender.\n2. Blend until smooth.\n3. Pour into a glass and serve immediately.",
    image:
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["breakfast", "drink", "healthy"],
    isPublic: true,
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: "easy",
  },
  {
    title: "French Omelette",
    ingredients: [
      "3 large eggs",
      "1 tbsp butter",
      "1 tbsp chives, chopped",
      "Salt and pepper to taste",
    ],
    instructions:
      "1. Beat eggs with salt and pepper.\n2. Melt butter in a nonstick skillet over medium-low heat.\n3. Pour in eggs and stir gently with a rubber spatula.\n4. When eggs begin to set, stop stirring and let cook undisturbed.\n5. Fold omelette in half and slide onto plate.\n6. Garnish with chives.",
    image:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["breakfast", "eggs", "quick"],
    isPublic: true,
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    difficulty: "medium",
  },
  {
    title: "Tomato Basil Soup",
    ingredients: [
      "2 lbs ripe tomatoes, quartered",
      "1 onion, chopped",
      "4 garlic cloves",
      "1/4 cup olive oil",
      "2 cups vegetable broth",
      "1/2 cup fresh basil leaves",
      "1/2 cup heavy cream",
      "Salt and pepper to taste",
    ],
    instructions:
      "1. Toss tomatoes, onion and garlic with olive oil and roast at 400°F for 30 minutes.\n2. Transfer to a pot, add broth and basil.\n3. Simmer for 15 minutes.\n4. Blend until smooth.\n5. Stir in cream, season with salt and pepper.",
    image:
      "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["soup", "vegetarian", "comfort food"],
    isPublic: true,
    prepTime: 10,
    cookTime: 45,
    servings: 4,
    difficulty: "easy",
  },
  {
    title: "French Toast",
    ingredients: [
      "4 thick slices brioche or challah bread",
      "2 large eggs",
      "1/2 cup milk",
      "1 tsp vanilla extract",
      "1/2 tsp cinnamon",
      "2 tbsp butter",
      "Maple syrup for serving",
    ],
    instructions:
      "1. Whisk together eggs, milk, vanilla and cinnamon.\n2. Soak bread slices in mixture for 30 seconds per side.\n3. Melt butter in a skillet over medium heat.\n4. Cook bread until golden brown, about 3 minutes per side.\n5. Serve warm with maple syrup.",
    image:
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["breakfast", "sweet", "brunch"],
    isPublic: true,
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    difficulty: "easy",
  },
  {
    title: "Beef Tacos",
    ingredients: [
      "1 lb ground beef",
      "1 packet taco seasoning",
      "12 taco shells",
      "1 cup shredded lettuce",
      "1 tomato, diced",
      "1/2 cup shredded cheddar cheese",
      "1/4 cup sour cream",
      "1/4 cup salsa",
    ],
    instructions:
      "1. Brown ground beef in a skillet, drain fat.\n2. Add taco seasoning and water according to package directions.\n3. Simmer for 5 minutes.\n4. Warm taco shells according to package.\n5. Fill shells with beef and top with desired toppings.",
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["mexican", "dinner", "family"],
    isPublic: true,
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "easy",
  },
  {
    title: "Lemon Garlic Shrimp Pasta",
    ingredients: [
      "8 oz linguine",
      "1 lb shrimp, peeled and deveined",
      "3 garlic cloves, minced",
      "1/4 cup olive oil",
      "1/4 cup white wine",
      "1 lemon, juiced and zested",
      "1/4 tsp red pepper flakes",
      "1/4 cup parsley, chopped",
      "Salt and pepper to taste",
    ],
    instructions:
      "1. Cook pasta according to package directions.\n2. Heat olive oil in a pan, add garlic and red pepper flakes.\n3. Add shrimp and cook until pink, about 2 minutes per side.\n4. Deglaze pan with white wine and lemon juice.\n5. Toss with cooked pasta, lemon zest and parsley.\n6. Season with salt and pepper.",
    image:
      "https://tastefullygrace.com/wp-content/uploads/2022/06/Lemon-Pasta-Pasta-Al-Limone-1-scaled.jpg",
    tags: ["seafood", "pasta", "dinner"],
    isPublic: true,
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: "medium",
  },
  {
    title: "Banana Bread",
    ingredients: [
      "3 ripe bananas, mashed",
      "1/3 cup melted butter",
      "3/4 cup sugar",
      "1 egg, beaten",
      "1 tsp vanilla extract",
      "1 tsp baking soda",
      "1 1/2 cups all-purpose flour",
      "Pinch of salt",
    ],
    instructions:
      "1. Preheat oven to 350°F (175°C).\n2. Mix bananas, butter, sugar, egg and vanilla.\n3. Add baking soda, flour and salt, stir to combine.\n4. Pour into a greased loaf pan.\n5. Bake for 50-60 minutes until a toothpick comes out clean.",
    image:
      "https://images.pexels.com/photos/1277202/pexels-photo-1277202.jpeg?auto=compress&cs=tinysrgb&w=600",
    tags: ["baking", "breakfast", "dessert"],
    isPublic: true,
    prepTime: 10,
    cookTime: 55,
    servings: 8,
    difficulty: "easy",
  },
  {
    title: "Caesar Salad",
    ingredients: [
      "1 romaine lettuce heart, chopped",
      "1/2 cup croutons",
      "1/4 cup Parmesan cheese, grated",
      "1/4 cup Caesar dressing",
      "1 anchovy fillet, minced (optional)",
      "1 garlic clove, minced",
      "1 tbsp lemon juice",
      "Salt and pepper to taste",
    ],
    instructions:
      "1. In a large bowl, combine lettuce, croutons and Parmesan.\n2. Whisk together dressing, anchovy, garlic and lemon juice.\n3. Toss salad with dressing.\n4. Season with salt and pepper.",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["salad", "lunch", "vegetarian"],
    isPublic: true,
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    difficulty: "easy",
  },
  {
    title: "Beef Burger",
    ingredients: [
      "1 lb ground beef",
      "1 tsp Worcestershire sauce",
      "1/2 tsp garlic powder",
      "1/2 tsp onion powder",
      "Salt and pepper to taste",
      "4 hamburger buns",
      "Lettuce, tomato, onion for serving",
      "Cheese slices (optional)",
      "Condiments of choice",
    ],
    instructions:
      "1. Mix beef with Worcestershire sauce and seasonings.\n2. Form into 4 patties.\n3. Grill or pan-fry to desired doneness (3-4 minutes per side for medium).\n4. Toast buns lightly.\n5. Assemble burgers with desired toppings.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["dinner", "bbq", "american"],
    isPublic: true,
    prepTime: 10,
    cookTime: 10,
    servings: 4,
    difficulty: "easy",
  },
  {
    title: "Vegetable Lasagna",
    ingredients: [
      "9 lasagna noodles",
      "2 cups ricotta cheese",
      "1 egg",
      "1/4 cup Parmesan cheese",
      "2 cups shredded mozzarella",
      "2 cups marinara sauce",
      "2 cups mixed vegetables (zucchini, spinach, mushrooms)",
      "1 tsp Italian seasoning",
    ],
    instructions:
      "1. Cook noodles according to package.\n2. Mix ricotta, egg and Parmesan.\n3. Layer noodles, ricotta mixture, vegetables, sauce and mozzarella in a baking dish.\n4. Repeat layers, ending with mozzarella.\n5. Bake at 375°F for 30 minutes until bubbly.",
    image:
      "https://images.pexels.com/photos/31807807/pexels-photo-31807807/free-photo-of-gourmet-baked-potato-with-cheese-and-greens.jpeg?auto=compress&cs=tinysrgb&w=600",
    tags: ["vegetarian", "pasta", "dinner"],
    isPublic: true,
    prepTime: 20,
    cookTime: 30,
    servings: 6,
    difficulty: "medium",
  },
  {
    title: "Mango Lassi",
    ingredients: [
      "1 ripe mango, peeled and diced",
      "1 cup plain yogurt",
      "1/2 cup milk",
      "2 tbsp honey or sugar",
      "1/4 tsp cardamom",
      "Ice cubes (optional)",
    ],
    instructions:
      "1. Combine all ingredients in a blender.\n2. Blend until smooth.\n3. Serve chilled, garnished with a pinch of cardamom.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["drink", "indian", "refreshing"],
    isPublic: true,
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    difficulty: "easy",
  },
  {
    title: "Chicken Fajitas",
    ingredients: [
      "1 lb chicken breast, sliced",
      "1 red bell pepper, sliced",
      "1 green bell pepper, sliced",
      "1 onion, sliced",
      "2 tbsp fajita seasoning",
      "2 tbsp olive oil",
      "8 flour tortillas",
      "Toppings: sour cream, guacamole, salsa",
    ],
    instructions:
      "1. Toss chicken and vegetables with seasoning and oil.\n2. Cook in a skillet over high heat for 8-10 minutes until chicken is done.\n3. Warm tortillas.\n4. Serve fajita mixture with tortillas and toppings.",
    image:
      "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["mexican", "dinner", "chicken"],
    isPublic: true,
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    difficulty: "easy",
  },
  {
    title: "Butternut Squash Soup",
    ingredients: [
      "1 butternut squash, peeled and cubed",
      "1 onion, chopped",
      "2 carrots, chopped",
      "4 cups vegetable broth",
      "1/2 tsp nutmeg",
      "1/2 cup heavy cream",
      "Salt and pepper to taste",
    ],
    instructions:
      "1. Sauté onion and carrots until soft.\n2. Add squash and broth, simmer until squash is tender.\n3. Blend until smooth.\n4. Stir in cream and nutmeg.\n5. Season with salt and pepper.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["soup", "vegetarian", "fall"],
    isPublic: true,
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: "easy",
  },
  {
    title: "Chocolate Mousse",
    ingredients: [
      "6 oz semisweet chocolate",
      "3 eggs, separated",
      "1 tbsp sugar",
      "1/2 cup heavy cream",
      "1 tsp vanilla extract",
      "Pinch of salt",
    ],
    instructions:
      "1. Melt chocolate and let cool slightly.\n2. Whisk egg yolks into chocolate.\n3. Beat egg whites with sugar until stiff peaks form.\n4. Whip cream with vanilla until soft peaks.\n5. Fold egg whites and whipped cream into chocolate mixture.\n6. Chill for at least 2 hours before serving.",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["dessert", "chocolate", "french"],
    isPublic: true,
    prepTime: 20,
    cookTime: 0,
    servings: 4,
    difficulty: "medium",
  },
  {
    title: "Egg Fried Rice",
    ingredients: [
      "3 cups cooked rice (preferably day-old)",
      "2 eggs, beaten",
      "1/2 cup frozen peas and carrots",
      "2 green onions, chopped",
      "2 tbsp soy sauce",
      "1 tbsp sesame oil",
      "1 tbsp vegetable oil",
    ],
    instructions:
      "1. Heat vegetable oil in a wok or large skillet.\n2. Scramble eggs and remove from pan.\n3. Add vegetables and stir-fry for 2 minutes.\n4. Add rice and stir-fry for 3 minutes.\n5. Stir in eggs, soy sauce and sesame oil.\n6. Garnish with green onions.",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["asian", "quick", "dinner"],
    isPublic: true,
    prepTime: 10,
    cookTime: 10,
    servings: 4,
    difficulty: "easy",
  },
  {
    title: "Blueberry Muffins",
    ingredients: [
      "2 cups all-purpose flour",
      "1/2 cup sugar",
      "1 tbsp baking powder",
      "1/2 tsp salt",
      "1 egg",
      "1 cup milk",
      "1/4 cup melted butter",
      "1 tsp vanilla extract",
      "1 1/2 cups fresh blueberries",
    ],
    instructions:
      "1. Preheat oven to 375°F (190°C).\n2. Mix dry ingredients in one bowl.\n3. Mix wet ingredients in another bowl.\n4. Combine wet and dry ingredients, fold in blueberries.\n5. Divide batter into muffin tin.\n6. Bake for 20-25 minutes until golden.",
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    tags: ["breakfast", "baking", "snack"],
    isPublic: true,
    prepTime: 15,
    cookTime: 25,
    servings: 12,
    difficulty: "easy",
  },
];

// Define 5 sample users
const sampleUsers = [
  { username: "ChefAlice", email: "alice@example.com", password: "password1" },
  { username: "BakerBob", email: "bob@example.com", password: "password2" },
  {
    username: "CookCharlie",
    email: "charlie@example.com",
    password: "password3",
  },
  { username: "DinerDave", email: "dave@example.com", password: "password4" },
  { username: "EaterEve", email: "eve@example.com", password: "password5" },
];

const seedDB = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log("Database connected successfully.");

    // Clear existing data
    console.log("Clearing existing User data...");
    await User.deleteMany({});
    console.log("User data cleared.");

    console.log("Clearing existing Recipe data...");
    await Recipe.deleteMany({});
    console.log("Recipe data cleared.");

    // Check if we have enough recipes
    if (sampleRecipes.length < sampleUsers.length * 5) {
      console.error(
        `Error: Not enough sample recipes (${sampleRecipes.length}) to assign 5 to each of the ${sampleUsers.length} users.`
      );
      process.exit(1);
    }

    let recipeIndex = 0; // Keep track of which recipe to assign next

    // Loop through each sample user
    for (const userData of sampleUsers) {
      console.log(`Creating user: ${userData.username}`);
      // Create the user
      // Note: In a real app, hash the password before saving!
      const user = await User.create(userData);
      console.log(`User ${user.username} created with ID: ${user._id}`);

      // Select 5 recipes for this user
      const userRecipesData = sampleRecipes.slice(recipeIndex, recipeIndex + 5);
      recipeIndex += 5; // Move the index for the next user

      // Assign the current user as the creator for these 5 recipes
      const recipesWithUser = userRecipesData.map((recipe) => ({
        ...recipe,
        createdBy: user._id, // Link recipe to the created user
      }));

      // Insert the 5 recipes for the current user
      console.log(`Inserting 5 recipes for user ${user.username}...`);
      await Recipe.insertMany(recipesWithUser);
      console.log(`Recipes inserted for user ${user.username}.`);
    }

    console.log("-------------------------------------");
    console.log(
      "Database seeded successfully with 5 users and 5 recipes each!"
    );
    console.log("-------------------------------------");
    process.exit(0); // Exit script after successful seeding
  } catch (error) {
    console.error("-------------------------------------");
    console.error("Error seeding database:", error);
    console.error("-------------------------------------");
    process.exit(1); // Exit script with error status
  }
};

// Run the seeding function
seedDB();
