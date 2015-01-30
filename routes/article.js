//==============================================================================
//                                  Articles
//==============================================================================
/*
 * GET article page.
 *
 * app.get('/articles/:slug', routes.article.show);
 */
var mongoose = require('mongoose');

exports.show = function(req, res, next) {
  if (!req.params.slug)
      return next(new Error('No article slug.'));
  req.models.Article.findOne({slug: req.params.slug},
      function(error, article) {
        if (error)
            return next(error);
        if (!article.published)
            return res.send(401);
        res.send({articles: articles});
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
 * POST article API.
 *
 * curl -X POST http://localhost:3000/post --data "title=1&slug=bsdfsd&text=Blahhhhhh"
 */

exports.add = function(req, res, next) {
  if (!req.body.article)
      return next(new Error('No article payload.'));
  var article = req.body.article;
  article.published = true;
  req.models.Article.create(article,
      function(error, articleResponse) {
        if (error)
            return next(error);
        res.send(articleResponse);
      });
};


/*
 * PUT article API.
 *
 * curl -X PUT http://localhost:3000/api/articles/54cade4a4c355cbb1a6b5404
 * --data "title=ICHANGEDMYMINDslug=bsdfsd&text=RICHARDSAIDITWONTWORK"
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
  if (!req.body.title || !req.body.slug || !req.body.text ) {
    return res.send(req.body);
  }
  var article = {
    title: req.body.title,
    slug: req.body.slug,
    text: req.body.text,
    comments: [],
    published: true
  };
  req.models.Article.create(article, function(error, articleResponse) {
    if (error) return next(error);
    res.send(articleResponse);
  });
};
