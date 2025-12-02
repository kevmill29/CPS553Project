const { query } = require("./db_connect");

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
