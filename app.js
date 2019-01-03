const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// connect to db
mongoose.connect(
  "mongodb://abc123:abc123@ds145584.mlab.com:45584/vue_stack",
  { useNewUrlParser: true }
);
const db = mongoose.connection;
db.once("open", () => console.log("Connected to MLab")); //check connection
db.on("error", err => console.log(err)); //log error

const app = express();

// bring in models
const Post = require("./models/post");

// load view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set public folder
app.use(express.static(path.join(__dirname, "public")));

// home route
app.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "Posts",
        posts: posts
      });
    }
  });
});

// get single post
app.get("/post/:id", (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    res.render("post", {
      post: post
    });
  });
});
// edit single post
app.get("/post/edit/:id", (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    res.render("edit_post", {
      title: "Edit this post",
      post: post
    });
  });
});
// add route
app.get("/articles/add", (req, res) => {
  res.render("add_article", {
    title: "add article"
  });
});
// add post route
app.get("/posts/add", (req, res) => {
  res.render("add_post", {
    title: "add article"
  });
});

// add submit post
app.post("/posts/add", (req, res) => {
  let post = new Post();
  post.text = req.body.text;
  post.createdAt = req.body.createdAt;

  post.save(err => {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect("/");
    }
  });
});
// update submit post
app.post("/posts/edit/:id", (req, res) => {
  let post = {};
  post.text = req.body.text;
  post.createdAt = req.body.createdAt;

  let query = { _id: req.params.id };

  Post.update(query, post, err => {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect("/");
    }
  });
});

app.delete("/post/:id", (req, res) => {
  let query = {
    _id: req.params.id
  };
  Post.remove(query, err => {
    if (err) {
      console.log(err);
    }
    res.send("Success");
  });
});

app.listen(3000, () => console.log("Server Started on port 3000..."));
