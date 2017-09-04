var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),

    //model files
    Stadium=require("./models/stadium"),
    Comment = require("./models/comment"),
    User = require("./models/user");

    seedDB =require("./seeds"); //seed the database


    //routes redirect requirings
    var commentRoutes = require('./routes/comments'),
        stadiumRoutes = require('./routes/stadiums'),
        indexRoutes = require('./routes/index');



mongoose.connect("mongodb://apurv:football@ds121494.mlab.com:21494/football_stadium", {useMongoClient: true});//mongoose connection
app.use(bodyParser.urlencoded({extended: true}));

//view engine set
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

app.locals.moment = require('moment');
//Passport Configuration
app.use(require("express-session")({
  secret: "Node JS",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use("/stadiums", stadiumRoutes);
app.use("/stadiums/:id/comments", commentRoutes);

//App running on server
var port = process.env.PORT || 3030;
app.listen(port);
console.log('Listening on port ' + port + '...');
