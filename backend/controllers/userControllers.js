const expressAsyncHandler = require("express-async-handler");
const User = require('../models/userModel')
const {generateToken} = require('../config/token')

const registerUser = expressAsyncHandler(async (req,res)=>{
    const {username,email,password} = req.body

    if(!username || !email || !password){
        res.status(400)
        throw new Error("Please Enter all Fields")
    }

    const userExist = await User.findOne({username})
    if(userExist){
        res.status(400)
        throw new Error("Username is already taken!")
    }

    const user = new User({username,email,password})
    await user.save()

    if(user){
        res.status(200).json({
            _id:user.id,
            username:user.username,
            email:user.email,
            sharedSecret: user.sharedSecret,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error("Failed to create User")
    }
})

const authUser = expressAsyncHandler(async(req,res)=>{
    const {username,password} = req.body

    const user = await User.findOne({username})

    if(user && await user.verifyPassword(password)){
        res.status(200).json({
            _id:user.id,
            username:user.username,
            email:user.email,
            sharedSecret: user.sharedSecret,
            token: generateToken(user._id)
        })
    }else{
        res.status(401)
        throw new Error("Username and Password doesn't match")
    }
    
})

module.exports = {registerUser,authUser}