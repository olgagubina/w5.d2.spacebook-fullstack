var mongoose = require('mongoose');

//design the two schema below and use sub docs 
//to define the relationship between posts and comments


var commentSchema = new mongoose.Schema({
    text: String,
    user: String
}, { usePushEach: true });


var postSchema = new mongoose.Schema({
    text: String,
    comments: [commentSchema],
    
}, { usePushEach: true });

var Post = mongoose.model('post', postSchema);

module.exports = Post;
