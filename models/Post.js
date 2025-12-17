// models/Post.js

const { query } = require("./db_connect");

// OPTIONAL — Enable ONLY if you want to auto-create the post table

async function createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS post (
            PostID INT PRIMARY KEY AUTO_INCREMENT,
            UserID INT NOT NULL,
            Content TEXT NOT NULL,
            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (UserID) REFERENCES user(UserID) ON DELETE CASCADE
        )
    `;
    
    try {
        await query(sql);
        console.log("Post table is ready.");
    } catch (err) {
        console.error("Error creating post table:", err);
    }
}
createTable(); 

class Post {

    // CREATE a post
    static async createPost(userID, content) {
        // 🛑 CRITICAL FIX: Convert userID to an integer and validate it.
        // If the client sends 'undefined' or null, parseInt returns NaN.
        const numericUserID = parseInt(userID);
        
        if (isNaN(numericUserID) || numericUserID <= 0) {
            // Throw a clear error. The controller must catch this and send a 400 response.
            throw new Error("Invalid UserID provided for post creation.");
        }
        
        const sql = `
            INSERT INTO post (UserID, Content)
            VALUES (?, ?)
        `;
        // Use the validated numericUserID in the query
        const result = await query(sql, [numericUserID, content]);

        return {
            PostID: result.insertId,
            UserID: numericUserID,
            Content: content
        };
    }

    // GET all posts
    static async getPosts() {
        const sql = `
            SELECT *
            FROM post
            ORDER BY CreatedAt DESC
        `;
        const rows = await query(sql);
        return rows;
    }

    // GET post by ID
    static async getPostById(id) {
        const sql = `
            SELECT *
            FROM post
            WHERE PostID = ?
        `;
        const rows = await query(sql, [id]);
        return rows[0];
    }

    // UPDATE post
    static async updatePost(id, content) {
        const sql = `
            UPDATE post
            SET Content = ?
            WHERE PostID = ?
        `;
        await query(sql, [content, id]);

        return {
            PostID: id,
            Content: content
        };
    }

    // DELETE post
    static async deletePost(id) {
        const sql = `
            DELETE FROM post
            WHERE PostID = ?
        `;
        await query(sql, [id]);
        return true;
    }

    static async getPostsByUserId(userId) {
        let sql = `
            SELECT PostID, Content, CreatedAt, UserID 
            FROM post 
            WHERE UserID = ?
            ORDER BY CreatedAt DESC
        `;
        const results = await query(sql, [userId]);
        return results;
    }
}

module.exports = Post;