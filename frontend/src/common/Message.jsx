export const getSenderInfo = (chat, user_id) => {
    
    // console.log("chat", chat)

    const { sender_id, sender_name, sender_image } = chat
    if (sender_id === user_id) {
        return {
            id: sender_id,
            name: sender_name,
            image: sender_image
        }
    } else {
        return {
            id: sender_id,
            name: sender_name,
            image: sender_image
        }
    }
}

export const getSenderName = (chat, user_id) => {
    if (chat.users[0].toString() !== user_id) {
        return chat.users[0].personal_info.name;
    } else {
        return chat.users[1].personal_info.name;
    }
}

export const getSenderImage = (chat, user_id) => {
    if (chat.users[0].toString() !== user_id) {
        return chat.users[0].personal_info.pic;
    } else {
        return chat.users[1].personal_info.pic;
    }
}

export const getLatestMessage = (chat, user_id) => {

    // console.log("getLatestMessage chat:", chat)

    if (chat.latestMessage === null || chat.latestMessage === undefined) {
        return false
    } else {
        const matchedUser = chat.lastSeenMessage.filter((user) => {
            // console.log("user.user", user.user)
            return user.user === user_id
        })
        // console.log("matchedUser: ", matchedUser)
        if(matchedUser.length > 0) {
            // console.log("matchedUser[0].message", matchedUser[0].message)
            // console.log("chat.latestMessage._id", chat.latestMessage._id)
            return (matchedUser[0].message).toString() ===  (chat.latestMessage._id).toString()
        } else {
            return false
        }
    }
}