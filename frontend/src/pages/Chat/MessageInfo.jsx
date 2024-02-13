import React, { useContext } from 'react'
import UserInfo from './UserInfo'
import { getAccessToken, getUserId, getUserInfo } from '../../common/userInfo'
import { MessageContext } from './MessagePage'

const  MessageInfo = () => {

    let { 
        selectedChat, setSelectedChat, chats, setChats
    } = useContext(MessageContext)

    const access_token = getAccessToken()
    const user_info = getUserInfo()
    const user_id = getUserId()

    return (
        <>
            <div className={`${selectedChat ? 'hidden' : 'flex'} lg:${selectedChat ? 'flex' : 'flex'} flex-col items-center p-3 bg-white lg:w-1/5 border-l border-gray-300`}>
                <UserInfo/>
            </div>
        </>
    )
}

export default MessageInfo