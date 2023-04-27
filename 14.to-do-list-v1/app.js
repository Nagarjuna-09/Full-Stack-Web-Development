const express = require('express');
const bodyParser = require('body-parser');
const calender = require(__dirname+ '/calender.js');
const item=["Buy Food", "Cook Food", "Eat Food"];
const workItems = ["complete project"];
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render("list", { listTitle: calender.getDate(), list_array: item });
});

app.post('/', (req, res) => {
    console.log(req.body);
    const new_item = req.body.new_item;
    if (req.body.button === "Work"){
        workItems.push(new_item);
        res.redirect("/work");
    }
    else{
        item.push(new_item);
        res.redirect("/");
    }
});

app.get('/work', (req, res) => {
    res.render("list", { listTitle: "Work List", list_array: workItems });
});

app.get('/about', (req, res) => {
    res.render("about");
});

app.post('/work', (req, res) => {
    const new_work_item = req.body.new_item;
    workItems.push(new_work_item);
    console.log(workItems);
    res.redirect("/work");
});

app.listen(3000,function(){
    console.log('server started and listening on port 3000');
});