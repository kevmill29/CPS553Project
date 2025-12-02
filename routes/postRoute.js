const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// GET all posts
router.get("/", postController.getPosts);

// GET post by ID
router.get("/:id", postController.getPostById);

// CREATE post
router.post("/", postController.createPost);

// UPDATE post
router.put("/:id", postController.updatePost);

// DELETE post
router.delete("/:id", postController.deletePost);

module.exports = router;
