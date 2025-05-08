import axios from "axios";

const api = axios.create({
  baseURL: "https://bitebook-825953726751.us-central1.run.app/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getRecipes = async (search = "") => {
  const response = await api.get(`/recipes?search=${search}`);
  return response.data;
};

export const getRecipe = async (id) => {
  const response = await api.get(`/recipes/${id}`);
  return response.data;
};

export const rateRecipe = async (id, rating) => {
  const response = await api.post(`/recipes/${id}/rate`, { rating });
  return response.data;
};

export const postComment = async (id, comment) => {
  const response = await api.post(`/recipes/${id}/comments`, comment);
  return response.data;
};

export const deleteComment = async (recipeId, commentId) => {
  const response = await api.delete(
    `/recipes/${recipeId}/comments/${commentId}`
  );
  return response.data;
};

export const saveRecipe = async (id) => {
  const response = await api.post(`/recipes/${id}/save`);
  return response.data;
};

export const removeSavedRecipe = async (id) => {
  const response = await api.delete(`/recipes/${id}/save`);
  return response.data;
};

export const getSavedRecipes = async () => {
  const response = await api.get("/recipes/users/saved");
  return response.data;
};

export const addRecipe = async (recipeData) => {
  console.log("Add recipe request payload:", recipeData);
  try {
    const response = await api.post("/recipes", recipeData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";
    console.error("Add recipe error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

export const editRecipe = async (id, recipeData) => {
  console.log("Edit recipe request payload:", { id, ...recipeData });
  try {
    const response = await api.put(`/recipes/${id}`, recipeData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";
    console.error("Edit recipe error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

export const deleteRecipe = async (id) => {
  try {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";
    console.error("Delete recipe error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

export const toggleRecipeVisibility = async (id) => {
  try {
    const response = await api.patch(`/recipes/${id}/visibility`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";
    console.error("Toggle visibility error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

export const updateUser = async (userData) => {
  console.log("Update user request payload:", userData);
  try {
    const response = await api.put("/auth/me", userData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";
    console.error("Update user error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

export const getUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const login = async (credentials) => {
  console.log("Login request payload:", credentials);
  const response = await api.post("/auth/login", credentials);
  localStorage.setItem("token", response.data.token);
  return response.data;
};

export const register = async (userData) => {
  console.log("Register request payload:", userData);
  try {
    const response = await api.post("/auth/register", userData);
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";
    console.error("Register error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: errorMessage,
    });
    throw new Error(errorMessage);
  }
};
