# API documentation

## Note to testers:
### General:
In order to get the project running, you need to ensure that you have all the dependencies - node_modules - installed and that you have a mongoDB database setup for your project.

### MongoDB:
#### Article:
    title: {
        type: String,
        required: true,
        validate: [function(value) {return value.length<=20}, 'Title is too long (120 max)'],
        default: 'New Post'
      },
      text: String,
      published: {
        type: Boolean,
        default: false
      },
      tag: {
        type: String,
        set: function(value){return value.toLowerCase().replace(' ', '-')}
      },
      comments: {
          type: [String],
          default: []
      },
 
 #### Comments:
     text: {
        type: String,
        required: true,
        default: 'New Comment'
     },
     text: String,
     belongsto: {
        type: String,
        required: true,
     }
# Articles:

## To create an article:
Example:
 curl -X POST http://localhost:3000/post --data "title=NewArticleFor112&slug=CoolTag&text=Thisisthebestarticle"

Description:
	Creates a new article in the database!
	
Parameters:
	title : title of the article
	tag: a tag for the article
	published: Whether this will be displayed or not.
	text: Body of the article
	comments: The array of comments associated with this article.

Result
	A MongoDB insert of the following structure:
		{_id, title, slug, published, text, comments}

## To delete an article:
Example:
 curl -X DELETE http://localhost:3000/api/articles/<id of article>

Description:
	Deletes the article with the ID provided!
	
Parameters:
	id : The id of the article you would like to remove

Result
	Article with ID is deleted.

## To view all articles:
Example:
 curl -X GET http://localhost:3000/api/articles

Description:
	Fetches all articles from the DB!

Result
	Displays all articles.

## To view all articles:
Example:
 curl -XGET http://localhost:3000/articles/<tag>

Description:
	Gets a particular article with a tag from the database! There might be unhandled edge cases.

Result
	Displays the article found.

## To update an article:
Example:
 curl -X PUT http://localhost:3000/api/articles/54cade4a4c355cbb1a6b5404 --data "title=NewTiTLe=bsdfsd&text=AfterUpdate"

Description:
	Given a particular article ID, you can provide new article to update the previous one!
	
Parameters:
	title : title of the article
	data : data relevant to post

Result
	A MongoDB insert of the following structure:
		{_id, post_title, post_data}
		
		
# Comments:

## To create a comment:
Example:
 curl -X POST http://localhost:3000/comments/post --data "text=<Body>&belongsto=<ID_of_article_to_link_to>"
 NOTE: Post needs to exist!
 
Description:
	Creates a comment that is associated with a particular article.
	
Parameters:
	text: Body of the comment.
	belongsto: The article this comment belongs to.

Result
	A MongoDB insert of the following structure:
		{_id, text:, belongsto:}
