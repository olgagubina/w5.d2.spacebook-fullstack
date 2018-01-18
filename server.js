var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', function() {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var post1 = new Post({text: 'Nice day!', comments: [{text: "Mamamio", user: "Olga"}]});
var post2 = new Post({text: 'Really nice day!', comments: []});


// post1.save();
// post2.save();

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 1)DONE to handle getting all posts and their comments 
app.get('/posts', function(req, res) {
  Post.find(function (error, result){
    if(error) { return console.error(error); }
    res.send(result);
  });
});

// 2) DONE to handle adding a post
app.post('/posts', function(req, res) {
  var newPost = new Post(req.body);
  console.log(newPost);
  newPost.save(function(error, data){
    if(error) throw error; 
  res.send(data);
  });
});

// 3)DONE to handle deleting a post
app.delete('/delete/:postId', function(req, res) {
  var postId = req.params.postId;
  Post.remove({ _id: postId }, function(err) {
    if (err) throw err;

    console.log('Person deleted!');
    res.send();
  });
});

// 4) DONE to handle adding a comment to a post
app.post('/posts/:postId/comments', function(req, res) {
  Post.findById(req.params.postId, function(err, currentPost) {
    if (err) throw err;
    // console.log(currentPost);
    currentPost.comments.push(req.body);
    currentPost.save(function(err,data) {
      if (err) throw err;
      console.log('Comment saved!');
      res.send(data);
    });
  });
});

// 5) to handle deleting a comment from a post
app.delete('/delete/:postId/:commId', function(req, res) {
  var postId = req.params.postId;
  var commId = req.params.commId;
  
  Post.findById({ _id: postId }, function(err, doc) {
    if (err) throw err;
    doc.comments.id(commId).remove();
    doc.save(function(err, data){
      if (err) throw err;
      console.log('Comment deleted!');
      res.send(data);
    });
  });
});



// You will need to create 5 server routes
// These will define your API:


app.listen(8000, function() {
  console.log("what do you want from me! get me on 8000 ;-)");
});
