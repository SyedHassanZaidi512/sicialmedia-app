//Post Route API calle in app.js
const express = require("express");
const router = express.Router();
const { Follower } = require("../models"); ///must do it dont forget
router.post("/:id", async (req, res) => {
  const userId = req.params.id;
  const { followerId } = req.body;
  try {
    const userExist = await Follower.findOne({
      where: {
        followerId,
        userId,
      },
    });

    if (!userExist) {
      const post = await Follower.create({
        followerId,
        userId,
      });

      return res.status(201).json(post);
    } else {
      return res.json({
        statusCode: 422,
        message: "This is  not in follower list",
      });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/unfollow/:id", async (req, res) => {  //delete  from follower

  const userId = req.params.id;
  const { followerId } = req.body;
  try {
    const userExist = await Follower.findOne({ where: { followerId, userId } });
    if (userExist) {
      const post = await Follower.destroy({
        where: { userId, followerId },
      });
      return res.status(201).json(post);
    } else {
      return res.json({
        statusCode: 422,
        message: "This is  not in follower list",
      });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
