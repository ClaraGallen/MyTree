const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const https = require("https");
const fs = require("fs");

// connexion à la DB
connectDB();

const app = express();

// Middleware pour logger les requêtes reçues
app.use((req, res, next) => {
  console.log(
    `A ${req.method} request received at ${new Date().toISOString()}`
  );
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, true);
    },
    credentials: true,
  })
);

// Middleware qui permet de traiter les données de la Request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require("cookie-parser")());

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use(
  "/people",
  require("./controllers/peopleController").verifySession,
  require("./routes/peopleRoutes")
);

// Middleware qui permet de gérer les erreurs
app.use(require("./utils/errorHandler"));

const sslOptions = {
  key: fs.readFileSync("./certif/server.key"),
  cert: fs.readFileSync("./certif/server.crt"),
};

const port = 443;

https.createServer(sslOptions, app).listen(port, () => {
  console.log("HTTPS server running on port " + port);
});

// Lancer le serveur
// app.listen(port, "0.0.0.0", () =>
//   console.log("Le serveur a démarré au port " + port)
// );
