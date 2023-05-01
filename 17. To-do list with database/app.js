//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/fruitsDB')
  .then(() => console.log('Connected to MongoDB Database!'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const fruits = new mongoose.model("Fruit", new mongoose.Schema({
  name: String,
  rating: Number,
  review: String
}));


fruits.find()
    .then((fruits) => {
        // mongoose.connection.close();
        // console.log(fruits);
        fruits.forEach(function(fruit){
            items.push(fruit.name);
        })
    })
    .catch((err) => {
        console.log(err);
    });

const items = [];
const workItems = [];

app.get("/", function(req, res) {

const day = date.getDate();

  res.render("list", {listTitle: day, newListItems: items});

});

app.post("/", function(req, res){

  const item = req.body.newItem;
  if (req.body.button === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    const new_task = new fruits({
    name: item,
    rating:1,
    review: "Hello world"
    });
    new_task.save();
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
