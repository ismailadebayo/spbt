require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')



const betRoute = require('./routes/betRoute');
const userRoute = require('./routes/userRoute')
const gameRoute = require('./routes/gameRoute')
const adminRoute =  require('./routes/adminRoute')








const app = express()


app.use(express.json())

app.use((req, res, next) => {
  req.user = { _id: 'replace_with_real_user_id' }; // Replace with actual auth
  next();
});
// const router = express.Router();

const port = process.env.PORT
const mongo_password = process.env.MONGO_PASSWORD



const MONGO_URI = `mongodb+srv://ismail:${mongo_password}@cluster0.ehcteyc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const welcome = 'You are welcome to Sport bet. If you always stake your wealth to play, you will be improverished'

//Welcome
app.get('/', (req, res)=>{
    res.status(200).json({message: welcome })
})

app.use('/api/v1/user',  userRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/bet', betRoute);
app.use('/api/v1/game', gameRoute);

    
mongoose.connect(MONGO_URI)
.then(()=>{
    console.log('Database is up')
    app.listen(port , ()=>{
        console.log(`Server listens at port: ${port} `)
    })
})


// {
//   "eventId": "664ca13e...e9",
//   "outcomeId": "664ca151...f3",
//   "stake": 100
// }
