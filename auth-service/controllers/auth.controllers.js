import bcrypt from "bcryptjs";
import generateToken from "../utils/jwt.js";
import User from "../models/user.model.js";


// register user
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, profilePic, bio } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      profilePic: profilePic || "",
      bio: bio || "",
    });

    // Save user to the database
    await user.save();

    const token = generateToken(user._id);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userWithoutPassword = user.toObject();

    delete userWithoutPassword.password; // Remove password from the user object

    res.status(201).json({
      message: "Registration successful",
      user: userWithoutPassword, // Send the user object without the password
    });
  } catch (err) {
    next(err);
  }
};


// Login user
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    // Set the token in a cookie
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Remove password from the user object before sending it in the response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password; // Remove password from the user object

    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (err) {
    next(err);
  }
};

// Logout user
export const logoutUser = async (req, res, next) => {
    try {
        // Clear the cookie
        res.clearCookie("access_token");

        return res.status(200).json({
            message: "User logged out successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
