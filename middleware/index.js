var Stadium = require("../models/stadium");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkStadiumOwnership = function (req,res,next){
  if(req.isAuthenticated()){
      Stadium.findById(req.params.id, function(err, foundStadium){
        if(err){
          req.flash("error", "Stadium not found");
          res.redirect("back");
        }else{
          //owner is who created campground
        if(foundStadium.author.id.equals(req.user._id) || req.user.isAdmin){
          next();
        }else{
          req.flash("error", "permission Necessary to make changes");
          res.redirect("back");
            }
        }
      });
    }else{
      req.flash("error", "Login is necessary to make changes");
      res.redirect("back");
    }
  }

middlewareObj.checkCommentOwnership = function (req,res,next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        res.redirect("back");
      }else{
        //is the owner of comment
      if(foundComment.author.id.equals(req.user._id)){
        next();
      }else{
        req.flash("error", "Permission is necessary to make changes");
        res.redirect("back");
          }
      }
    });
  }else{
    req.flash("error", "Login is necessary to make changes");
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function(req,res,next){
if(req.isAuthenticated()){
  return next();
}
req.flash("error", "Login is necessary to make changes");
res.redirect("/login");
}

module.exports = middlewareObj
