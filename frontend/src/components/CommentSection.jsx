import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useMutation } from "@tanstack/react-query";
import { postComment } from "../utils/api.js";
import { toast } from "react-toastify";
import LoginPromptModal from "./LoginPromptModal.jsx";

function CommentSection({ recipeId, comments }) {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (comment) => postComment(recipeId, comment),
    onSuccess: () => {
      toast.success("Comment posted!", { autoClose: 3000 });
      setContent("");
    },
    onError: (error) => toast.error(error.message, { autoClose: 3000 }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setIsModalOpen(true);
      return;
    }
    if (!content.trim()) {
      toast.error("Comment cannot be empty", { autoClose: 3000 });
      return;
    }
    mutation.mutate({ content });
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments</h3>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows="4"
          placeholder="Write a comment..."
        />
        <button
          type="submit"
          className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Post Comment
        </button>
      </form>
      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800">{comment.content}</p>
            <p className="text-sm text-gray-500 mt-1">
              By {comment.userId.username} on{" "}
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      <LoginPromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default CommentSection;
