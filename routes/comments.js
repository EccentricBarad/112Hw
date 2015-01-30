
/*
 * GET article page.
 *
 * app.get('/comments/:id', routes.article.show);
 */
var mongoose = require('mongoose');

exports.show = function(req, res, next) {
  if (!req.params.txt)
      return next(new Error('No comment text.'));

  req.models.Article.findOne({slug: req.params.slug},
      function(error, article) {
        if (error)
          return next(error);
        res.render('article', article);
  });
};

/*
* GET articles API.
*
* curl -X GET http://localhost:3000/api/comments
*
*/

exports.list = function(req, res, next) {
    req.models.Comment.list(
        function(error, comments) {
            if (error)
                return next(error);
            res.send({comments: comments});
    });
};

/*
 * DELETE comment API.
 *
 * app.del('/api/comments/:id', routes.comment.del);
 *
 * curl -X DELETE http://localhost:3000/api/comments/<idOfComment>
 */
exports.del = function(req, res, next) {
    if (!req.params.id)
        return next(new Error('No comment ID.'));

    req.models.Comment.findById(req.params.id,
        function(error, comment) {
            if (error)
                return next(error);
            if (!comment)
                return next(new Error('comment not found'));

            req.models.Article.findById(comment.belongsto,
                function(error, article) {
                    if (error)
                        return next(error);
                    if (!article)
                        return next(new Error('article not found'));

                    console.log(article);

                    for(var i = article.comments.length; i--;) {
                        if(article.comments[i] === req.params.id) {
                            article.comments.splice(i, 1);
                        }
                    }

                    article.update({$set: article},
                        function(error, count, raw){
                            if (error)
                                return next(error);
                                res.send({affectedCount: count});
                            })
                        });

            comment.remove(
                function(error, doc){
                  if (error)
                    return next(error);
                  res.send(doc);
                });
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

    req.models.Comment.findById(req.params.id,
        function(error, comment) {
            if (error)
                return next(error);
            article.update({$set: req.body},
                function(error, count, raw){
                    if (error)
                        return next(error);
                        res.send({affectedCount: count});
                    })
                });
};

/*
 * POST comment POST page.
 *
 * app.post('/post', routes.article.postComment);
 *
 * curl -X POST http://localhost:3000/comments/post --data "text=?&belongsto=?"
 */

exports.postComment = function(req, res, next) {
    if (!req.body.text || !req.body.belongsto ) {
        return res.render('post', {error: "Fill text and Post."});
    }
    var comment = {
        text: req.body.text,
        belongsto: req.body.belongsto,
    };

    req.models.Comment.create(comment,
        function(error, commentResponse) {
            //Store the id of the comment in the array for the post.
            req.models.Article.findById(req.body.belongsto,
                function(error, article) {
                    if (error)
                        return next(error);
                    if (!article)
                        return next(new Error('article not found'));
                    article.comments.push(commentResponse.id)
                    article.update({$set: article},
                        function(error, count, raw){
                            if (error)
                                return next(error);
                                res.send({affectedCount: count});
                            })
                        });
            if (error)
                return next(error);
                res.render('post', {error: "Comment was added."});
        });
};
