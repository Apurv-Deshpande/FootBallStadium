var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user")

//root route
router.get("/", function(req,res){
  res.render("Landing"); //Landing Page
});

//show registration form
router.get("/register", function(req,res){
  res.render("register", {page: "register"});
});

//Signup form
router.post("/register", function(req,res){
  var newUser = new User({username: req.body.username});
  if(req.body.adminCode == 'secretcode123'){
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req,res, function(){
      req.flash("success", "Welcome to Football Stadiums " + user.username);
      res.redirect("/stadiums");
    });
  })
});


//Login form
router.get("/login", function(req,res){
  res.render("login", {page: 'login'});
});

//handling login logic
router.post("/login", passport.authenticate("local",
{
  successRedirect: "/stadiums",
  failureRedirect: "/login"
}), function(req,res){

});

//logout logic

router.get("/logout", function(req,res){
  req.logout();
  req.flash("success", "Logged you out");
  res.redirect("/stadiums");
});

module.exports =router;
