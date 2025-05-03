import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

function FloatingActionButton() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <Link to="/add-recipe">
      <motion.div
        className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaPlus className="text-2xl" />
      </motion.div>
    </Link>
  );
}

export default FloatingActionButton;
