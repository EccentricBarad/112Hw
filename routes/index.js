exports.article = require('./article');
exports.comment = require('./comments');

/*
 * GET home page.
 */
exports.index = function(req, res, next){
  req.models.Article.find({published: true}, null, {sort: {_id:-1}},
      function(error, articles) {
        // Pull all the comments
        req.models.Comment.list(
            function(error, comments) {
                if (error)
                    return next(error);
                if (error)
                    return next(error);
                res.render('index', { comments: comments, articles: articles});
        });
  })
};
