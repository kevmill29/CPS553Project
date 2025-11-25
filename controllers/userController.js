const User = require("../models/User");

//finds all the users in db
exports.getUsers = async (req, res) => {
    try {
        const users = await User.getUsers();
        return res.status(200).json(users);
    } catch (err) {
        console.error('getUsers error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

//searching function by email
exports.getUserById = async (req, res) => {
    try{
        const id = req.params.id
        const user = await User.getUserById(id)

        if(!user){
            return res.status(404).json({message: "Error user does not exist!"})
        }

        //if successful
        return res.json(user);


    } catch(err){
        console.error("Error finding user: ", err)
        res.status(500).json({message:"Unable to fetch user."})
    }
}

//create function
exports.createUser = async (req, res) => {
    try{
        const {name, email} = req.body
        
        const newUser = await User.createUser(name, email)
        res.status(201).json(newUser)
    } catch(err){
        console.error("Error creating user: ",err)
        res.status(500).json({message: "Unable to create user."})
    }
}

//update function
exports.updateUser = async (req, res) => {
    try{
        const id = req.params.id

        const user = await User.getUserById(id) // calls back to getuserbyid function
        if(!user){
            return res.status(404).json({message: "User does not exist!"})
        }

        const updatedUser = await User.updateUser(id, name , email) // recursively call the current function to update user
        res.json(updatedUser)
    }catch(err){
        console.error("Could not update user!",err)
        res.status(500).json({message: "Error updating user in db!"})
    }
}

//delete function
exports.deleteUser = async (req, res) =>{
try{
    const id = req.params.id;

    const user = await User.getUserById(id)
    if(!user){
        return res.status(404).json({message: "This user does not exist!"})
    }

    await User.deleteUser
    res.json({message:"User has been successfully deleted"})
}catch(err){
    console.error("Error: Could not delete user!", err)
    return res.status(500).json({message: "User was not deleted or does not exist!"})
}



}