const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require('../models/userSchema')

// module one of project 5 (question 1) - create user with login balanc
const createUser = async (req, res) => {
    try {
      const { username, email, password, wallet_balance, role } = req.body;
      if (!username) {
        return res.status(400).json({ message: "Please enter a username" });
      }
      if (!email) {
         return res.status(400).json({ message: "Please enter your email" });
      }
      if (!password) {
        return res.status(400).json({ message: "Please enter password" });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: "Password should be a min of 8 chars" });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User account already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      const newUser = new User({
        username:username,
        email:email,
        password: hashedPassword,
        wallet_balance: wallet_balance || 0,
        role: role || 'user'
      });
  
      await newUser.save();
  
      res.status(201).json({
        message: "User account created successfully",
        newUser: {
          username: newUser.username,
          email: newUser.email,
          wallet_balance: newUser.balance,
         
        }
      });
  
    } catch(error) {
      res.status(500).json({ message: error.message });
    }
  }


// module one of project 5 (question 1) - create login
  const userLogin = async (req, res)=>{
  
      const { email, password } = req.body
  
      const user = await User.findOne({ email })
      // .select("-password")
  
      if(!user){
          return res.status(404).json({message: "User account does not exist."})
      }
  
      const isMatch = await bcrypt.compare(password, user?.password)
  
      if(!isMatch){
          return res.status(400).json({message: "Incorrect email or password."})
      }
  
      // if(!user.verified){
  
      // }
  
  
      // Generate a token
      const accessToken = jwt.sign(
          {id: user?._id },
          process.env.ACCESS_TOKEN,
          {expiresIn: "5m"}
      )
  
      const refreshToken = jwt.sign(
          {id: user?._id},
          process.env.REFRESH_TOKEN,
          {expiresIn: "30d"}
      )
  
  
      res.status(200).json({
          message: "Login successful",
          accessToken,
          user: {
              email: user?.email,
              userame: user?.firstName,
              balance: user?.wallet_balance
             
          },
          refreshToken
      })
  
  }

  const getUsers = async (req, res)=>{

      const users = await User.find();
      if(!users)
        res.status(400).json({
          message: 'There is no user in the database'
      })
       
      res.status(200).json({
        email: users
      })
  
    }


  module.exports = {
    createUser,
    userLogin,
    getUsers
  }