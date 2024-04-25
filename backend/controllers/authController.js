const User = require("../models/User");
const { hashPassowrd, comparePassword } = require("../utils/passwordUtils");

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

module.exports = {
  test,
  registerUser,
};
