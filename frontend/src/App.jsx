import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import RecipeDetails from "./pages/RecipeDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AddRecipe from "./pages/AddRecipe.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import EditRecipe from "./pages/EditRecipe.jsx";
import UserPublicProfile from "./pages/UserPublicProfile.jsx";
import FloatingActionButton from "./components/FloatingActionButton.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8 pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/edit-recipe/:id" element={<EditRecipe />} />
            <Route path="/user/:userId" element={<UserPublicProfile />} />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </div>
    </AuthProvider>
  );
}

export default App;
