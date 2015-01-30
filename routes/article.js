//==============================================================================
//                                  Articles
//==============================================================================
/*
 * GET article page.
 *
 * app.get('/articles/:tag', routes.article.show);
 */
var mongoose = require('mongoose');

exports.show = function(req, res, next) {
  if (!req.params.tag)
      return next(new Error('No article tag.'));

  req.models.Article.findOne({tag: req.params.tag},
      function(error, article) {
        if (error)
            return next(error);
        if (!article.published)
            return res.send(401);
        res.send({article: article});
      });
};

/*
 * GET articles API.
 *
 * curl -X GET http://localhost:3000/api/articles
 *
 */
exports.list = function(req, res, next) {
  req.models.Article.list(
      function(error, articles) {
        if (error)
          return next(error);
        res.send({articles: articles});
      });
  };

/*
 * PUT article API.
 *
 * curl -X PUT http://localhost:3000/api/articles/54cade4a4c355cbb1a6b5404
 * --data "title=ICHANGEDMYMINDtag=bsdfsd&text=RICHARDSAIDITWONTWORK"
 */

exports.edit = function(req, res, next) {
  if (!req.params.id)
    return next(new Error('No article ID.'));

  req.models.Article.findById(req.params.id,
      function(error, article) {
        if (error)
          return next(error);
        article.comments.concat(req.body.comments);
        article.update({$set: req.body},
          function(error, count, raw){
            if (error)
              return next(error);
            res.send({affectedCount: count});
        })
      });
};

/*
 * DELETE article API.
 *
 * curl -X DELETE http://localhost:3000/api/articles/54cb81d96d0af32d31bc4fc3
 */
exports.del = function(req, res, next) {
  console.log("Delete API in del");
  if (!req.params.id)
      return next(new Error('No article ID.'));

  req.models.Article.findById(req.params.id,
      function(error, article) {
        if (error)
            return next(error);
        if (!article)
            return next(new Error('article not found'));
        article.remove(
          function(error, doc){
            if (error) return next(error);
            res.send(doc);
          });
      });
  };


/*
 * GET article POST page.
 */

exports.post = function(req, res, next) {
  if (!req.body.title)
  res.send(doc);
};

/*
 * POST article POST page.
 */
exports.postArticle = function(req, res, next) {
  if (!req.body.title || !req.body.tag || !req.body.text ) {
    return res.send(req.body);
  }
  var article = {
    title: req.body.title,
    tag: req.body.tag,
    text: req.body.text,
    comments: [],
    published: true
  };
  req.models.Article.create(article, function(error, articleResponse) {
    if (error) return next(error);
    res.send(articleResponse);
  });
};
