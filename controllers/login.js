const express = require(express)
const Login = require("../models/Login")
const router = express.Router();

try{
router.post('/login', async (req, res) =>{
    const {email, password} = req.body

    //query user from the db
    const [rows] = await db.query("SELECT * FROM users WHERE email ?", [email])
    const user = rows[0]

    if(!user){
        return res.status(401).json({message: "Something went wrong please try again! User doesn't exist!"})
    } 

    if(!user.password){
        return res.status(401).json({message: "Something went wrong please try again! Password is invalid!"})
    }

    //if successful will reach here
return res.json({message: "Login successful!"})
   
})}catch(err){
    console.error("Login error:",err);
        return res.status(500).json({message: "Something went wrong please try again!"})
}

