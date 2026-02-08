const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel"); // Mongoose User model
const dotenv = require("dotenv");

dotenv.config();

// -------------------- SIGNUP --------------------
async function signup(req, res) {
  const { username, password, email } = req.body;

  try {
    // Check if username or email already exists
    let existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists!" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, userId: user._id });
  } catch (err) {
    console.error("Error during signup:", err.message);
    res.status(500).send("Server error");
  }
}


// -------------------- LOGIN --------------------
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).send("Server error!");
  }
}

// -------------------- GET ALL USERS --------------------
async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).send("Server error!");
  }
}

// -------------------- GET USER PROFILE --------------------
async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(500).send("Server error!");
  }
}

// -------------------- UPDATE USER PROFILE --------------------
async function updateUserProfile(req, res) {
  const { email, password } = req.body;

  try {
    const updateFields = {};
    if (email) updateFields.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).send("Server error!");
  }
}

// -------------------- DELETE USER PROFILE --------------------
async function deleteUserProfile(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json({ message: "User profile deleted!" });
  } catch (err) {
    console.error("Error deleting profile:", err.message);
    res.status(500).send("Server error!");
  }
}

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
