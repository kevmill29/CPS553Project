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
        const sql = `
            INSERT INTO post (UserID, Content)
            VALUES (?, ?)
        `;
        const result = await query(sql, [userID, content]);

        return {
            PostID: result.insertId,
            UserID: userID,
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
