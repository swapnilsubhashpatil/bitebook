import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import RecipeDetails from "./pages/RecipeDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MySavedRecipes from "./pages/MySavedRecipes.jsx";
import AddRecipe from "./pages/AddRecipe.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import EditRecipe from "./pages/EditRecipe.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-recipes" element={<MySavedRecipes />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/edit-recipe/:id" element={<EditRecipe />} />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
      </div>
    </AuthProvider>
  );
}

export default App;
