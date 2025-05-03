import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register as registerUser } from "../utils/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

function Register() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setUser(data.user);
      toast.success("Registered successfully!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data) => {
    console.log("Form data submitted:", data);
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
            })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-orange-500">
          Login
        </a>
      </p>
    </div>
  );
}

export default Register;
