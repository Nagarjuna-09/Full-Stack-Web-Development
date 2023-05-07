require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();
var encrypt = require('mongoose-encryption');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

//connect to local mongodb database on your laptop. You can access this via mongoshell (using mongosh command in cmd) or ROBO 3T SW from laptop
mongoose.connect('mongodb://127.0.0.1:27017/userDB')
  .then(() => console.log('Connected to users Database in Mongo Databases!'));
//OR
//connect to cloud mongo db database in Mongo db Atlas
// mongoose.connect('mongodb+srv://admin-arjun:test123@cluster0.gwu0ml5.mongodb.net/todolistDB')
// .then(() => console.log('Connected to ToDo-List Database in Mongo Databases!'));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });


const users = new mongoose.model("user", userSchema);

app.get('/', function(req, res){
    res.render('home');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', function (req, res) {
    const new_user = new users({
        email: req.body.username,
        password: req.body.password
    });
    new_user.save().then(()=>{
        res.render('secrets');
    }).catch((err) => {
        console.log(err);
    }); 
});

app.post('/login', function (req,res) {
    users.findOne({email: req.body.username}).then((founduser)=>{
        if (founduser){
            if (founduser.password === req.body.password) {
                res.render('secrets');
            }
            else{
                res.send('Incorrect Password');
            }
        }
        else{
            res.send('User not found. Please register or login with correct username');
        }
    }).catch((err) => {
        console.log(err);
    });
});

app.listen(3000,function(){
    console.log('server started and listening on port 3000');
});