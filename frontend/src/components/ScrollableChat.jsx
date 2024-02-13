import React, { useEffect, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { user_id } from "../common/userInfo";

const ScrollableChat = ({ messages }) => {
    const [clickedMessageId, setClickedMessageId] = useState(null);
    const [messageDate, setMessageDate] = useState(null);

    const toggleMessageTimestamp = (messageId, senderId) => {
        if (clickedMessageId === messageId) {
            setClickedMessageId(null); // Hide timestamp if already clicked
        } else {
            setClickedMessageId(messageId);
        }
    };

    const [clickedMessageStyle, setClickedMessageStyle] = useState(null);

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            const lastMessageTime = new Date(lastMessage.createdAt).getTime();
            const currentDate = new Date();

            setMessageDate(
                new Date(lastMessage.createdAt).toLocaleDateString([], {
                    month: "short",
                    day: "2-digit",
                })
            );
        }
    }, [messages]);

    const renderMessages = () => {
        let prevMessageTimestamp = null;

        return messages.map((message, index) => {
            const currentTimestamp = new Date(message.createdAt).getTime();
            const showTimestamp =
                !prevMessageTimestamp ||
                currentTimestamp - prevMessageTimestamp >= 10 * 60 * 1000;

            prevMessageTimestamp = currentTimestamp;

            return (
                <React.Fragment key={message._id}>
                    {showTimestamp && (
                        <div className='w-full  border-green-500 flex items-center justify-center'>
                            <span className="text-xs text-gray-500 mb-1  border-orange-500">
                                {
                                new Date(message.createdAt).toLocaleDateString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
                                }
                            </span>
                        </div>
                    )}
                    <div
                        key={message._id}
                        className={`flex w-full my-2 ${
                            message.sender._id === user_id ? "justify-end" : "justify-start"
                        }`}
                    >
                        {message.sender._id !== user_id && (
                            <img src={`${message.sender.personal_info.pic}`} 
                            className="w-[40px] h-[40px] rounded-full mr-3" 
                            alt="" />
                        )}

                        { message.text.length > 0 ?
                            
                                <div>
                                    <div
                                        className={`w-max p-2 rounded ${
                                            message.sender === user_id ? "bg-[#000]" : "bg-[#38c776]"
                                        } text-[#fff] h-min`}
                                    >
                                        <p>{message.text}</p>
                                    </div>
        
                                    <p className="text-[12px] text-[#000000d3] pt-1">
                                        {/* {format(message.createdAt)} */}
                                    </p>
                                </div>
                            
                            :
                            
                                <img src={`${message.image}`}  className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] lg:w-[300px] lg:h-[300px] object-cover rounded-[10px] mr-2" alt="" />

                        }
                    </div>
                </React.Fragment>
            );
        });
    };

    return <ScrollableFeed>{renderMessages()}</ScrollableFeed>;
};

export default ScrollableChat;
