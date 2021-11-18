const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    postId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);