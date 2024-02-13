import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import connectDB from './utils/dbConn.js'
import cors from 'cors'
import { nanoid } from 'nanoid'
import corsOptions from './utils/corsOption.js'
import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer'
import userRoutes from './controller/user.js';
import reportRoutes from './controller/report.js';
import messageRoutes from './controller/message.js';
import dashboardRoutes from './controller/dashboard.js'
import chatRoutes from './controller/chat.js';
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import { createAccessToken, createRefreshToken } from './middleware/auth.js'
import { User } from './models/User.js'
import { sendRefreshToken } from './middleware/sendRefreshToken.js'

const app = express();
const PORT = process.env.PORT || 3500


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// console.log(process.env.NODE_ENV)


connectDB()


app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json({limit: '70mb'}))
app.use(express.urlencoded({limit: '70mb', extended: true, parameterLimit: 50000}));

app.get('/', (req, res) => {
    res.sendStatus(200).json("Server is running")
})

app.use('/user', userRoutes);
app.use('/chat', chatRoutes)
app.use('/message', messageRoutes)
app.use('/report', reportRoutes)
app.use('/dashboard', dashboardRoutes)

mongoose.set('strictQuery', false);

const server = app.listen(
    PORT, () => {
        // console.log(`Server running on PORT ${PORT}...`)
    }
);




// const socket_server = io(server, {
    //     pingTimeout: 60000,
    //     cors: {
        //         // origin: '*',
        //         // credentials: true,
        //         corsOptions
        //     },
        // });
        

import { Server } from 'socket.io'
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        // origin: '*',
        // credentials: true,
        corsOptions
    },
});

const activeUsersByChat = {}; // Add this variable outside the io.on('connection', ...) block
// Set up Socket.io connections
io.on('connection', socket => {
    // // console.log('Connected to Socket.io');

    socket.on("setup", (userId) => {
        // socket.join(userData._id)
        socket.join(userId)
        // // console.log(userId)
        socket.emit("connected")
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        // // console.log("User Joined Room: " + room);
    });

    socket.on("leave chat", (room) => {
        socket.leave(room);
        // // console.log("User Left Room: " + room);
    })

    // Signal from client when user opens a chat
    socket.on("chat opened", (chatId) => {
        activeUsersByChat[chatId] = socket.userId;
        // // console.log("Chat opened", {activeUsersByChat})
    });

    // Signal from client when user closes a chat
    socket.on("chat closed", (chatId) => {
        if (activeUsersByChat[chatId] === socket.userId) {
            
            delete activeUsersByChat[chatId];
        }
        // // console.log("Chat closed", {activeUsersByChat})
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        // // console.log("new message newMessageRecieved:", newMessageRecieved)
        // // console.log("*****************************")
        // // console.log("new message chat:", chat)
        // // console.log("*****************************")
        // // console.log("new message chat.users:", chat.users)

        if (!chat.users) return // // console.log("chat.users not defined");

        // For seen function
        chat.users.forEach((user) => {
            // If the `user` is the sender then return(exit)
            if (user._id == newMessageRecieved.sender._id) return;

            // If the `user` is not the sender
            socket.in(user._id).emit("message recieved", newMessageRecieved);
            // // console.log("*****************************")
            // // console.log("message recieved user._id",user._id)
            // // console.log("message recieved newMessageRecieved", newMessageRecieved)
            // // console.log("*****************************")

            // Add this block to update User2's last seen message
            // if (user._id == chat.users[1]._id) {
                // Send an event to User2 to update their last seen message
                socket.to(user._id).emit("update last seen message", newMessageRecieved);
            // }
        });

        // For real-time updating of ChatList's list of chat conversation's latest messages whether the user are online of not and whether the user is the sender of the latest message or not
        chat.users.forEach((user) => {
            socket.in(user._id).emit("update chat list", newMessageRecieved);
            // // console.log("update chat list newMessageRecieved", newMessageRecieved)
        })
    });

    socket.off("setup", (userId) => {
        // // console.log("USER DISCONNECTED");
        // socket.leave(userData._id);
        socket.leave(userId);
    });
});

app.use(express.json())


const upload = multer({ dest: 'uploads/' }); // Set your desired destination for file uploads

app.post("/upload", upload.single('img'), async (req, res, next) => {

    try {
        
        // console.log("FormData:", req.body);

        const result = await cloudinary.uploader.upload(req.file.path, { folder: "blog" })
        
        // console.log("result:", result)

        // console.log(`result.secure_url: `, result.secure_url)
        // // console.log(`result.secure_url: `, result.url)
        return res.status(200).json({ "img": result.secure_url })
        // return res.status(200).json({ "img": result.url })
    }
    catch(err) {
        // console.log(err)
        next(err);
        return res.status(500).json({ "error": err.message })
    }
})

app.post("/refresh_token", async (req, res) => {

    // // console.log("refresh-token req.headers",req.headers)
    
    const token = req.cookies.jid;
    // // console.log("refresh-token req.jid",req.cookies.jid)
    // // console.log("token",token)
    if (!token) return res.status(401).json({ "error": "You are not authenticated 1", access_token: ""})

    let decoded = null;
    try {
        decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        // // console.log("decoded1",decoded)
    } catch (err) {
        // console.log(err)
        return res.status(401).json({ "error": "You are not authenticated 2", access_token: "" })
    }

    await User.findById({ _id: decoded.userId })
        .then((user) => {

            if (!user) {
                return res.status(401).json({ "error": "You are not authenticated 3", access_token: "" })
            }

            const { personal_info: { password }, token_version, ...user_info } = user;



            // sendRefreshToken(res, createRefreshToken(user));
            // let access_token = createAccessToken(user)
            // // console.log(access_token)
            // return res.status(200).json(access_token)

            if (user.token_version !== decoded.token_version) {
                return res.status(401).json({ "error": "You are not authenticated 4", access_token: "" })
            }

            sendRefreshToken(res, createRefreshToken(user));

            return res.json({ ok: true, access_token: createAccessToken(user), user_id: decoded.userId, user_info })
        })
        .catch(err => {
            // console.log(err.message)
            return res.status(500).json({ "error": err.message })
        })
})

export default app