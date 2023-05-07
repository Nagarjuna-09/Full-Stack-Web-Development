require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
//var encrypt = require('mongoose-encryption');
//var md5 = require('md5');
// const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
//1 required 3 packages
const passport = require('passport');
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');
//1 end
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

//2 setup sessions ---------------
app.use(session({
    secret: 'Our little secret',
    resave: false,
    saveUninitialized: false,
}))
//2 end

//3 initialised passport and used passport to manage our sessions ------------
app.use(passport.initialize());
app.use(passport.session());
//3 end ------------
// const saltRounds = 12;

//connect to local mongodb database on your laptop. You can access this via mongoshell (using mongosh command in cmd) or ROBO 3T SW from laptop
mongoose.connect('mongodb://127.0.0.1:27017/userDB')
  .then(() => console.log('Connected to users Database in Mongo Databases!'));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//4 setup user schema to use passport local mongoose as a plugin -----
userSchema.plugin(passportLocalMongoose);
//4 end

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const users = new mongoose.model("user", userSchema);

//5 used passport local mongoose to create a local login strategy, and setup passport to serialize and deserialize our users
passport.use(users.createStrategy());
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());
//5 end -----------

app.get('/', function(req, res){
    res.render('home');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/register', function (req, res) {
    res.render('register');
});

//using isAuthenticated from passport
app.get('/secrets', function (req, res) {
    if(req.isAuthenticated()){
        res.render('secrets');
    }
    else{
        res.redirect('/login');
    }
});

//using passport
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

//using passport
//below code also works. uses the username, password coming from body and compares with passports username and password
app.post("/login", passport.authenticate('local', {
    successRedirect: "/secrets",
    failureRedirect: "/login",
}))


//passport does not have register so we are using the passport local mongoose module 
//from npm to save new user/document into mongo db using mongoose
app.post('/register', function (req, res) {
    //we are going to use passport local mongoose package here to do this

    //registering the new user using passport local mongoose (saving to database)
    users.register({ username: req.body.username}, req.body.password, function (err, user) {
        if (err) { 
            console.log(err);
            res.redirect('/register');
         }
         else{
            //after saving to database, authenticating the user using passport
            passport.authenticate('local')(req,res,function(){
                res.redirect('/secrets');
                })
            }
         });
});

//This too works but slighty lengthy
// app.post('/login', function (req,res) {
//     const user = new users({
//         username: req.body.username,
//         password: req.body.password
//     })
//     req.login(user, function (err) {
//         if (err) { 
//             console.log(err); 
//         }
//         else{
//             passport.authenticate('local')(req, res, function () {
//                 res.redirect('/secrets');
//             })
//         }
        
//     });
// });



app.listen(3000,function(){
    console.log('server started and listening on port 3000');
});