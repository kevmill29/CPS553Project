const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middleware/auth'); 

// GET all posts
router.get("/", postController.getPosts);

// CREATE POST (SECURE ROUTE - The only one that should exist)
router.post('/', postController.createPost); 

// GET post by ID
router.get("/:id", postController.getPostById);

// UPDATE post
router.put("/:id", postController.updatePost);

// DELETE post
router.delete("/:id", postController.deletePost);

router.get('/user/:userId/posts', postController.getProfilePosts);

module.exports = router;