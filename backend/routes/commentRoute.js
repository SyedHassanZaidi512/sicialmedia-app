const express = require("express");
const router = express.Router();
const { Comment, Post } = require("../models"); ///must do it dont forget

router.post("/add/:id", async (req, res) => {
  const postId = req.params.id;
  const body = req.body;
  const userId = body.userId;
  const text = body.text;
  try {
    if (text) {
      const response = await Comment.create({ text, postId, userId });
      return res.json({
        statusCode: 200,
      });
    } else {
      return res.json({ statusCode: 422, message: "Please write something" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});



router.post("/delete/:id", async (req, res) => {  //delete comment

  const commentId = req.params.id;
  const { userId } = req.body;
  try {
    const userExist = await Comment.findOne({
      where: { userId, id: commentId },
    });
    if (userExist) {
      const response = await Comment.destroy({
        where: {
          userId,
          id: commentId,
        },
      });
      return res.status(201).json(response);
    } else {
      return res.json({
        statusCode: 422,
        message: "already deleted",
      });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
