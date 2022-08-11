//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/PostDB");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "This website records everyday dairy for you. Click on the Compose to get started. Happy Writing.";
const contactContent = "Contact us on yourpersonaldiary@yahoo.com.";

const app = express();
app.locals._ = _;

const postSchema = {
  title: String,
  content: String
}

const Post = mongoose.model("Post", postSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Post.find({}, function (err, foundPosts) {
    res.render("home", { allposts: foundPosts });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { paragraph: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { paragraph: contactContent });
  //res.send("contact.ejs");
});

app.get("/compose", function (req, res) {
  res.render("compose");
});


app.get("/post/:postID", function (req, res) {
  const requestedpostid = req.params.postID;
  Post.findOne({ _id: requestedpostid }, function (err, found) {
    res.render("post", { title: found.title, content: found.content });
  });
});


app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });

});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});