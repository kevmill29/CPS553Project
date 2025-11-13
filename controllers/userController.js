const User = require("./models/User");

// Controller to return all users. This project uses MySQL with a model that
// exposes `findAll()` (not Mongoose). Call that if available, otherwise
// fall back to an empty array to avoid crashing in development.
exports.getUsers = async (req, res) => {
    try {
        const users = typeof User.findAll === 'function' ? await User.findAll() : [];
        return res.status(200).json(users);
    } catch (err) {
        console.error('getUsers error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};