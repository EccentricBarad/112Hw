
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
 * curl -X PUT http://localhost:3000/api/comments/54cade4a4c355cbb1a6b5404
 * --data "title=ICHANGEDMYMINDtag=bsdfsd&text=RICHARDSAIDITWONTWORK"
 */
exports.edit = function(req, res, next) {
    if (!req.params.id)
        return next(new Error('No article ID.'));

    req.models.Comment.findById(req.params.id,
        function(error, comment) {
            if (error)
                return next(error);
            comment.update({$set: req.body},
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
        return res.send(req.body);
    }
    var comment = {
        text: req.body.text,
        belongsto: req.body.belongsto,
    };

    req.models.Comment.create(comment,
        function(error, commentResponse) {
            if (error)
                return next(error);
                res.send(commentResponse);
            //Store the id of the comment in the array for the post.
            req.models.Article.findById(req.body.belongsto,
                function(error, article) {
                    if (error)
                        return next(error);
                    if (!article)
                        return next(new Error('comment not found'));
                    article.comments.push(commentResponse.id)
                    article.update({$set: article},
                        function(error, count, raw){
                            if (error)
                                return next(error);
                                res.send({affectedCount: count});
                            })
                        });

        });
};
