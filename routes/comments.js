var express = require("express");
var router = express.Router({mergeParams: true});
var Stadium = require("../models/stadium");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//comments new route
router.get("/new", middleware.isLoggedIn, function(req,res){
//find Campground by ID
  Stadium.findById(req.params.id, function(err, stadium){
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {stadium: stadium});
    }
  });

//Comments post route
router.post("/",middleware.isLoggedIn, function(req,res){
  Stadium.findById(req.params.id, function(err, stadium){
    if(err){
      console.log(err);
      res.redirect("/stadiums");
    } else{
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash("error", "Something went wrong");
          console.log(err);
        } else{
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          stadium.comments.push(comment);
          stadium.save();
          console.log(comment);
          req.flash("success", "Successfully added Comment");
          res.redirect('/stadiums/' + stadium._id);
        }
      });
    }


  });
});
});

//Comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
  Comment.findById(req.params.comment_id,function(err, foundComment){
    if(err){
      res.redirect("back");
    } else{
    res.render("comments/edit", {stadium_id: req.params.id, comment: foundComment});
    }
  });

});

//Comment Update Router

router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){

  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect("back");
    } else{
      res.redirect("/stadiums/" + req.params.id);
    }
  });
});

//Comment Destroy routes
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    } else{
      req.flash("success", "Comment Deleted");
      res.redirect("/stadiums/" + req.params.id);
    }
  })
});
module.exports = router;
