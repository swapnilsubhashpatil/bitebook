import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({
          message: "All fields (username, email, password) are required",
        });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      user: { _id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Register error:", {
      message: error.message,
      stack: error.stack,
      body: req.body,
    });
    res.status(400).json({ message: error.message || "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.json({
        user: { _id: user._id, username: user.username, email: user.email },
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", {
      message: error.message,
      stack: error.stack,
      body: req.body,
    });
    res.status(400).json({ message: error.message || "Login failed" });
  }
};

export const updateUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) {
      if (username.length < 3) {
        return res
          .status(400)
          .json({ message: "Username must be at least 3 characters" });
      }
      const usernameExists = await User.findOne({
        username,
        _id: { $ne: user._id },
      });
      if (usernameExists) {
        return res.status(400).json({ message: "Username is already taken" });
      }
      user.username = username;
    }

    if (email) {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) {
        return res.status(400).json({ message: "Email is already taken" });
      }
      user.email = email;
    }

    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }
      user.password = password;
    }

    await user.save();
    res.json({ _id: user._id, username: user.username, email: user.email });
  } catch (error) {
    console.error("Update user error:", {
      message: error.message,
      stack: error.stack,
      body: req.body,
    });
    res.status(400).json({ message: error.message || "Failed to update user" });
  }
};

export const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
};

export const logoutUser = async (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
};
