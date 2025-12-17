// postController.js

const Post = require("../models/Post");

// GET all posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.getPosts();
        res.status(200).json(posts);
    } catch (err) {
        console.error("getPosts error:", err);
        res.status(500).json({ message: "Unable to fetch posts" });
    }
};

// GET post by ID
exports.getPostById = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.getPostById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json(post);
    } catch (err) {
        console.error("getPostById error:", err);
        res.status(500).json({ message: "Unable to fetch post" });
    }
};

// Controller function for creating a post (POST /api/posts)


// Controller function to handle creating a new post
exports.createPost = async (req, res) => {
    try {
        // 1. Extract data from the request body
        // Note: If you are using Authentication middleware, userID might come from req.user.UserID instead
        const { userID, content } = req.body;

        // 2. Basic Controller-level validation
        if (!content) {
            return res.status(400).json({ error: "Post content is required." });
        }

        if (!userID) {
            return res.status(400).json({ error: "UserID is required." });
        }

        // 3. Call the Model function
        // This will trigger the validation logic inside your Post.js model (parseInt checks)
        const newPost = await Post.createPost(userID, content);

        // 4. Send success response
        res.status(201).json({
            message: "Post created successfully",
            post: newPost
        });

    } catch (err) {
        console.error("Error creating post:", err);

        // 5. Handle specific error thrown by the Model
        if (err.message === "Invalid UserID provided for post creation.") {
            return res.status(400).json({ error: err.message });
        }

        // Handle generic server errors
        res.status(500).json({ error: "An error occurred while creating the post." });
    }
};



exports.updatePost = async (req, res) => {
    try {
        const id = req.params.id;
        const { content } = req.body;

        const existing = await Post.getPostById(id);
        if (!existing) {
            return res.status(404).json({ message: "Post not found" });
        }
    

        const updated = await Post.updatePost(id, content);
        res.json(updated);
    } catch (err) {
        console.error("updatePost error:", err);
        res.status(500).json({ message: "Unable to update post" });
    }
};

// DELETE post (RECOMMENDED: Add security check for post ownership here)
exports.deletePost = async (req, res) => {
    try {
        const id = req.params.id;

        const existing = await Post.getPostById(id);
        if (!existing) {
            return res.status(404).json({ message: "Post not found" });
        }

        
        await Post.deletePost(id);
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error("deletePost error:", err);
        res.status(500).json({ message: "Unable to delete post" });
    }
}; 

// GET posts for a specific user profile
exports.getProfilePosts = async (req, res) => {
    // 🔑 Use the exact parameter key defined in the router: ':userId'
    const userId = req.params.userId; 

    if (!userId || userId === 'undefined' || isNaN(parseInt(userId))) {
        // This is the error message you are seeing in Postman
        return res.status(400).json({ message: "User ID is required to fetch posts." });
    }

    try {
        const posts = await Post.getPostsByUserId(userId);
        res.json(posts);
    } catch (err) {
        console.error("Error fetching user posts:", err.stack);
        res.status(500).json({ message: "Failed to retrieve user's posts." });
    }
};