const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const Image = require("./model/index.js");
const fs = require("fs");
const app = express();
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT;


//database connection

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected "))
  .catch((error) => console.log(`error is ${error}`));

//Set storage engine.

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init upload

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("myImage");

//check file type
function checkFileType(file, cb) {
  // allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  //check ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //check mime

  //   const mimeType = fileTypes.test(file.mimeType);
  if (extName) {
    return cb(null, true);
  } else {
    return cb("Error: Images only!");
  }
}

//Public folder
app.use(express.static("/public"));

//Set Data in local storage

function pushDataInLocalStorage(req, res) {
  const imageData = new Image({
    filename: req.file.filename,
  });
  imageData.save((err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    return res.json({ data });
  });
}

//Routes

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: err });
    } else {
      pushDataInLocalStorage(req, res);
    }
  });
});

app.delete("/delete/:id", async (req, res) => {
  const imageData = await Image.find({ _id: req.params.id });
  if (imageData) {
    fs.unlinkSync(`./public/uploads/${imageData[0].filename}`);
    res.status(200).json({ data: "image deleted" });
  }
});
app.post("/rename", async (req, res) => {
  const { id, filename } = req.body;
  const imageData = await Image.find({ _id: id });
  if (imageData) {
    fs.rename(
      `./public/uploads/${imageData[0].filename}`,
      `./public/uploads/${filename}`,
      (error) => {
        if (error) {
          res.status(400).json({
            error: error,
          });
        }
        res.status(200).json({ response: "File rename successfully!" });
      }
    );
  }
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
