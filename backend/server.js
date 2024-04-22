const express = require("express");
const cors = require("cors"); // Importer le module CORS
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const port = 5000;

// connexion à la DB
connectDB();

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }));

// Middleware qui permet de traiter les données de la Request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/tree", require("./routes/tree.routes"));

// Lancer le serveur
app.listen(port, () => console.log("Le serveur a démarré au port  " + port));
