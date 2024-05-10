const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Construire le chemin absolu vers le dossier uploads dans le dossier parent de config
const dir = path.join(__dirname, "..", "uploads");

// Vérifier si le dossier existe, sinon le créer
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const deleteFile = (dir) => {
  try {
    fs.unlinkSync(dir);
    console.log("File deleted!");
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("File does not exist: ", dir);
      return false;
    } else {
      console.error("Error deleting file: ", error);
      return false;
    }
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    if (!req.userId) {
      cb(new Error("User not authenticated!"), null);
    } else {
      cb(null, req.userId);
    }
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload only images."), false);
    }
  },
});

module.exports = { upload, dir, deleteFile };
