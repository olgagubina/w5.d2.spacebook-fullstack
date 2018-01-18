var SpacebookApp = function() {

  var posts = [];

  var $posts = $(".posts");

  $.ajax({
    method: "GET",
    url:'/posts',
    success: function(data){
      console.log(data);
      posts = data;
      console.log(posts);
      _renderPosts();

    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
  

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      console.log(newHTML);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }

  function addPost(newPost) {
    console.log(newPost);
    var postObj = {"text": newPost};
    $.ajax({
      method:"POST",
      url:'/posts',
      data: postObj ,
      success: function(data){
       posts.push(data);
       _renderPosts();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
    // posts.push({ text: newPost, comments: [] });
    _renderPosts();
  }


  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    console.log(posts);
    var $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var removePost = function(index) {
    var postId = posts[index]._id;
    $.ajax({
      method: 'DELETE',
      url: '/delete/'+postId,
      success: function() {
      posts.splice(index, 1);
      _renderPosts();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  var addComment = function(newComment, postIndex) {
    var postId = posts[postIndex]._id;
    $.ajax({
      method:"POST",
      url:'/posts/'+postId+'/comments',
      data: newComment,
      success: function(data){
        console.log(data);
        posts[postIndex].comments = data.comments;
    _renderComments(postIndex);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };


  var deleteComment = function(postIndex, commentIndex) {
    var postId = posts[postIndex]._id;
    var commId = posts[postIndex].comments[commentIndex]._id;
    $.ajax({
      method: 'DELETE',
      url: '/delete/'+postId+'/'+commId,
      success: function(data) {
        console.log(data);
        posts[postIndex].comments = data.comments;
        _renderComments(postIndex);;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
    
  };

  return {
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
  };
};

var app = SpacebookApp();


$('#addpost').on('click', function() {
  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    app.addPost($input.val());
    $input.val("");
  }
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function() {
  var index = $(this).closest('.post').index();;
  app.removePost(index);
});

$posts.on('click', '.toggle-comments', function() {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function() {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postIndex = $(this).closest('.post').index();
  var newComment = { text: $comment.val(), user: $user.val() };

  app.addComment(newComment, postIndex);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function() {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postIndex = $(this).closest('.post').index();
  var commentIndex = $(this).closest('.comment').index();

  app.deleteComment(postIndex, commentIndex);
});
