const mongoose = require("mongoose");

let postSchema = mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  }
});

let Post = (module.exports = mongoose.model("Post", postSchema));
