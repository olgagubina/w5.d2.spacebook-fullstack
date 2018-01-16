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

app.get('/posts', function(req, res) {
  Post.find(function (error, result){
    if(error) { return console.error(error); }
    res.send(result);
  });
});

app.post('/posts', function(req, res) {
    var newPost = new Post(req.body);
    console.log(newPost);
    newPost.save(function(error, data){
      if(error) { return console.error(error); }
    res.send(data);
    });
});

app.delete('/delete/:postId', function(req, res) {
  var postId = req.params.postId;
  Post.remove({ _id: postId }, function(err) {
    if (err) throw err;

    console.log('Person deleted!');
    res.send();
  });
});


// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments DONE
// 2) to handle adding a post
// 3) to handle deleting a post
// 4) to handle adding a comment to a post
// 5) to handle deleting a comment from a post

app.listen(8010, function() {
  console.log("what do you want from me! get me on 8000 ;-)");
});
