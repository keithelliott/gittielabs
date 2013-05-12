
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , app = express()
  , poet = require('poet')(app);

poet.set({
    posts: './_posts/',  // Directory of posts
    postsPerPage: 5,     // Posts per page in pagination
    metaFormat: 'json'  // meta formatter for posts
})
    .createPostRoute()
    .createPageRoute()
    .createTagRoute()
    .createCategoryRoute()
    .init();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/winewithme', routes.index);

app.get( '/post/:post', function ( req, res ) {
    var post = req.poet.getPost( req.params.post );
    if ( post ) {
        res.render( 'post', { post: post });
    } else {
        res.send(404);
    }
});


app.get( '/tag/:tag', function ( req, res ) {
    var taggedPosts = req.poet.postsWithTag( req.params.tag );
    if ( taggedPosts.length ) {
        res.render( 'tag', {
            posts : taggedPosts,
            tag : req.params.tag
        });
    }
});

app.get( '/category/:category', function ( req, res ) {
    var categorizedPosts = req.poet.postsWithCategory( req.params.category );
    if ( categorizedPosts.length ) {
        res.render( 'category', {
            posts : categorizedPosts,
            category : req.params.category
        });
    }
});

app.get( '/page/:page', function ( req, res ) {
    var page = req.params.page,
        lastPost = page * 3
    res.render( 'page', {
        posts : req.poet.getPosts( lastPost - 3, lastPost ),
        page : page
    });
});




http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
