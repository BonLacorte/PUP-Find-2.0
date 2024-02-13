import express from 'express'
import catchAsyncErrors from "./../middleware/catchAsyncErrors.js"
import Chat from '../models/Chat.js';
import { verifyJWT } from '../middleware/verifyJWT.js';
import Message from '../models/Message.js';
import { User } from '../models/User.js';

const router = express.Router();

// Chat - Create Conversation
router.post("/create-new-conversation", verifyJWT, catchAsyncErrors( async (req, res) => {

    // console.log(`create-new-conversation req.body`,req.body)
    // console.log("value of req.user", req.user)
    const { chatName, user, report_type, admin_id } = req.body

    let opposite_user

    console.log(opposite_user)

    let users = []
    let client_user
    let admin_user
    
    const isChatExist = await Chat.findOne({ chatName });

    if (isChatExist) {
        const chat = isChatExist;
        res.status(201).json({
            success: true,
            chat,
        });
    } else {

        let opposite_user = await User.findOne({ "personal_info.uid": user })

        // if opposite_user is an admin
        if (opposite_user.personal_info.access === "Admin") {
            admin_user = opposite_user._id
            client_user = req.user
            users.push(admin_user, client_user)
        }
        // if opposite_user is a client
        else if (opposite_user.personal_info.access === "User") {
            client_user = opposite_user._id
            if (report_type === "MissingReport"){
                admin_user = admin_id
                console.log("MISSING REPORT ADMIN admin_id",admin_id)
            } else {
                console.log("FOUND REPORT ADMIN admin_id",admin_id)
                admin_user = req.user
            }
            users.push(admin_user, client_user)
        }

        let chat = new Chat({
            users,
            chatName,
        })
        
        chat.save()
            .then( async (chat) => {
                chat = await chat
                    .populate("users", "-personal_info.password, -personal_info.access, -token_version")
                    // .populate({
                    //     path: "lastSeenMessage",
                    //     populate: [
                    //         {
                    //             path: "user",
                    //             select: "-personal_info.password, -personal_info.access, -token_version",
                    //         },
                    //         {
                    //             path: "message",
                    //         },
                    //     ],
                    // });
                
                return res.status(201).json({
                    chat,
                });
            })
            .catch((err) => {
                console.log(err)
                return res.status(500).json({ error: err.message });
            });
    }

    return res.status(200)

}))

// Chat - Get Conversation
router.get("/get-conversation", verifyJWT, catchAsyncErrors( async (req, res) => {

    // console.log("req.user in get-conversation:", req.user)

    await Chat.find({
        users: { $in: [req.user], },
    })
    .populate('users', '-personal_info.password, -personal_info.access, -token_version')
    .populate({
        path: "latestMessage",
        populate: {
            path: "sender",
            select: "-personal_info.password, -personal_info.access, -token_version",
        },
    })
    .sort({ updatedAt: -1, createdAt: -1 })
    .then((chats) => {
        // console.log(chats)
        return res.status(200).json({ chats });
    })
    .catch((err) => {
        console.log(err)
        return res.status(500).json({ error: err.message });
    });

}))

// Chat - Update last seen message
router.put("/update-last-seen-message", verifyJWT, catchAsyncErrors( async (req, res) => {

    try {

        // console.log("req.user in update-last-seen-message:", req.user)
    
        const { chatId, messageId, messageText, messageImage } = req.body
    
        if (!chatId || !messageId) {
            return res.sendStatus(400);
        }
    
        // Find the chat and message
        const chat = await Chat.findById(chatId);
        const message = await Message.findById(messageId);
    
        if (!chat || !message) {
            return res.sendStatus(400);
        }
    
        // Check if the user is part of the chat
        if (!chat.users.includes(req.user)) {
            return res.sendStatus(403);
        }
    
        // Update the lastSeenMessage for the user in the chat
        const lastSeenMessageUser = chat.lastSeenMessage.findIndex(
            (item) => item.user.toString() === req.user);
    
    
        // console.log("lastSeenMessageUser: ",lastSeenMessageUser)

        if (lastSeenMessageUser !== -1) {
            // If the user already has a lastSeenMessage entry, update it
            chat.lastSeenMessage[lastSeenMessageUser].message = messageId;
            chat.lastSeenMessage[lastSeenMessageUser].timestamp = Date.now();
        } else {
            // If the user does not have a lastSeenMessage entry, add it
            chat.lastSeenMessage.push({
                user: req.user,
                message: messageId,
                timestamp: Date.now(),
            });
        }

        // console.log("Chat after update-last-seen-message:",chat)
    
         // Save the updated chat
        await chat.save();
        res.status(200).json(chat)

    } catch (error) {
        console.log("update-last-seen-message error:", error.message)
        return res.status(500).json({ error: error.message });
    }

    

}))

// Chat - Last Chat Seen
router.post("/last-chat-seen", verifyJWT, catchAsyncErrors( async (req, res) => {

    console.log("req.user", req.user)

    const { chatId } = req.body

    await User.findById(req.user)
        .then(async (user) => {
            
            if (!user.lastChatSeen) {
                user.lastChatSeen = chatId;
                await user.save();
                console.log(user)
                return res.status(200).json({ user });
            }

            user.lastChatSeen = chatId;
            await user.save();
            console.log("user", user);
            return res.status(200).json({ user });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: err.message });
        });
}))


export default router