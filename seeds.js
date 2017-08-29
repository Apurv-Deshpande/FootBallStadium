var mongoose = require("mongoose");
var Stadium = require("./models/stadium");
var Comment = require("./models/comment")

var data = [
  {
    name: "Emirates",
    image: "http://c8.alamy.com/comp/FA7HTN/emirates-stadium-arsenal-london-aerial-view-opened-in-july-2006-as-FA7HTN.jpg",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  }
]

function seedDB(){
  Stadium.remove({}, function(err){
 if(err){
    console.log(err);
  }
  console.log("removed stadiums");
  });
  //add new camgrounds
    data.forEach(function(seed){
    Stadium.create(seed, function(err, stadium){
      if(err){
        console.log(err);
      }else{
        console.log("added a stadium");
        //create a comment
        Comment.create(
          {
          text: "This Place is great, but no Internet",
          author: "Homer"
        }, function(err, comment){
          if(err){
            console.log(err);
          } else{
            stadium.comments.push(comment);
            stadium.save();
            console.log("Created New Comment");
          }

        })
      }
    });
  });
};

module.exports = seedDB;
