//Post Route API calle in app.js
const express = require("express");
const router = express.Router();
const { Post } = require("../models"); ///must do it dont forget
const sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const auth = require("../middleware/auth");

cloudinary.config({        //config Cloudinary
  cloud_name: "dcvngfqi6",
  api_key: "626422852674784",
  api_secret: "WamIhm0YTmXTjk1HfVwWQR5mssY",
});

router.post("/:id/create-post", auth, async (req, res) => { // add post
  const userId = req.params.id;
  const file = req.files.image;
  const { title, description, show } = req.body;

  if (!description || !file) {
    return res.json({
      statusCode: 422,
      message: "Image and Description is compulsory ",
    });
  }
  try {
    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      picture = req.files ? result.url : " ";
      const post = await Post.create({
        title,
        description,
        show,
        picture,
        userId,
      });
      return res.status(201).json(post);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/all-post", auth, async (req, res) => {  //get app posts
  try {
    const AllPosts = await Post.findAll({
      include: ["users", "comments", "likes"],
      order: [["createdAt", "DESC"]],
    });
    res.json(AllPosts);
  } catch (error) {
    res.json(error.messgae);
  }
});

router.post("/delete/:id", auth, async (req, res) => {  // delete posts
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const postExist = await Post.findOne({
      where: {
        id,
        userId,
      },
    });
    if (postExist) {
      const post = await Post.destroy({
        where: {
          id,
          userId,
        },
      });

      res.json(post);
    } else {
      return res.json({ statusCode: 422, message: "Data not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
