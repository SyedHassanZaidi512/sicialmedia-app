const express = require("express");
const router = express.Router();
const { User } = require("../models"); ///must do it dont forget
const sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const path = require("path");
const auth = require("../middleware/auth");


const cloudinary = require("cloudinary").v2;  //Cloudinary
const { constants } = require("buffer");
cloudinary.config({
  cloud_name: "dcvngfqi6",
  api_key: "626422852674784",
  api_secret: "WamIhm0YTmXTjk1HfVwWQR5mssY",
});

router.post("/sign-up", async (req, res) => {  //Add user  /Sign Up
  var picture = " ";
  const { name, email, password } = req.body;
  const emailRefgex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!name || !email || !password) {
    return res.json({ statusCode: 422, message: "Please Enter All Fields" });
  }
  if (!emailRefgex.test(email)) {
    return res.json({ statusCode: 422, message: "invalid Email" });
  }
  try {
    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      return res.json({
        statusCode: 422,
        message: "This Email Already Exists",
      });
    } else {
      const file = req.files ? req.files.image : " ";
      cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
        picture = req.files ? result.url : " ";
        const user = await User.create({ name, email, password, picture });
        const token = jwt.sign({ id: user.id }, "ytrujm");
        res.json({ token, user: user });
        return res.status(201).json(user);
      });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});


router.post("/sign-in", async (req, res) => {    // sign in

  const { email, password } = req.body;
  const emailRefgex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !password) {
    return res.json({
      statusCode: 400,
      message: "Please add email and password",
    });
  }
  if (!emailRefgex.test(email)) {
    return res.json({ 
        statusCode: 400,
        message: "invalid Email" 
      });
  }
  try {
    const userExist = await User.findOne({ 
      where: {
        [Op.or]:[{email},{password}]
      }
    });
    if (!userExist) {
      return res.json({ 
        statusCode: 401,
        message: "email does no mathed"
      });
    } else if (userExist.dataValues.password!==password) {
      return res.json({ statusCode: 402, message: "wrong Password" });
    } else {
      const userExist = await User.findOne({ where: { email, password } });
      if (userExist) {
        const token = jwt.sign({ id: userExist.id }, "ytrujm");
        res.json({ token, user: userExist });
      } else if (!userExist) {
        return res.json({
          statusCode: 422,
          message: "mismatched email and password",
        });
      }
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/", auth, async (req, res) => {  //get User
  const AllUsers = await User.findAll({
    include: ["posts", "likes", "followers", "followings", "comments"],
    order: [["createdAt", "ASC"]],
  });

  return res.json(AllUsers);
});

router.get("/getUser/:id", auth, async (req, res) => { //getspecific User
  const id = req.params.id;
  try {
    const user = await User.findOne({
      include: ["posts", "likes", "comments", "followings", "followers"],
      where: { id },
    });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});



router.put("/editPic/:id", auth, async (req, res) => {/////edit picture
  var picture = " ";
  const id = req.params.id;
  try {
    const file = req.files.image;
      cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      picture = req.files ? result.url : " ";
      const user = await User.update({ picture }, { where: { id } });
      return res.status(201).json(user);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.put("/editPassword/:id", auth, async (req, res) => {  //edit password
  const id = req.params.id; 
  const { newPassword } = req.body;
  if (!newPassword) {
    return res.json({ statusCode: 400, message: "Please add new-password" });
  } else {
    try {
      const user = await User.update(
        { password: newPassword },
        { where: { id } }
      );
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
});

module.exports = router;
