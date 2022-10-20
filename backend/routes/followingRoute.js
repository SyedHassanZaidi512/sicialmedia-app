//Post Route API calle in app.js
const express = require("express");
const router = express.Router();
const { Following } = require("../models"); ///must do it dont forget
//userId= Id of the person who follow
//followingId is  id of the person  is being followed by userId'user

router.post("/:id", async (req, res) => {  //add followings
  const userId = req.params.id;
  const { followingId } = req.body;
  try {
    const userExist = await Following.findOne({
      where: { followingId, userId },
    });
    if (!userExist) {
      const post = await Following.create({ followingId, userId });
      return res.status(201).json(post);
    } else {
      return res.json({ statusCode: 422, message: "Already following" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});



router.post("/unfollow/:id", async (req, res) => {   //delete from following
  const userId = req.params.id;
  const { followingId } = req.body;
  try {
    const userExist = await Following.findOne({
      where: { followingId, userId },
    });
    if (userExist) {
      const post = await Following.destroy({
        where: {
          userId,
          followingId,
        },
      });
      return res.status(201).json(post);
    } else {
      return res.json({
        statusCode: 422,
        message: "This is  not in following list",
      });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
