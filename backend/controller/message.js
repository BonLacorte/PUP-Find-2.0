import express from 'express'
import catchAsyncErrors from "./../middleware/catchAsyncErrors.js"
// import Message from '../models/Message.js';
import Message from '../models/Message.js';
import { verifyJWT } from '../middleware/verifyJWT.js';
import Chat from '../models/Chat.js';

const router = express.Router();

router.get("/get-all-messages/:chatId", catchAsyncErrors( async (req, res) => {
    
    // console.log("req.params.chatId",req.params.chatId)

    await Message.find({ chat: req.params.chatId })
    .populate("sender", "-personal_info.password, -personal_info.access, -token_version")
    .populate("chat")
    .then((messages) => {
        return res.status(200).json({messages});
    })
    .catch ((err) => {
        console.log(err)
        return res.status(500).json({ error: err.message });
    })

}));

router.post("/new-message", catchAsyncErrors( async (req, res) => {

    const { text, chatId, userId, image } = req.body;

    // console.log("new-message userId:",userId)
    // console.log("new-message text:",text)
    // console.log("new-message image:",image)
    // console.log("new-message chatId:",chatId)

    if (!chatId) {
        // console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    let message = new Message({
        // sender: req.userId,
        sender: userId,
        text: text,
        image: image,
        chat: chatId,
    });

    // console.log("new-message message:", message)

    message.save()
        .then(async (message) => {
            message = await message.populate("sender", "-personal_info.password, -personal_info.access, -token_version")
            message = await message.populate({ 
                path: "chat",
                populate: {
                    path: "users",
                    select: "-personal_info.password, -personal_info.access, -token_version",
                },
            })
            // message = await message.populate("chat.users[]")

            // .populate({
            //     path: "chat.",
            //     populate: {
            //         path: "users",
            //         select: "-personal_info.password, -personal_info.access, -token_version",
            //     },

            console.log("send message", message)

            await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

            return res.status(201).json({
                message
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: err.message });
        });
    // try {
    //     var message = await Message.create(newMessage);

    //     message = await message.populate("sender", "name pic");
    //     message = await message.populate("chat");
    //     message = await User.populate(message, {
    //     path: "chat.users",
    //     select: "name pic email",
    //     });

    //     await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    //     res.json(message);
    // } catch (error) {
    //     res.status(400);
    //     throw new Error(error.message);
    // }

}))

export default router