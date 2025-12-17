const express = require('express')
const router = express.Router()
const User = require("../models/User")

exports.login = async (req, res) => { 
    try {
        const { username, password } = req.body;
        
     
        const user = await User.login(username); 

        

if (user) {
    console.log("Input Username:", username);
    console.log("Input Password:", password);
    console.log("DB Username:", user.Username);
    console.log("DB Password:", user.Password); // Plain text password from DB
    console.log("Match Check:", user.Password === password);
}

      
        if (!user || user.Password !== password) { 
            
            console.warn(`Login attempt failed for username: ${username}. User exists: ${!!user}`);
            return res.status(401).json({ message: "Invalid username or password" });
        }

        res.json({ message: "Login successful", user: {
            UserID: user.UserID, 
            Username: user.Username, 
            Email: user.Email 
            // NEVER send the password back to the client
        }});

    } catch (err) {
        console.error(`Login error for username: ${req.body.username}:`, err.message, err.stack);
        res.status(500).json({ message: "An unexpected server error occurred during login. Please try again." });
    }
};


exports.register = async(req, res) => {
    try {
      
        const {username, email, password, uuid} = req.body 

        const existingUser = await User.getUserByEmail(email)
        
        // (User already exists)
        if (existingUser) {
            console.warn(`Registration attempt failed: User with email ${email} already exists.`);
            return res.status(409).json({ message: "This email address is already registered." }); // Use 409 Conflict
        }

        // Pass all four fields to the model function
        const newUser = await User.createUser(username, email, password, uuid) 
        
        res.status(201).json({message: "User successfully created!", user: newUser})
        
    }catch(err){
        // Developer-facing error: Log the full error from the database/model
        console.error(`Registration error for email ${req.body.email}:`, err.message, err.stack);
        // Generic client-facing error for security
        res.status(500).json({message: "An unexpected server error occurred during registration. Please check the logs."})
    }
}