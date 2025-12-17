// User Controller
const User = require("../models/User");

// finds all the users in db
exports.getUsers = async (req, res) => {
    try {
        const users = await User.getUsers();
        return res.status(200).json(users);
    } catch (err) {
        console.error('getUsers error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

// searching function by id
exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        
        // CRITICAL VALIDATION: Ensure ID is a valid number/string before proceeding
        if (!id || id === 'undefined' || isNaN(parseInt(id))) {
            // Log for debugging but send 400 or 404 to the client
            console.warn(`Attempt to fetch user with invalid ID parameter: ${id}`);
            // Return 404 (Not Found) or 400 (Bad Request)
            return res.status(404).json({ message: "User ID not provided or is invalid." });
        }

        const user = await User.getUserById(id);

        if (!user) {
            return res.status(404).json({ message: "Error user does not exist!" });
        }

        return res.json(user);
    } catch (err) {
        console.error("Error finding user: ", err);
        return res.status(500).json({ message: "Unable to fetch user." });
    }
};

// searching function by email
exports.getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "Error user does not exist!" });
        }

        return res.json(user);
    } catch (err) {
        console.error("Error finding user: ", err);
        return res.status(500).json({ message: "Unable to fetch user." });
    }
};

exports.getUserByName = async (req, res) => {
    try {
        const name = req.params.name;
        
        // FIX: Must call the correctly named model function
        const user = await User.getUserByUsername(name); 
        
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        return res.json(user);
    } catch (err) {
        console.error("Error fetching user by name:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// create function
exports.createUser = async (req, res) => {
    try {
    
        const { username, email, password, uuid, profilePicture } = req.body; 

        if (!username || !email || !password) {
             return res.status(400).json({ message: "Missing required fields: username, email, and password are required for registration." });
        }


        // NOTE: Model function only takes (username, email, password)
        const newUser = await User.createUser(
            username, 
            email, 
            password, 
            //profilePicture || null, 
            //uuid 
        ); 
        
        
        return res.status(201).json(newUser);
        
    } catch (err) {
    
        console.error("Error creating user:", err.message, err.stack); 
        
    
        return res.status(500).json({ message: "Unable to create user due to a server error. Check logs for details." });
    }
};

// update function
exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.getUserById(id); // calls back to getUserById function
        if (!user) {
            return res.status(404).json({ message: "User does not exist!" });
        }

        // NOTE: Assumes the model function takes 'username', not 'name'
        const { username, email } = req.body; 

        const updatedUser = await User.updateUser(id, username, email); // call model to update user
        return res.json(updatedUser);
    } catch (err) {
        console.error("Could not update user!", err);
        return res.status(500).json({ message: "Error updating user in db!" });
    }
};

// delete function
exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: "This user does not exist!" });
        }

        await User.deleteUser(id);
        return res.json({ message: "User has been successfully deleted" });
    } catch (err) {
        console.error("Error: Could not delete user!", err);
        return res.status(500).json({ message: "User was not deleted or does not exist!" });
    }
};

