const express = require('express')
const postController = require('../controllers/post.controller')
const authencation = require('../middlewares/access.middleware')
const postMiddleware = require('../middlewares/post.middleware')


const router = express.Router()


//GET
router.get('/comment/:post_id', authencation.login, postController.getComment)
router.get('/user/:user_id', postController.getPostByUser)
router.get('/detail/:post_id', authencation.login, postController.getPostDetail)




//POST
router.post('/', authencation.login, postController.createPost)
router.post('/comment/:post_id/:comment_id', authencation.login, postController.commentPost)
router.post('/comment/:post_id/', authencation.login, postController.commentPost)
router.delete('/like/:id', authencation.login, postController.unlikePost)
router.post('/like/:id', authencation.login, postController.likePost)



//PUT
router.put('/:id', authencation.login, postMiddleware.isAuthor, postController.updatePost)


//DELETE
router.delete('/:id', authencation.login, postMiddleware.isAuthor, postController.deletePost)


module.exports = router