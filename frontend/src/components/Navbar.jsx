import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { FaUtensils, FaSearch } from "react-icons/fa";

function Navbar({ onVegToggle, isVegOnly, onSearch }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const isHomePage = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearch(term);
    if (isHomePage && onSearch) {
      onSearch(term);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (isHomePage) {
      navigate(`/?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold text-white"
          >
            <FaUtensils className="text-3xl" />
            <span>BiteBook</span>
          </Link>
          {isHomePage && (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isVegOnly}
                onChange={onVegToggle}
                className="sr-only"
              />
              <div
                className={`w-10 h-6 rounded-full transition-colors duration-300 ${
                  isVegOnly ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    isVegOnly ? "translate-x-5" : "translate-x-1"
                  } mt-1 ml-1`}
                />
              </div>
              <span className="ml-2 text-white text-sm font-semibold">
                Veg Only
              </span>
            </label>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {isHomePage && (
            <form
              onSubmit={handleSearchSubmit}
              className="relative hidden md:block"
            >
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search recipes..."
                className="pl-10 pr-4 py-2 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </form>
          )}
          <div className="hidden md:flex space-x-6">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-white hover:text-orange-200 transition-colors duration-300"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-orange-200 transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-orange-200 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:text-orange-200 transition-colors duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-orange-600">
          <div className="flex flex-col space-y-2 px-4 py-2">
            {isHomePage && (
              <form onSubmit={handleSearchSubmit} className="relative mb-2">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search recipes..."
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </form>
            )}
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-orange-200"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-white hover:text-orange-200 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-orange-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-orange-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
