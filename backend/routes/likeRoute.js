//Post Route API calle in app.js
const express = require("express");
const router = express.Router();
const { Like } = require("../models"); ///must do it dont forget

router.post("/add/:id", async (req, res) => {
  const postId = req.params.id;
  const {userId} = req.body;
  try {
    if(userId)
    {
      const likeExist = await Like.findOne({
        where: { userId, postId },
      }); 
        if(!likeExist)
        {
          const response = await Like.create({  postId, userId });
          return res.json({
            statusCode: 200
          })
        }
        else
        {
          return res.json({ statusCode: 422, message: "Not Possible" });
        }
    } else {
      return res.json({ statusCode: 422, message: "Not Possible" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});


router.post("/remove/:id", async (req, res) => {  // remove like
  const postId = req.params.id;
  const { userId } = req.body;
  try {
    const likeExist = await Like.findOne({
      where: { userId, postId },
    });
    if (likeExist) {
      const response = await Like.destroy({
        where: {
          userId,
          postId
        },
      });
      return res.status(201).json(response);
    } else {
      return res.json({
        statusCode: 422,
        message: "This is  not in liked list",
      });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
