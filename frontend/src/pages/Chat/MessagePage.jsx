import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import Loader from '../../components/Loader'
import MessageList from './MessageList'
import MessageConversation from './MessageConversation'
import MessageInfo from './MessageInfo'
import axios from 'axios'
import { server } from '../../server'
import { getAccessToken, getUserInfo } from '../../common/userInfo'

export const MessageContext = createContext({})

const MessagePage = () => {

    // let { userAuth: { access_token, } } = useContext(UserContext)
    const access_token = getAccessToken()
    let user_info = getUserInfo()

    const [fetchAgain, setFetchAgain] = useState(false);
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)

    const getChats = async () => {
        
        await axios.get(`${server}/chat/get-conversation`,
        { 
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data: { chats } }) => {
            
            console.log("chats",chats)

            // Separate chats into two arrays: with latest message and without latest message
            const chatsWithLatestMessage = chats.filter(chat => chat.latestMessage);
            const chatsWithoutLatestMessage = chats.filter(chat => !chat.latestMessage);

            // Sort chats with latest messages based on updatedAt in descending order
            chatsWithLatestMessage.sort((a, b) => {
                const dateA = new Date(a.latestMessage.updatedAt)
                const dateB = new Date(b.latestMessage.updatedAt)
                return dateB - dateA
            });

            let sortedChats

            if ( user_info.personal_info.access === "Admin" ) {
                console.log("chatsWithLatestMessage", chatsWithLatestMessage)
                console.log("chatsWithoutLatestMessage", chatsWithoutLatestMessage)
                sortedChats = [...chatsWithLatestMessage]
            } else {
                sortedChats = chatsWithLatestMessage.concat(chatsWithoutLatestMessage)
            }

            // // Concatenate the two arrays, placing chats without latest messages at the end
            // const sortedChats = [...chats];
            
            // Add the two arrays together
            // sortedChats = chatsWithLatestMessage.concat(chatsWithoutLatestMessage);

            // Concatenate the two arrays, placing chats without latest messages at the end
            // const sortedChats = [chatsWithLatestMessage, chatsWithoutLatestMessage];

            // console.log(sortedChats, "sortedChats")

            setChats(sortedChats);

            // console.log("getChatsssssssssssssssssssss")

            setLoading(false)
            setSuccess(true)

        })
        .catch(err => {
            console.log(err.response)
        })
    }

    useEffect(() => {

        // console.log("access_token",access_token)

        

        getChats()

        // chats ? setIsSuccess(true) : setIsLoading(true)
        // // eslint-disable-next-line
        // window.location.reload(true);
    }, [access_token]);

    if (loading) {
        return <div className='flex justify-center items-center'><Loader/></div>
    }

    return (
        access_token ?
            chats  ?
            <>
                <MessageContext.Provider value={{selectedChat, setSelectedChat, chats, setChats, getChats}}>
                    <div 
                        className={'w-full h-['+
                        ( user_info.personal_info.access === "Admin" ? 
                            "100vh"
                            :
                            "90vh"
                        )+']  border-orange-700'}
                        // className='w-full h-[90vh] border-orange-700'
                    >
                        <div className='flex flex-col lg:flex-row '>
                            {/* <div className='hidden'> */}
                                <MessageList fetchAgain={fetchAgain}/>
                            {/* </div> */}
                            
                            <MessageConversation/>
                            
                            <MessageInfo />
                        </div>
                    </div>
                </MessageContext.Provider>
            </>
            :
            <div className="flex flex-col justify-center items-center h-screen gap-2">
                <p className="text-2xl font-bold text-center">{`You are not logged in`}</p>
                <button
                    className='bg-primaryColor text-white font-bold py-2 px-4 rounded mr-2'
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
            </div>
        :
        <div className="flex flex-col justify-center items-center h-screen gap-2">
            <p className="text-2xl font-bold text-center">{`You are not logged in`}</p>
            <button
                className='bg-primaryColor text-white font-bold py-2 px-4 rounded mr-2'
                onClick={() => navigate("/login")}
            >
                Login
            </button>
        </div>
    )
}

export default MessagePage