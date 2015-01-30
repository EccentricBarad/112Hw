var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  mongoose = require('mongoose'),
  models = require('./models'),
  dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog',
  db = mongoose.connect(dbUrl, {safe: true});
  Comments = mongoose.model("Comments");

var app = express();
app.locals.appTitle = "BlueJay Homework Assignment Sucks";

app.use(function(req, res, next) {
  if (!models.Article || !models.Comment)
      return next(new Error("No models."))

  req.models = models;
  return next();
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.cookieParser('3CCC4ACD-6ED1-4844-9217-82131BDCB239'));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(app.router);
//Comments
app.post('/comments/post', routes.comment.postComment);
app.del('/api/comments/:id', routes.comment.del);
app.get('/api/comments', routes.comment.list)
app.put('/api/comments/:id', routes.article.edit);

//Articles
app.get('/', routes.index);
app.get('/post', routes.article.post);
app.post('/post', routes.article.postArticle);
app.get('/articles/:slug', routes.article.show);

//REST API ROUTES
app.get('/api/articles', routes.article.list)
app.post('/api/articles', routes.article.add);
app.put('/api/articles/:id', routes.article.edit);
app.del('/api/articles/:id', routes.article.del);

app.all('*', function(req, res) {
  res.send(404);
})

// http.createServer(app).listen(app.get('port'), function(){
  // console.log('Express server listening on port ' + app.get('port'));
// });

var server = http.createServer(app);
var boot = function () {
  server.listen(app.get('port'),
      function(){
        console.info('Express server listening on port ' + app.get('port'));
  });
}
var shutdown = function() {
  server.close();
}
if (require.main === module) {
  boot();
}
else {
  console.info('Running app as a module')
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = app.get('port');
}
