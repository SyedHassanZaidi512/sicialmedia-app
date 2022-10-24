const express = require("express");
const router = express.Router();
const { User } = require("../models"); ///must do it dont forget
const sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt")
const path = require("path");
const auth = require("../middleware/auth");


const cloudinary = require("cloudinary").v2;  //Cloudinary
const { constants } = require("buffer");
const { connected } = require("process");
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
    return res.json({
       statusCode: 422,
       message: "Please Enter All Fields"
       });
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
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, function(err, hash) {
          const file = req.files ? req.files.image : " ";
          cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
            picture = req.files ? result.url : " ";
            const user = await User.create({ name, email, password:hash, picture });
            const token = jwt.sign({ id: user.id }, "ytrujm");
            res.json({ token, user: user });
            return res.status(201).json(user);
          });
      });
      })
    
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
      where: { email }
    });
    if(userExist)
    {
       bcrypt.compare(password, userExist.password, function(err, result) {
         if (result) 
         {
             console.log(userExist.id,"id")
             const token = jwt.sign({ id: userExist.id }, "ytrujm");
             res.json({ token, user: userExist });
         } else {
           return res.json({ 
             statusCode: 402,
             message: "password does no mathed"
           });
        }
      });
    
    } else {
      return res.json({ 
        statusCode: 401,
        message: "email does no matched"
      });
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
  const { oldPassword } = req.body;
  console.log(newPassword,oldPassword);
  const userExist= await User.findOne({
    where: { id }
  });
  if (!newPassword) {
    return res.json({ statusCode: 422, message: "Please add new-password" });
  } else {
    try {
      console.log("compare")
      bcrypt.compare(oldPassword, userExist.password, function(err, result) {
        if (result) 
        { 
          console.log("matched")
          bcrypt.genSalt(10, (err, salt) => {
            console.log("run")
            bcrypt.hash(newPassword, salt, async function (err, hash) {
              console.log("adding")
              const user = await User.update(
                { password: hash },
                { where:  {id} }
              );
              console.log(user,"response");
              if(user)
              {
                return res.json({ statusCode: 201, message: "password changed successfully" })
              }
          });
          })
    
        } else {
          return res.json({ 
            statusCode: 422,
            message: "password does not matched"
          });
       }
     });
    

   
    } catch (error) {
      return res.status(500).json(error);
    }
  }
});

module.exports = router;
