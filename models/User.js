const db = require('../config/db');

class User{
    static async findAll(){
        const [rows] = await db.query('SELECT * FROM  users ')
        return rows;
    }

    static async findById(id){
        const [ows] = await db.query('SELECT * FROM users WHERE id = ? ', [id])
        return rows[0]
    }

    static async create(name, email){
        const [result] = await db.query('INSERT INTO users (name, email) VALUES(?, ?)', [name, email])
        return {id: results.insertId, name , email}
    }

    static async update(id, name, email){
        await db.query('UPDATE user SET name = ?, email = ? WHERE id = ?', [name, email, id])
        return [name, email, id]
    }

    static async delete(id){
        await db.query('DELETE FROM users WHERE id = ? ', [id])
        return true;
    }
}

module.exports = User;