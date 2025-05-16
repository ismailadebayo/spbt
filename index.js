require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require('./models/userSchema')
const Game = require('./models/gameSchema');
const Outcome = require('./models/outcomeSchema');

const app = express()
app.use(express.json())
// const router = express.Router();

const port = process.env.PORT
const mongo_password = process.env.MONGO_PASSWORD



const MONGO_URI = `mongodb+srv://ismail:${mongo_password}@cluster0.ehcteyc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const welcome = 'You are welcome to Sport bet. If you always stake your wealth to play, you will be improverished'

//Welcome
app.get('/', (req, res)=>{
    res.status(200).json({message: welcome })
})

//resgiter create user
app.post('/create-user', async (req, res) => {
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
  });
  
  app.get('/users', async (req, res)=>{

    const users = await User.find();
    if(!users)
      res.status(400).json({
        message: 'There is no user in the database'
    })
     
    res.status(200).json({
      email: users
    })

  })

  app.post("/login", async (req, res)=>{

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

})


// POST /admin/create-event
app.post('/create-game', async (req, res) => {
    try {
      const { name, sport, startTime, status, outcomes } = req.body;
  
      if (!name || !sport || !startTime || !status || !outcomes || !Array.isArray(outcomes)) {
        return res.status(400).json({ message: 'Missing required fields or outcomes' });
      }
  
      // Create event
      const game = new Game({ name, sport, startTime, status });
      await game.save();
  
      // Create outcomes with odds
      const outcomeDocs = await Promise.all(outcomes.map(async (outcome) => {
        const { type, odds } = outcome;
        if (!type || !odds) throw new Error('Each outcome must have type and odds');
        return await new Outcome({ event: game._id, type, odds }).save();
      }));
  
      // Attach outcomes to event
      event.outcomes = outcomeDocs.map(o => o._id);
      await event.save();
  
      res.status(201).json({
        message: 'Event and odds created successfully',
        event: {
          id: game._id,
          name: game.name,
          sport: game.sport,
          startTime: game.startTime,
          outcomes: outcomeDocs.map(o => ({
            id: o._id,
            type: o.type,
            odds: o.odds
          }))
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  


mongoose.connect(MONGO_URI)
.then(()=>{
    console.log('Database is up')
    app.listen(port , ()=>{
        console.log(`Server listens at port: ${port} `)
    })
})