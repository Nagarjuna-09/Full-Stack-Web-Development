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
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')

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
    password: String,
    googleId: String,
    secrets: String
});

//4 setup user schema to use passport local mongoose as a plugin -----
userSchema.plugin(passportLocalMongoose);
//4 end

userSchema.plugin(findOrCreate);

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const users = new mongoose.model("user", userSchema);

//5 used passport local mongoose to create a local login strategy, and setup passport to serialize and deserialize our users
passport.use(users.createStrategy());
// passport.serializeUser(users.serializeUser());
// passport.deserializeUser(users.deserializeUser());

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {
            id: user.id,
            // username: user.username,
        });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});
//5 end -----------

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    function (accessToken, refreshToken, profile, cb) {
        // console.log(profile);
        users.findOrCreate({ username: profile.displayName, googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

app.get('/', function(req, res){
    res.render('home');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/auth/google',
passport.authenticate('google', { scope: ['profile'] })
);

app.get('/register', function (req, res) {
    res.render('register');
});

app.get('/auth/google/secrets',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/secrets');
    });

//using isAuthenticated from passport
app.get('/secrets', function (req, res) {
    users.find({"secrets": {$ne:null}}).then(function (foundusers) {
        if (foundusers){
            res.render('secrets', { usersWithSecrets: foundusers });
        }
        else{
            res.send('No secrets found')
        }
    });
});


//using passport
app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
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

app.get('/submit', function(req,res){
    if (req.isAuthenticated()) {
        res.render('submit');
    }
    else {
        res.redirect('/login');
    }
});

app.post('/submit', function (req, res) {
    const submittedSecret = req.body.secret;
    console.log(req.user);
    // res.render('submit');
    users.findById(req.user.id).then(function (foundUser){
        if(foundUser){
            foundUser.secrets = submittedSecret;
            foundUser.save().then(function(){
                res.redirect('/secrets');
            })
        }
    })
})

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