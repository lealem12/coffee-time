Coffee-time is an API for online forum. The code here is only the backend and is deployed on Render (accessible at the link: https://coffee-time.onrender.com).

Because the frontend is not build yet, please use thunder client/ postman to test the endpoints. The jwt authorization middleware makes it a must for users to first sign up and login before browsing further. While making other requests to the api, there should be the generated jwt token in the header.

## Here are the endpoints:
    /users/signup and users/login --- to signup and login.
    /users/profile/:id --- to get and update profile details.
  
    /threads  --- get all threads or posts. if a Post request is made, then create a new thread.
    /threads/:id  --- get, update, or delete a single thread.
    /:postId/comments  --- create comments from a thread.
    /:postId/comments/:commentId  --- delete or update a comment.
   
    /api/my-threads/  --- get all threads created by author.
    /api/my-comments/  --- get all comments created by author.
    /api/my-comments/:commentId  - when a get request is made, it will return the parent thread of this particulate comment.
