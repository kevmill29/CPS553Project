const express = require("express")
const userController = require("../controllers/userController")
const router = express.Router()


// Controller functions are contained in userController with logic in models/User.js

// GET all users
router.get("/", userController.getUsers) 
// GET user by ID
router.get("/:id", userController.getUserById) 
// GET user by Email
router.get("/email/:email", userController.getUserByEmail) 
// GET user by Username (Moved login-related lookup here)
router.get("/name/:name", userController.getUserByName) 
// POST (Create) new user (Should only be used for admin functions if you use /register)
router.post("/", userController.createUser) 
// PUT (Update) user
router.put("/:id", userController.updateUser) 
// DELETE user
router.delete("/:id", userController.deleteUser) 


module.exports = router;