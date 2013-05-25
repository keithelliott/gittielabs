
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , wwm = require('./routes/winewithme')
  , http = require('http')
  , path = require('path')
  , app = express()
  , poet = require('poet')(app)
  , twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  , client = require('twilio')
  , hoodhero = require('./routes/hoodhero');

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

/**
 * Wine with me route
 */
app.get('/winewithme', wwm.index);

app.get( '/post/:post', function ( req, res ) {
    var post = req.poet.getPost( req.params.post );
    if ( post ) {
        res.render( 'post', { post: post });
    } else {
        res.send(404);
    }
});

/**
 * Blog routes
 */
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

/**
 * Twilio routes
 */
app.post('/voice',function(req,res){
    console.log('entering voice route');
     var resp = new client.TwimlResponse();
        resp.say('Why hello sexy lady! Time for bed?');

        res.type('text/xml');
        res.send(resp.toString());
});

//app.get('/voice',function(req,res){
//    console.log('entering voice route');
//    if (client.validateExpressRequest(req, process.env.TWILIO_AUTH_TOKEN)) {
//        var resp = new client.TwimlResponse();
//        resp.say('Why hello sexy lady! Time for bed?');
//
//        res.type('text/xml');
//        res.send(resp.toString());
//    }
//    else {
//        res.send('you are not twilio.  Buzz off.');
//    }
//});

app.get('/sms', hoodhero.sms);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
