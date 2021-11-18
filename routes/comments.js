const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

//create a comment

router.post("/", async (req, res) => {
  const newComment = new Comment(req.body);
  const currentPost = Post.findById(req.body.postId);
  try {
    const savedComment = await newComment.save();
    const updatedPost = await currentPost.updateOne({ $push: { comments: savedComment.id } })
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post

router.put("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.userId === req.body.userId) {
      await comment.updateOne({ $set: req.body });
      res.status(200).json("the comment has been updated");
    } else {
      res.status(403).json("you can update only your comment");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete a post
//need to remove the commentId from the post

router.delete("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const post = await Post.findById(comment.postId);
    if (comment.userId === req.body.userId) {
      await post.updateOne({$pull: {comments: comment.id} });
      await comment.deleteOne();
      res.status(200).json("the comment has been deleted");
    } else {
      res.status(403).json("you can delete only your comment");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like / dislike a comment

router.put("/:id/like", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment.likes.includes(req.body.userId)) {
      await comment.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The comment has been liked");
    } else {
      await comment.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The comment has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//get a post

router.get("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all comments

router.get("/all/:postId", async (req, res) => {
  try {
    // const currentUser = await User.findById(req.params.userId);
    const currentPost = await Post.findById(req.params.postId);
    const  postComments = await Promise.all(
      currentPost.comments.map((commentId) => {
        return Comment.find({ commentId: commentId });
      })
    );
    res.status(200).json(postComments);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;