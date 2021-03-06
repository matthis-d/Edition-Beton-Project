const express = require("express");
const router = express.Router();
const Formidable = require("formidable");
const bluebird = require("bluebird");
const fileType = require("file-type");
const fs = bluebird.promisifyAll(require("fs"));
const AWS = require("aws-sdk");
const auth = require("../middleware/auth");
const Article = require("../model/Article");

const s3 = new AWS.S3();

const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: "public-read",
    Body: buffer,
    Bucket: process.env.S3_BUCKET,
    ContentType: type.mime,
    Key: name,
  };
  return s3.upload(params).promise();
};

const removeFile = (name) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: name,
  };
  return s3.deleteObject(params).promise();
};

// Returns true or false depending on whether the file is an accepted type
function checkAcceptedExtensions(file) {
  const type = file.type.split("/").pop();
  const accepted = ["jpeg", "jpg", "png", "gif"];
  if (accepted.indexOf(type) == -1) {
    return false;
  }
  return true;
}

/**
 * @method - POST
 * @param - /upload
 * @description - Upload Image
 */

router.post("/upload", async (req, res) => {
  let form = Formidable.IncomingForm();
  form.multiples = true;
  form.maxFileSize = 50 * 1024 * 1024; // 50 MB
  form.parse(req, async (err, fields, files) => {
    const file = files.files;
    if (!checkAcceptedExtensions(file)) {
      console.log("The received file is not a valid type");
      return res.status(400).json({
        message: "The sent file is not a valid type",
      });
    }
    const fileName = encodeURIComponent(file.name.replace(/&. *;+/g, "-"));
    const path = file.path;
    const buffer = fs.readFileSync(path);
    let type;
    try {
      type = await fileType.fromBuffer(buffer);
    } catch (e) {
      console.log(e);
    }
    try {
      await uploadFile(buffer, fileName, type);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Error uploading the file" });
    }

    res.json({
      ok: true,
      message: "File uploaded !",
      files: fileName,
    });
  });
});

/**
 * @method - POST
 * @description - Add article
 * @param - /
 */

router.post("/article", auth, async (req, res) => {
  try {
    const article = new Article({
      url: req.body.url,
      title: req.body.title,
      categories: req.body.categories,
      creationDate: new Date(),
    });

    await article.save();
    const allArticles = await Article.find({});
    res.send(allArticles);
  } catch (e) {
    console.log(e);
    res.send({ message: "Erreur" });
  }
});

/**
 * @method - GET
 * @description - Get all articles
 * @param - /articles
 */

router.get("/articles", async (req, res) => {
  try {
    const allArticles = await Article.find({});
    res.send(allArticles);
  } catch (e) {
    res.send({ message: "Erreur" });
  }
});

/**
 * @method - DELETE
 * @description - Remove an article
 * @param - /article
 */

router.delete("/article", auth, async (req, res) => {
  try {
    await Article.findOneAndRemove(
      {
        _id: req.body._id,
      },
      { useFindAndModify: false }
    );

    await removeFile(req.body.url);

    const allArticles = await Article.find({});
    res.send(allArticles);
  } catch (e) {
    console.log(e);
    res.send({ message: "Erreur" });
  }
});

/**
 * @method - PUT
 * @description - Update an article
 * @param - /article
 */

router.put("/article", auth, async (req, res) => {
  try {
    const article = new Article({
      _id: req.body._id,
      url: req.body.url,
      title: req.body.title,
      categories: req.body.categories,
    });
    await Article.findOneAndUpdate(
      {
        _id: req.body._id,
      },
      article,
      { upsert: true, useFindAndModify: false }
    );
    const allArticles = await Article.find({});
    res.send(allArticles);
  } catch (e) {
    console.log(e);
    res.send({ message: "Erreur" });
  }
});

module.exports = router;
