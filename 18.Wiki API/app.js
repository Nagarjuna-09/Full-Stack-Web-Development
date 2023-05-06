const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

//connect to local mongodb database on your laptop. You can access this via mongoshell (using mongosh command in cmd) or ROBO 3T SW from laptop
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB')
  .then(() => console.log('Connected to ToDo-List Database in Mongo Databases!'));
//OR
//connect to cloud mongo db database in Mongo db Atlas
// mongoose.connect('mongodb+srv://admin-arjun:test123@cluster0.gwu0ml5.mongodb.net/todolistDB')
// .then(() => console.log('Connected to ToDo-List Database in Mongo Databases!'));

const article = new mongoose.model("articles",{
    title: String,
    content: String,
})

app.get('/', function(req, res){
    res.send('Hello World');
});

///////////////////Requests targeting all articles //////////////////
app.route('/articles')
    .get(function (req, res) {
        article.find()
            .then((foundItems) => {
                res.send(foundItems);
            })
            .catch((err) => {
                console.log(err);
            });
    })
    .post(function (req, res) {
        const title = req.body.title;
        const content = req.body.content;
        new_article = new article({
            title: title,
            content: content
        });
        new_article.save()
            .then(() => {
                res.send("successfully added new article");
            })
            .catch((err) => {
                res.send("Error adding new article. Please try again");
            });
    })
    .delete(function (req, res) {
        article.deleteMany().then(() => {
            res.send("successfully deleted all articles");
        })
            .catch((err) => {
                res.send("Could not delete. Please try again");
            });
    });

///////////////////Requests targeting a specific article //////////////////
app.route("/articles/:articleTitle")
    .get(function(req, res) {
        article.findOne({title: req.params.articleTitle})
        .then(foundItems => {
            if(foundItems) {
                res.send(foundItems)
            }
            else{
                res.send("No articles found")
            }
            // res.send(foundItems)
        })
        .catch((err) => {
            res.send("Error fetching articles");
        });
    })
    .put(function(req, res) {
        article.replaceOne({ title: req.params.articleTitle },
            {   
                title: req.body.title,
                content: req.body.content
            })
        .then(()=>{
            res.send("Article replaced successfully");
        })
        .catch((err) => {
            res.send("Error fetching articles");
        });
    })
    .patch(function (req, res) {
        article.updateOne({ title: req.params.articleTitle },
            {
                // title: req.body.title,
                // content: req.body.content
                $set: req.body
            })
        .then(() => {
            res.send("Article updated successfully");
        })
        .catch((err) => {
            res.send("Error fetching articles");
        });
    })
    .delete(function(req, res) {
        article.deleteOne({ title: req.params.articleTitle }).then(() => {
            res.send("successfully deleted article on " + req.params.articleTitle);
        })
            .catch((err) => {
                res.send("Could not delete. Please try again");
            });
    });

app.listen(3000,function(){
    console.log('server started and listening on port 3000');
});