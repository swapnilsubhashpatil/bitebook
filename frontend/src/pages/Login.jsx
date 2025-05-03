import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../utils/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data.user);
      toast.success("Logged in successfully!");
      navigate("/");
    },
    onError: () => toast.error("Invalid credentials"),
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
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
            {...register("password", { required: "Password is required" })}
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
          Login
        </button>
      </form>
      <p className="mt-4 text-gray-600">
        Don't have an account?{" "}
        <a href="/register" className="text-orange-500">
          Register
        </a>
      </p>
    </div>
  );
}

export default Login;
