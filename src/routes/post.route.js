const express = require('express')
const postController = require('../controllers/post.controller')
const authencation = require('../middlewares/access.middleware')

const router = express.Router()


//GET
router.get('/comment/:post_id', authencation.login, postController.getComment)
router.get('/user/:user_id', postController.getPostByUser)



//POST
router.post('/', authencation.login, postController.createPost)
router.post('/comment/:post_id/:comment_id', authencation.login, postController.commentPost)
router.delete('/like/:id', authencation.login, postController.unlikePost)
router.post('/like/:id', authencation.login, postController.likePost)



//PUT
router.put('/:id', postController.updatePost)


//DELETE
router.delete('/:id', postController.deletePost)


module.exports = router