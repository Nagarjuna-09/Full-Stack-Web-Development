// incorporating or importing express into our file
const express = require('express');
const app = express();

app.listen(3000, function () {
    console.log('Server started and listening to port 3000....');
});

// we tell what should happen when a browser gets in touch with the server and makes a get request in the function(req,res)
// '/' means home page request i.e request made by homepage
// req - made by server by sonsole.log(req) you can see what is the request made by browser
app.get("/", function (req, res) {
    res.send("<h1>Hello World</h1>");
});

//request from contact page
app.get("/contact", function (req, res) {
    res.send("<h4>nagarjunanathani434@gmail.com</h4>");
});

//about page shows who owns this website
app.get("/about", function (req, res) {
    res.send("<h4>This site belongs to Nagarjuna Nathani. I lovvvve coding and travelling. <h4>");
});
