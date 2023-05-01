//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();
var _ = require('lodash');

app.set('view engine', 'ejs');
mongoose.connect('mongodb://127.0.0.1:27017/todolistDB')
  .then(() => console.log('Connected to ToDo-List Database in Mongo Databases!'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const itemsScema = {
  name: String
}

const item = new mongoose.model("item",itemsScema)

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

const item1 = new item({
  name: "Welcome to your ToDo-List",
});

const item2 = new item({
  name: "Click the + icon to add a new item",
});

const item3 = new item({
  name: "<--- Hit this to delete an item",
});

const item4 = new item({
  name: "Add new items to the list",
});

const defaultItems = [item1,item2,item3];
const defaultItems1 = [item4];
//for every new list that we create that list is going to have a name and an array of item documents
const listSchema = {
  name: String,//list name
  items: [itemsScema]
}

const List = new mongoose.model("List", listSchema)

// item.insertMany(defaultItems);

app.get("/", function(req, res) {
  item.find()
    .then((foundItems) => {
      if(foundItems.length === 0){
        res.render("list", { listTitle: "Today", newListItems: defaultItems });
      }else{
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/:customListName", function (req, res) {
  if (req.params.customListName != "favicon.ico") {
  const customListName = _.capitalize(req.params.customListName);
  
  List.find({ name: customListName }).then((foundItems) => {
    // console.log(foundItems);
    if (foundItems.length === 0) {//if list not found
      //create and save the list to the database
      const new_list = new List({
        name: customListName,
        items: []
      })
      new_list.save();
      res.render("list", { listTitle: customListName, newListItems: defaultItems });
    }
    else {//list with the given name already exists
      if (foundItems[0].items.length === 0) {
        res.render("list", { listTitle: customListName, newListItems: defaultItems1 });
      } else {
        res.render("list", { listTitle: customListName, newListItems: foundItems[0].items });
      }
    }
  })
}
})

app.post("/", function(req, res){
  console.log(req.body);
  const Task = req.body.newItem;
  console.log(_.kebabCase(req.body.button))
  const customListName = req.body.button;
  console.log(customListName);
  if (req.body.button == "Today"){
    const new_task = new item({
      name: Task
    })
    new_task.save();
    res.redirect("/"); 
  }
  else{
    const new_item_in_list = new item({
      name: Task
    });
    List.updateOne({ name: customListName }, { $push: { items: new_item_in_list }})
      .then(result => {
        console.log(result);
        console.log("/" + customListName);
        res.redirect("/" + customListName); 
      }).catch(err => console.log(err));
  } 
});

app.post("/delete", function (req, res) {
  console.log(req.body);
  const checkeditemID = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    item.deleteOne({ _id: checkeditemID }).then(() => {
      res.redirect("/");
    })
  }
  else{
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkeditemID} }})
      .then(result => {
        console.log(result);
        res.redirect('/' + listName);
      }).catch(err => console.log(err));
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});