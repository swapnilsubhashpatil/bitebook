import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPromptModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Login Required</h2>
        <p className="text-gray-600 mb-6">
          Please log in to perform this action.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPromptModal;
