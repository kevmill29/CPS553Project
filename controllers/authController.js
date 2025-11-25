const express = require('express')
const router = express.Router()
const User = require("../models/User")

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    res.json({ message: "Login successful", user });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Something went wrong. Try again later." });
  }
};

exports.register = async(req, res) => {
    try{
        const {name, email, password} = req.body

        //check first if user exists before creating profile
        const existingUser = await User.findByEmail(email)
        if(existingUser){
            return res.status(401).json({message:"User already exists!"})
        }

        //create new user if user does not exist
        const newUser = await User.register(name, email, password)
        //if successful this is the messagen this function will return
        res.status(201).json({message: "User successfully created!", 
            user: newUser})


    }catch(err){
        console.error("Registration error: ", err)
        res.status(500).json({message: "Something went wrong please try again later!"})
    }
}