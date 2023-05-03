//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require('mongoose');
// const posts = [];
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

// mongoose.connect('mongodb://127.0.0.1:27017/blog')
//   .then(() => console.log('Connected!'));

mongoose.connect('mongodb+srv://admin-arjun:test123@cluster0.gwu0ml5.mongodb.net/blogDB')
  .then(() => console.log('Connected to cloud blog Database in Mongo Databases!'));


const post = new mongoose.model("Post", {
  title: String,
  content: String
})

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', (req, res) => {
  post.find().then((foundItems) =>{
    res.render('home', { starting_content: homeStartingContent, posts: foundItems });
  }).catch((err) => {
    console.log(err);
  });
});

app.get('/about', (req,res)=>{
  res.render('about', { about_content: aboutContent});
});

app.get('/contact', (req,res) =>{
  res.render('contact', { contact_content:contactContent});
});


app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', (req, res) => {
  const new_blog_post = new post({
    title: req.body.postTitle,
    content: req.body.postBody,
  })
  // posts.push(post);
  new_blog_post.save();
  res.redirect('/');
});


//getting posts by post name
app.get('/posts/:postName', (req, res) =>{
  post.find().then((foundItems) =>{
    foundItems.forEach(function (post) {
      if (_.lowerCase(post.title) === _.lowerCase(req.params.postName)) {
        res.render('post', { title: post.title, content: post.content });
      }
    }
    )
  })
});

//getting posts by post id
// app.get('/posts/:postID', (req, res) => {
//   console.log(req.params.postID);
//   post.find({ _id: req.params.postID }).then((foundItems) => {
//       console.log(foundItems);
//       res.render('post', { title: foundItems[0].title, content: foundItems[0].content });
//     })
// });


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
