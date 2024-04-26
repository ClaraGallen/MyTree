const User = require("../models/User");
const { hashPassowrd, comparePassword } = require("../utils/passwordUtils");
const { tokenExpiry } = require("../config/config");
const jwt = require("jsonwebtoken");

const test = (req, res) => {
  res.json("auth test is working");
};

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("Email is required");
    }
    if (!password) {
      res.status(400);
      throw new Error("Password is required");
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(409).json({
        error: "Email is taken already",
      });
    }

    const passwordHash = await hashPassowrd(password);

    const user = await User.create({
      email,
      passwordHash,
    });
    return res.status(201).json({
      message: "Utilisateur enregistré avec succès",
      userId: user._id,
    });
  } catch (err) {
    next(err);
  }
};
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("Email is required");
    }
    if (!password) {
      res.status(400);
      throw new Error("Password is required");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const hashed = user.passwordHash;
    const match = await comparePassword(password, hashed);
    if (match) {
      return jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: tokenExpiry },
        (err, token) => {
          if (err) {
            console.error(err);
            throw new Error("Error signing token, Please try again later");
          }
          return res.cookie("token", token).json({ token, userId: user._id });
        }
      );
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  test,
  registerUser,
  loginUser,
};
