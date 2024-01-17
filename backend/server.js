const express = require('express')
const app = express()
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const colors = require('colors')
const cors = require("cors");

const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')

const User = require('./models/userModel')


dotenv.config()
app.use(express.json());
app.use(cors())
connectDB()

app.use('/api/user',userRoutes)
app.use('/api/message',messageRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT
const server = app.listen(PORT,()=>{
    console.log(`Server Running on Port ${PORT}`.yellow)
})

const io = require('socket.io')(server,{
    pingTimeout: 6000,
    cors:{
        origin: process.env.SOCKET_ORIGIN
    }
})

io.on("connection",(socket)=>{
    console.log("connected to socket.io")

    socket.on('setup',(userData) =>{
        console.log("j "+ userData._id);
        socket.join(userData._id)
        socket.emit("connected")
    })

    socket.on('join chat',()=>{
        socket.join(12345)
        console.log("joined " + 12345);
    })


    socket.on("new message",async (newMessage)=>{
        await User.findByIdAndUpdate(newMessage.sender._id,{sharedSecret:true})
        socket.in(12345).emit("message recieved",newMessage)
    })

    socket.off("setup",()=>{
        console.log("disconnected")
        socket.leave(userData._id)
    })

})