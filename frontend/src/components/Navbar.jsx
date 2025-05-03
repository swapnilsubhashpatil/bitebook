import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { FaUtensils } from "react-icons/fa";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-2 text-2xl font-bold text-orange-500"
        >
          <FaUtensils />
          <span>BiteBook</span>
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-orange-500">
            Home
          </Link>
          {user ? (
            <>
              <Link
                to="/add-recipe"
                className="text-gray-700 hover:text-orange-500"
              >
                Add Recipe
              </Link>
              <Link
                to="/my-recipes"
                className="text-gray-700 hover:text-orange-500"
              >
                My Saved Recipes
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 hover:text-orange-500"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-orange-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-orange-500">
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-orange-500"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
