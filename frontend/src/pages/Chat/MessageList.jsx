import React, { useContext, useEffect, useState } from 'react'
import { MessageContext } from './MessagePage'
import { UserContext } from '../../App'
import axios from 'axios'
import { io } from 'socket.io-client';
import { server } from '../../server'
import { getAccessToken, getUserId, getUserInfo, } from '../../common/userInfo';
import { getLatestMessage, getSenderImage, getSenderName } from '../../common/Message';

const ENDPOINT = `${server}`
var socket

const MessageList = ({ fetchAgain }) => {

    let { 
        selectedChat, setSelectedChat, chats, setChats, getChats
    } = useContext(MessageContext)
    
    const access_token = getAccessToken()
    const user_id = getUserId()
    const user_info = getUserInfo()
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user_id);
    }, [])

    useEffect(() => {
        getChats();
        // Other actions you want to perform when selectedChat changes
    }, [selectedChat]);
    

    useEffect(() => {
        
        if (socket) {
            socket.on("message recieved", (newMessageReceived) => {
                // console.log('message recieved newMessageReceived:', newMessageReceived)
                getChats()
            });
        }

        // real-time updating of ChatList's list of chat conversation's latest messages whether the user are online of not and whether the user is the sender of the latest message or not
        if (socket) {
            socket.on("update chat list", (newMessageReceived) => {
                getChats()
                // console.log(`update chat list newMessageReceived`,newMessageReceived)
                // console.log(`update chat list chats`,chats)
            });
        }
        return () => {
            // Remove the event listener when the component unmounts
            socket.off("update chat list");
            socket.off("message recieved");
        };
        // eslint-disable-next-line
    }, [socket])

    const handleClick = (id) => {
        navigate(`/dashboard-messages?${id}`);
        setOpen(true);
    };

    const handleChatClick = (clickedChat) => {
        setSelectedChat((prevSelectedChat) => {
            if (prevSelectedChat && prevSelectedChat._id === clickedChat._id) {
                return prevSelectedChat; // No change, do nothing
            } else {
                // Update the selected chat only if it's different from the previous value
                return clickedChat;
            }
        });
        getChats()
    };

    const convertUTCToLocalTime = (utcDateTimeString, offset) => {
        const utcDate = new Date(utcDateTimeString);
        const currentDate = new Date();

        // Calculate the time difference in milliseconds
        const timeDifference = currentDate - utcDate;

        // Helper function to format time units
        const formatTimeUnit = (value, unit) => {
            return `${value}${unit}`;
        };

        // Calculate time units (weeks, days, hours, minutes, seconds)
        const weeks = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));
        const days = Math.floor((timeDifference % (7 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
        const hours = Math.floor((timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);

        // Determine the appropriate format based on the time difference
        if (weeks > 0) {
            return formatTimeUnit(weeks, 'w');
        } else if (days > 0) {
            return formatTimeUnit(days, 'd');
        } else if (hours > 0) {
            return formatTimeUnit(hours, 'h');
        } else if (minutes > 0) {
            return formatTimeUnit(minutes, 'm');
        } else {
            return formatTimeUnit(seconds, 's');
        }
    }

    const updateLastSeenChat = async (chat) => {

        // console.log("updateLastSeenChat - value of chat:", chat)

        // console.log(selectedChat._id, "updateLastSeenChat - selectedChat._id")
        // console.log(chat._id, "updateLastSeenChat - chat._id")

        await axios.post(`${server}/chat/last-chat-seen`, {
            chatId: chat._id,
        }, {
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data: { user } }) => {
            // console.log("user", user)
            // console.log("look at the lastChatSeen:", user)
        })
        .catch(err => {
            console.log(err.response)
        })
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    const getSender = (users) => {
        return users.find(userId => userId.toString() !== user_id);
    }

    // filter chats based on search term
    const filteredChats = chats.filter(chat => {
        return chat.users.find(user => user._id !== user_id).personal_info.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <>
            <div className={`${selectedChat ? 'hidden' : 'flex'} lg:${selectedChat ? 'flex' : 'flex'} flex-col items-center p-3 bg-white lg:w-1/5  border-r-2 `}>
                <div className='w-full'>
                    <div className="pb-3 px-3 flex justify-center w-full">
                        <h1 className="text-3xl font-bold text-primaryColor">Messages</h1>
                    </div>
                    <div className="pb-3 flex justify-center items-center w-full">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="bg-gray-100 border-2 w-full px-2 py-1 rounded-lg"
                        />
                    </div>
                </div>

                {
                    chats.length > 0 ? (
                        
                        <div className="flex flex-col p-3 bg-gray-200 w-full h-full rounded-lg overflow-hidden">
                        {/* { filteredChats && chats.map((chat, index) => ( */}
                        { filteredChats.map((chat, index) => (
                            <div
                                key={chat._id}
                                onClick={() => {
                                    // getChats()
                                    // setSelectedChat(chat)
                                    // console.log("Message List",chat.users && chat.users.filter(user => user))
                                    // console.log(user_info, "user_info")
                                    console.log("Opposite User",chat.users && chat.users.filter(user => user._id !== user_id)[0].personal_info.pic)
                                    handleChatClick(chat)

                                }}
                                className={`cursor-pointer p-3 mb-2 rounded-lg ${selectedChat ? selectedChat._id === chat._id ? 'bg-primaryColor text-white' : 'bg-gray-300' : 'bg-gray-300'}
                                hover:bg-gray-400`}

                            >
                                <div className='flex flex-row'>
                                    
                                    <img src={chat.users && chat.users.filter(user => user._id !== user_id)[0].personal_info.pic} alt="" className="w-10 h-10 rounded-full mr-2"/>
                                    
                                    <div className='flex flex-col'>
                                        <div className="font-bold">
                                            
                                            {chat.users && chat.users.find(user => user._id !== user_id).personal_info.name}
                                        </div>
                                        {chat.latestMessage && (
                                            <div className="text-xs">
                                                {
                                                    chat.latestMessage 
                                                    ? 

                                                        // (getLatestMessage(chat, user_id) ? 
                                                        //     <p>True</p>
                                                        //     :
                                                        //     <p>False</p>
                                                        // )

                                                        // Check if the user saw the latest message
                                                        (getLatestMessage(chat, user_id) ? 
                                                            <div className='flex flex-row'>
                                                                <b>{chat.latestMessage.sender.personal_info.name}</b>:
                                                                { chat.latestMessage.text.length > 0 
                                                                    ?
                                                                    chat.latestMessage.text.length > 20 ? 
                                                                    <p>{chat.latestMessage.text.substring(0, 18) + '...'}</p>
                                                                        : <p>{chat.latestMessage.text}</p>
                                                                    :
                                                                    "Sent an image"
                                                                }
                                                                {" "}●{" "}
                                                                {convertUTCToLocalTime(chat.latestMessage.createdAt, 8)}
                                                            </div> 
                                                            // : null
                                                        
                                                        : 
                                                            <div className='flex flex-row'>
                                                                <b>{chat.latestMessage.sender.personal_info.name}</b>:
                                                                { chat.latestMessage.text.length > 0 
                                                                    ?
                                                                    chat.latestMessage.text.length > 20 ? 
                                                                        <b>{chat.latestMessage.text.substring(0, 18) + '...' }</b> 
                                                                        : <b>{chat.latestMessage.text}</b>
                                                                    :
                                                                    "Sent an image"
                                                                }
                                                                {" "}⬤{" "}
                                                                {convertUTCToLocalTime(chat.latestMessage.createdAt, 8)}
                                                            </div>
                                                        )

                                                        // <div className='flex flex-row'>
                                                        //     <b>{chat.latestMessage.sender.personal_info.name}   </b>:
                                                        //     { chat.latestMessage.text.length > 0 
                                                        //         ?
                                                        //         chat.latestMessage.text.length > 20 ? 
                                                        //             chat.latestMessage.text.substring(0, 18) + '...' 
                                                        //             : chat.latestMessage.text
                                                        //         :
                                                        //         "Sent an image"
                                                        //     }
                                                        //     {" "}●{" "}
                                                        //     {convertUTCToLocalTime(chat.latestMessage.createdAt, 8)}
                                                        // </div> 

                                                        :

                                                        <p>null</p>
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    )
                    :  chats.length === 0 && user_info.personal_info.access != 'Admin' ?
                    (
                        <div className="flex flex-col lg:hidden items-center justify-center h-full gap-4">
                            <p className="text-2xl font-work-sans text-center">
                                The conversation with admin feature is only available after creating a report.
                            </p>
                        </div>
                    )
                    : chats.length === 0 && user_info.personal_info.access === 'Admin' ?
                    (
                        <div className="flex flex-col lg:hidden items-center justify-center h-full gap-4">
                            <p className="text-2xl font-work-sans text-center">
                                No conversations created yet for this admin account.
                            </p>
                        </div>
                    )
                    : null
                }
            </div>
        </>
    )
}

export default MessageList