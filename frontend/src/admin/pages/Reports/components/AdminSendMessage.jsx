import React, { useContext, useEffect, useState } from 'react'
import InputBox from '../../../../components/InputBox'
import { server } from '../../../../server'
import axios from 'axios'
import { MessageContext } from '../../../../pages/Chat/MessagePage'
import { getAccessToken, getUserId, getUserInfo } from '../../../../common/userInfo'
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast'

const ENDPOINT = `${server}`
var socket, selectedChatCompare

const AdminSendMessage = ({ type, reportId, reportCreatorId, setReportCreatorId, reportCreatorUid, setReportCreatorUid, setOpen }) => {

    // let { 
    //     selectedChat, setSelectedChat, chats, setChats
    // } = useContext(MessageContext)

    
    let access_token = getAccessToken()
    let user_id = getUserId()
    let user_info = getUserInfo()
    const [ selectedChat, setSelectedChat] = useState()
    const [ chats, setChats ] = useState()
    const [socketConnected, setSocketConnected] = useState(false);
    const [hasRun, setHasRun] = useState(false);
    
    const [formData, setFormData] = useState({
        sender: user_id,
        text: '',
        // image: 'fadsfdsfadsfsadfsdas.jpg',
        image: '',
        chat: '',
        // ... other fields
    });

    const handleChange = (fieldName, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };


    const sendMessage = async (e) => {
    
        getChats()

        e.preventDefault()

        formData.chat = selectedChat._id

        console.log("formData.chat", formData.chat)
        console.log("formData.text", formData.text)
        console.log("formData.image", formData.image)
        console.log("user_id", user_id)

        if (formData.chat && (formData.text || formData.image)) {

            await axios.post(`${server}/message/new-message`,
            {
                text: formData.text,
                chatId: formData.chat,
                userId: user_id,
                image: formData.image
            },
            { 
                withCredentials: true,
                headers: {
                    'authorization': `Bearer ${access_token}`
                }
            })
            .then(async( { data: { message } }) => {
                
                await updateLastSeenMessage(message)
                
                // Clear the input box after sending the message
                setFormData((prevData) => ({
                    ...prevData,
                    text: '',
                    image: '',
                }));

                
                socket.emit("new message", message);
                toast.success(`Message sent successfully to ${reportCreatorUid}!`);
                // setMessages([...messages, message]);
                
                // setReportCreatorId(null)
                // setReportCreatorUid(null)
                setOpen(false)
            })
            .catch(err => {
                console.log(err)
            })
        }
    }


    const createChat = async () => {

        console.log("Admin",user_info.personal_info.uid)
        console.log("Admin",user_info.personal_info.name)
        console.log("User",reportCreatorUid)

        axios.post(`${server}/chat/create-new-conversation`, {
            chatName: `${user_info.personal_info.uid}_${reportCreatorUid}`,
            user: reportCreatorUid,
        }, {
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data: { chat } }) => {
            console.log('chat', chat);
            // toast.success('Chat conversation created successfully!');

            // setOpen(false)
            // window.location.reload(true); 
        })
        .catch(({ response }) => {
            console.log(response.data.error);
            toast.error(response.data.error);
        });

        
    }


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

            console.log("reportCreatorId",reportCreatorId)
            console.log("user_id",user_id)

            setChats(chats);

            // // Find the chat conversation where reportCreatorId and user_id are included as users
            // const chosenChat = chats.find(chat => chat.users.some(user => user.id === reportCreatorId) &&
            // chat.users.some(user => user.id === user_id));

            let filteredChats = chats.filter(chat => {
                let userIds = chat.users.map(user => user._id);
                return userIds.includes(reportCreatorId) && userIds.includes(user_id);
            });

            let chosenChat = filteredChats[0] // get the first chat that includes both users

            console.log("chosenChat",chosenChat)
            setSelectedChat(chosenChat);

        })
        .catch(err => {
            console.log(err.response)
        })
    }


    const updateLastSeenMessage = async (message) => {
        
        // console.log("updateLastSeenMessage message:", message)

        await axios.put(`${server}/chat/update-last-seen-message`,
        {
            chatId: selectedChat._id,
            messageId: message._id,
        },
        { 
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data: { chat } }) => {
            // console.log("updateLastSeenMessage chat",chat)
            // setLastMessage(chat.latestMessage)
        })
        .catch(err => {
            console.log(err.response)
        })
    }


    useEffect(() => {
    //     // console.log("selectedChat", selectedChat)
    //     // // console.log("selectedChat opposite user name", selectedChat && selectedChat.users.find(user => user !== user_id).personal_info.name)
    //     // console.log(user_id)
    //     // console.log("selectedChat opposite user name", selectedChat && selectedChat.users?.find(user => user._id !== user_id)?.personal_info.name)

    //     // if (inputRef.current) {
    //     //     inputRef.current.focus();
    //     // }

        // if (selectedChat && selectedChatCompare) {
        //     socket.emit("chat closed", selectedChatCompare);
        //     // console.log('chat closed')
        //     socket.emit("leave chat", selectedChatCompare);
        //     // console.log('leave chat')
        // }

    //     // fetchMessages();

    //     if (selectedChat && selectedChat.latestMessage) {
    //         updateLastSeenMessage(selectedChat.latestMessage);
    //     }

    //     if (socket) {
    //         socket.on("message recieved", (newMessageReceived) => {
    //             if (selectedChat && selectedChat._id === newMessageReceived.chat._id) {
    //                 // console.log(`newMessageReceived`,newMessageReceived)
    //                 setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
    //                 updateUser2LastSeenMessage(newMessageReceived);
    //             }
    //         });
    //     }
    
        return () => {
            if (socket) {
                socket.off("message recieved");
            }
        };

    //     // eslint-disable-next-line
    }, [selectedChat, socket]);

    useEffect(() => {

        if (!hasRun) {
            createChat();
            setHasRun(true);
        }
        getChats()

        // console.log(selectedChat, "selectedChat")
        socket = io(ENDPOINT);
        socket.emit("setup", user_id);
        socket.on("connected", () => setSocketConnected(true));
        // socket.on("typing", () => setIsTyping(true));
        // socket.on("stop typing", () => setIsTyping(false));
    
        // if (!selectedChat) {
        //     setSelectedChat(chats[0])
        //     // console.log('set chat[0] as selectedChat',{selectedChat})
        // };

        return () => {
            socket.disconnect();
        };

        // eslint-disable-next-line
    }, []);

    return (
        // <div className="flex flex-col justify-center items-center gap-10 border-8">
        <>
            <Toaster/>
            <form className="w-full flex flex-row justify-center items-center" onSubmit={sendMessage}>
                {/* <div className='w-full'> */}
                        <InputBox
                            type="text"
                            // className="w-[100%] rounded-md p-2 pl-12 border border-gray-300 bg-gray-300"
                            placeholder="Enter a message.."
                            label=""
                            name="text"
                            value={formData.text}
                            onChange={handleChange}
                            // onKeyDown={sendMessage}
                            // ref={inputRef}
                        />
                        <button className='flex items-center px-3 bg-gray-300 rounded send-icon
                        hover:bg-gray-400 transition duration-200' onClick={sendMessage} >
                            <i className='fi fi-sr-paper-plane-top 2xl block py-2 px-6 send-icon'></i>
                        </button>
                {/* </div> */}
            </form>
        </>
        // </div>
    )
}

export default AdminSendMessage