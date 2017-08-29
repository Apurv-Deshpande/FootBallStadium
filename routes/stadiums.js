var express = require("express");
var router = express.Router();
var Stadium = require("../models/stadium");
var middleware = require("../middleware");
var geocoder = require('geocoder');


//index route showing all campgrounds
router.get("/", function(req,res){// get method
  var noMatch = null;
if(req.query.search){
  const regex = new RegExp(escapeRegex(req.query.search), 'gi');
  Stadium.find({name: regex},function(err, allStadiums){
    if(err){
      console.log(err);
    }else{
      if(allStadiums.length < 1){
        noMatch = "No Stadium found. Please Create a New One";
      }
      res.render("stadiums/index", {stadiums:allStadiums, currentUser:req.user, noMatch:noMatch, page:'stadiums'});
    }
  });
}
//Getting all camgrounds from db
else{
Stadium.find({},function(err, allStadiums){
  if(err){
    console.log(err);
  }else{
    res.render("stadiums/index", {stadiums:allStadiums, currentUser:req.user, noMatch:noMatch, page:'stadiums'});
  }
})
}
});

router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var cost = req.body.cost;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newStadium = {name: name, image: image, description: desc, author:author, cost:cost, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Stadium.create(newStadium, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/stadiums");
        }
    });
  });
});

//NEW Route- show form to create new campgrounds
router.get("/new", middleware.isLoggedIn, function(req,res){
res.render("stadiums/new");//New Page
});

//SHOW Route more information about single campground
router.get("/:id", function(req,res){
  //find the Campground with Provided ID
  Stadium.findById(req.params.id).populate("comments").exec(function(err, foundStadium){
    if(err){
      console.log(err)
    }
    else{
      console.log(foundStadium);
      //find Campground by id
      Stadium.findById(req.params.id, function(err, stadium){
        if(err){
          console.log(err);
        }else{
          res.render("stadiums/show", {stadium: foundStadium}); //render to show template
        }
      })
    }
  });

});

//EDIT Campground Route
router.get("/:id/edit", middleware.checkStadiumOwnership, function(req,res){
Stadium.findById(req.params.id, function(err, foundStadium){
      res.render("stadiums/edit", {stadium: foundStadium});
      });
  });


router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost:req.body.cost, location: location, lat: lat, lng: lng};
    Stadium.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, stadium){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/stadiums/" + stadium._id);
        }
    });
  });
});

//DESTROY Campground Route
router.delete("/:id", middleware.checkStadiumOwnership, function(req,res){
  Stadium.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/stadiums");
    } else{
      res.redirect("/stadiums");
    }
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports = router;
