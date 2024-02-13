import React, { useContext, useEffect, useRef, useState } from 'react'
import { MessageContext } from './MessagePage'
import { getAccessToken, getUserId, getUserInfo, } from '../../common/userInfo';
import { getSenderImage, getSenderName } from '../../common/Message';
import axios from 'axios';
import { server } from '../../server';
import Loader from '../../components/Loader';
import ScrollableChat from '../../components/ScrollableChat';
import { io } from 'socket.io-client';
import { uploadImage } from '../../common/cloudinary';
import InputBox from '../../components/InputBox';
import { Toaster, toast } from "react-hot-toast"
import MessageInfo from './MessageInfo';
import UserInfo from './UserInfo';
import ScrollableFeed from 'react-scrollable-feed';

const ENDPOINT = `${server}`
var socket, selectedChatCompare

const MessageConversation = () => {
    
    let { 
        selectedChat, setSelectedChat, chats, setChats
    } = useContext(MessageContext)
    let sendImageRef = useRef()
    let sampleImage = "https://res.cloudinary.com/dkzlw5aub/image/upload/v1706771844/blog/a7ca5uy9xmhvs55yxq3w.jpg"

    const access_token = getAccessToken()
    const user_id = getUserId()
    const user_info = getUserInfo()

    // const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [lastMessage, setLastMessage] = useState()
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [newImage, setNewImage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [openChatInfo, setOpenChatInfo] = useState(false);
    const [open, setOpen] = useState(false);
    const inputRef = useRef(null);

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

    useEffect(() => {
        // console.log(selectedChat, "selectedChat")
        socket = io(ENDPOINT);
        socket.emit("setup", user_id);
        socket.on("connected", () => setSocketConnected(true));
        // socket.on("typing", () => setIsTyping(true));
        // socket.on("stop typing", () => setIsTyping(false));
    
        if (!selectedChat) {
            setSelectedChat(chats[0])
            // console.log('set chat[0] as selectedChat',{selectedChat})
        };

        return () => {
            socket.disconnect();
        };

        // eslint-disable-next-line
    }, []);


    useEffect(() => {

        // console.log("selectedChat", selectedChat)
        // // console.log("selectedChat opposite user name", selectedChat && selectedChat.users.find(user => user !== user_id).personal_info.name)
        // console.log(user_id)
        // console.log("selectedChat opposite user name", selectedChat && selectedChat.users?.find(user => user._id !== user_id)?.personal_info.name)

        if (inputRef.current) {
            inputRef.current.focus();
        }

        if (selectedChat && selectedChatCompare) {
            socket.emit("chat closed", selectedChatCompare);
            // console.log('chat closed')
            socket.emit("leave chat", selectedChatCompare);
            // console.log('leave chat')
        }

        fetchMessages();

        if (selectedChat && selectedChat.latestMessage) {
            updateLastSeenMessage(selectedChat.latestMessage);
        }

        if (socket) {
            socket.on("message recieved", (newMessageReceived) => {
                if (selectedChat && selectedChat._id === newMessageReceived.chat._id) {
                    // console.log(`newMessageReceived`,newMessageReceived)
                    setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
                    updateUser2LastSeenMessage(newMessageReceived);
                }
            });
        }
    
        return () => {
            if (socket) {
                socket.off("message recieved");
            }
        };

        // eslint-disable-next-line
    }, [selectedChat, socket]);

    
    const fetchMessages = async () => {
        if (selectedChat) {
            setLoading(true);
        
            // console.log(selectedChat._id)

            await axios.get(`${server}/message/get-all-messages/${selectedChat._id}`,
            { 
                withCredentials: true,
                headers: {
                    'authorization': `Bearer ${access_token}`
                }
            })
            .then(({ data: { messages } }) => {
                // console.log("messages",messages)
                
                setMessages(messages);
                setLoading(false);
                
                socket.emit("join chat", selectedChat._id);
            })
            .catch(err => {
                console.log(err.response)
            })

        } else {
            return
        }
    }

    
    const sendMessage = async (e) => {
    
        e.preventDefault()


        formData.chat = selectedChat._id

        // console.log(formData)
        if (formData.chat && (formData.text && formData.image)) {
            toast.error("You can only send either a text or an image at a time")
            return
        }

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
                setMessages([...messages, message]);

            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    const handleImageUpload = async (e) => {

        let img = e.target.files[0]

        if (img) {

            let loadingToast = toast.loading('Uploading...');

            // Iterate through the selected file
            uploadImage(img)
            .then((imgUrl) => {

                // console.log(imgUrl)

                if(imgUrl) {

                    setFormData((prevData) => ({
                        ...prevData,
                        image: imgUrl,
                    }));

                    // console.log(`On the upload image function: `, imgUrl)
                    toast.dismiss(loadingToast)
                    toast.success("Uploaded")
                    // sendImageRef.current.src = imgUrl

                    // formData.pic = imgUrl

                    // console.log("avatar1", avatar)
                }
            })
            .catch(err => {
                toast.dismiss(loadingToast)
                console.log(err)
                return toast.error(err)
            })
        }

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

    const updateUser2LastSeenMessage = async (newMessageReceived) => {

            await axios.post(`${server}/chat/update-last-seen-message`,
            {
                chatId: newMessageReceived.chat._id,
                messageId: newMessageReceived._id,
            },
            { 
                withCredentials: true,
                headers: {
                    'authorization': `Bearer ${access_token}`
                }
            })
            .then(({ data: { chat } }) => {
                // console.log("chat",chat)
                // setLastMessage(chat.latestMessage)
            })
            .catch(err => {
                console.log(err.response)
            })
    };

    return (
        <>
            <Toaster />

            {/* <div className='border border-blue-700'>MessageConversation</div> */}
            {/* <div className={`${selectedChat ? 'flex' : 'hidden'} lg:flex flex-col p-3 bg-white w-full lg:w-3/5 rounded-lg border border-gray-300 `}> */}
            <div className={`${selectedChat ? 'flex' : 'hidden'} lg:flex flex-col p-3 bg-white w-full lg:w-3/5 rounded-lg ' `}>

                {
                    chats.length > 0 && selectedChat ? 
                    (
                        <div className={'h-['+
                        ( user_info.personal_info.access === "Admin" ? 
                            "95vh"
                            :
                            "100%"
                        )+']'}>
                            <div className='flex items-center justify-between py-4 px-2 w-full border-violet-500 '>
                            {/* <div className={`md:${selectedChat ? 'hidden' : 'hidden' }flex items-center justify-between pb-3 px-2 w-full`}> */}
                                <button
                                    className='lg:hidden'
                                    onClick={() => setSelectedChat("")}
                                >
                                    {/* <FontAwesomeIcon icon={faArrowLeft} /> */}
                                    <i className='fi fi-sr-arrow-left block py-2 px-6'></i>
                                </button>
                                
                                <div className='flex flex-row justify-between w-full'>

                                    <div className='flex flex-row items-center hover:bg-gray-400 cursor-pointer p-2 rounded-lg'>
                                        <img src={selectedChat.users && selectedChat.users.find(user => user._id !== user_id).personal_info.pic} alt="" className="w-10 h-10 rounded-full mr-2"/>
                                        <b>{selectedChat.users && selectedChat.users.find(user => user._id !== user_id).personal_info.name}</b>
                                    </div>

                                    <div className='lg:hidden flex flex-row items-center hover:bg-gray-400 cursor-pointer p-2 rounded-lg' onClick={() => setOpen(true)}>
                                                {/* <i className="rounded-md fi fi-sr-add-image text-2xl block pt-2 px-3 text-black border border-gray-300 bg-gray-300"></i> */}
                                                <i className="rounded-full fi fi-sr-info text-2xl block pt-2 px-3 text-black border border-gray-300 bg-gray-300"></i>

                                    </div>

                                </div>
                            </div>
                            
                            <div className={'flex flex-col justify-end p-3 w-full h-['+
                            ( user_info.personal_info.access === "Admin" ? 
                                "90vh"
                                :
                                "80vh"
                            )+'] rounded-lg overflow-hidden  border-red-700'}>
                                {loading ? (
                                    // <div className="self-center">
                                    //     <Loader/>
                                    // </div>
                                    null
                                ) : (
                                    <div className="flex flex-col overflow-y-auto border-red-700">
                                        <ScrollableChat messages={messages} />
                                    </div>
                                )}

                                {formData.image && ( 
                                <div className="grid gap-4 py-3 px-3 justify-end border-gray-300 border rounded-md">
                                    
                                    

                                        <div className="relative">
                                            <img className="w-40 h-30 object-contain" src={formData.image} alt="Image" />
                                            <button
                                                className="absolute top-0 right-0 px-2 rounded-full text-2xl hover:bg-red-600 transition duration-200"
                                                onClick={() => setFormData({ ...formData, image: '' })}
                                            >
                                                <i className="fi fi-sr-cross-circle"></i>
                                            </button>
                                        </div>

                                    

                                    {/* {sampleImage && (

                                        <div className="relative">
                                            <img className="w-40 h-30 object-contain rounded-md" src={sampleImage} alt="Image" />
                                            <button
                                                className="absolute top-0 right-0 px-2 rounded-full text-2xl hover:bg-red-600 transition duration-200"
                                                onClick={() => setFormData({ ...formData, image: '' })}
                                            >
                                                <i className="fi fi-sr-cross-circle"></i>
                                            </button>
                                        </div>

                                    )} */}
                                    
                                </div>
                                )}

                                <form className="w-full flex flex-row mt-3 gap-2" onSubmit={sendMessage}>

                                    <div className="">
                                        <input
                                            type="file"
                                            name=""
                                            id="image"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                        <label htmlFor="image">
                                            <i className="rounded-md fi fi-sr-add-image text-2xl block pt-2 px-3 text-black border border-gray-300 bg-gray-300"></i>
                                        </label>
                                    </div>

                                    <div className='w-full'>
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
                                    </div>
                                    <button className='flex items-center px-3 bg-gray-300 rounded send-icon
                                    hover:bg-gray-400 transition duration-200' onClick={sendMessage} >
                                        <i className='fi fi-sr-paper-plane-top 2xl block py-2 px-6 send-icon'></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    )  
                    : chats.length > 0 && !selectedChat ? 
                    (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-3xl pb-3 font-work-sans">
                                Click on a user to start chatting
                            </p>
                        </div>
                    )
                    : chats.length === 0 && !selectedChat && user_info.personal_info.access != 'Admin' ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <p className="text-2xl pb-3 font-work-sans">
                                The conversation with admin feature is only available after creating a report.
                            </p>
                        </div>
                    )
                    : chats.length === 0 && user_info.personal_info.access === 'Admin' ?
                    (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <p className="text-2xl font-work-sans text-center">
                                No conversations created yet for this admin account.
                            </p>
                        </div>
                    ) 
                    :
                    (
                        <div className="flex items-center justify-center h-full">
                            <Loader/>
                        </div>
                    )
                }
            </div>
            {
                open && (
                    <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center rounded-xl border-8 border-red-700">
                        <div className='justify-center items-center w-[80%] lg:w-[100%] bg-white rounded-3xl shadow p-4 overflow-hidden'>
                            <div className="w-full flex justify-end">
                                <i
                                    className="fi fi-br-cross text-2xl cursor-pointer"
                                    onClick={() => setOpen(false)}
                                ></i>
                            </div>

                            <div className="flex flex-col overflow-y-auto h-[60vh] pb-4">
                                <ScrollableFeed>
                                    <UserInfo/>
                                </ScrollableFeed>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default MessageConversation