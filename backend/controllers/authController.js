const User = require("../models/User");
const { hashPassowrd, comparePassword } = require("../utils/passwordUtils");
const { tokenExpiry } = require("../config/config");
const jwt = require("jsonwebtoken");

const test = (req, res) => {
  res.json("Le test d'authentification fonctionne");
};

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("L'adresse e-mail est requise");
    }
    if (!password) {
      res.status(400);
      throw new Error("Le mot de passe est requis");
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(409).json({
        error: "L'adresse e-mail est déjà utilisée",
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
      throw new Error("L'adresse e-mail est requise");
    }
    if (!password) {
      res.status(400);
      throw new Error("Le mot de passe est requis");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404);
      throw new Error("Utilisateur introuvable");
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
            throw new Error(
              "Erreur lors de la génération du jeton, veuillez réessayer ultérieurement"
            );
          }
          return res.cookie("token", token).json({ token, userId: user._id });
        }
      );
    } else {
      res.status(401);
      throw new Error("Adresse e-mail ou mot de passe invalide");
    }
  } catch (err) {
    next(err);
  }
};

const logoutUser = (req, res, next) => {
  try {
    res.clearCookie("token").json("Utilisateur déconnecté avec succès");
  } catch (err) {
    console.error("logout: ", err);
    err.message = "Erreur du serveur, veuillez réessayer ultérieurement";
    next(err);
  }
};

module.exports = {
  test,
  registerUser,
  loginUser,
  logoutUser,
};
