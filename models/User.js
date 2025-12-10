const { query } = require("./db_connect");

// Automatically ensure the table exists when the app starts
async function createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS user (
            UserID INT PRIMARY KEY AUTO_INCREMENT,
            Username VARCHAR(100) NOT NULL,
            Password VARCHAR(255) NOT NULL,
            Email VARCHAR(100) NOT NULL UNIQUE,
            ProfilePicture VARCHAR(255),
            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    try {
        await query(sql);
        console.log("User table is ready.");
    } catch (err) {
        console.error(" Error creating user table:", err);
    }
}

// Run table creation immediately when the file loads
createTable();


class User {

    // GET all users
    static async getUsers() {
        const sql = `
            SELECT *
            FROM user
        `;
        const rows = await query(sql);
        return rows;
    }

    // GET user by ID
    static async getUserById(id) {
        const sql = `
            SELECT *
            FROM user
            WHERE UserID = ?
        `;
        const rows = await query(sql, [id]);
        return rows[0];
    }

    // CREATE new user
    static async createUser(username, email, password) {
        const sql = `
            INSERT INTO user (Username, Email, Password)
            VALUES (?, ?, ?)
        `;
        const result = await query(sql, [username, email, password]);

        return {
            UserID: result.insertId,
            Username: username,
            Email: email
        };
    }

    // UPDATE user
    static async updateUser(id, username, email) {
        const sql = `
            UPDATE user
            SET Username = ?, Email = ?
            WHERE UserID = ?
        `;
        await query(sql, [username, email, id]);

        return { UserID: id, Username: username, Email: email };
    }

    // DELETE user
    static async deleteUser(id) {
        const sql = `
            DELETE FROM user
            WHERE UserID = ?
        `;
        await query(sql, [id]);
        return true;
    }

    // LOGIN user
    static async loginUser({ email }) {
        const sql = `
            SELECT *
            FROM user
            WHERE Email = ?
        `;
        const rows = await query(sql, [email]);
        return rows[0];
    }
}

module.exports = User;
