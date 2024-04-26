const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const port = 5000;

// connexion à la DB
connectDB();

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Middleware pour logger les requêtes reçues
app.use((req, res, next) => {
  console.log(
    `A ${req.method} request received at ${new Date().toISOString()}`
  );
  next();
});

// Middleware qui permet de traiter les données de la Request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require("cookie-parser")());

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/tree", require("./routes/tree.routes"));
app.use(
  "/peaple",
  require("./controllers/peapleController").verifySession,
  require("./routes/peapleRoutes")
);

// Middleware qui permet de gérer les erreurs
app.use(require("./utils/errorHandler"));

// Lancer le serveur
app.listen(port, "0.0.0.0", () =>
  console.log("Le serveur a démarré au port " + port)
);
