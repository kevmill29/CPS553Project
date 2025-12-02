const express = require("express")
const userController = require("../controllers/userController")
const router = express.Router()


//controller functions are contained in userController with logic in models/User.js
router.get("/", userController.getUsers)
router.get("/:id", userController.getUserById)
router.post("/", userController.createUser)
router.put("/:id", userController.updateUser)
router.delete("/:id", userController.deleteUser)
router.post('/login', userController.loginUser)



module.exports = router;