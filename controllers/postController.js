const Post = require("../models/Post");

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.getPosts();
    res.status(200).json(posts);
  } catch (err) {
    console.error("getPosts error:", err);
    res.status(500).json({ message: "Unable to fetch posts" });
  }
};

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

exports.createPost = async (req, res) => {
    try {
        const { userID, content } = req.body;

        if (!userID || !content) {
            return res.status(400).json({ message: "Missing userID or content" });
        }

        const newPost = await Post.createPost(userID, content);

        res.status(201).json(newPost);

    } catch (err) {
        console.error("createPost error:", err);
        res.status(500).json({ message: "Unable to create post" });
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
exports.getProfilePosts = async (req, res) => {
    
    const userId = req.params.userId || req.body.userId; // Get ID from parameter or body

    if (!userId) {
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

};
