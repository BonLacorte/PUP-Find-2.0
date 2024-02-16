import React, { useContext, useEffect } from 'react'
import { MessageContext } from './MessagePage'
import { getAccessToken, getUserId, getUserInfo } from '../../common/userInfo'
import { useState } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { server } from '../../server'
import axios from 'axios'

const UserInfo = () => {
    
    let { 
        selectedChat, setSelectedChat, chats, setChats
    } = useContext(MessageContext)

    const access_token = getAccessToken()
    const user_info = getUserInfo()
    const user_id = getUserId()
    const opposite_user_info = selectedChat ? selectedChat.users.filter(user => user._id !== user_id)[0] : null
    const [userReports,setUserReports] = useState()
    let user_reports

    useEffect(() => { 
        const fetchReports = async () => {

            let get_reports_user_id

            if (user_info.personal_info.access === "Admin") {
                get_reports_user_id = opposite_user_info._id
            } else {
                get_reports_user_id = user_id
            }

            await axios.get(`${server}/report/get-all-reports-by-user/${get_reports_user_id}`, 
            {
                withCredentials: true,
                headers: {
                    'authorization': `Bearer ${access_token}`
                }
            })
            .then(({ data: { reports } }) => {
                console.log("reports", reports)
                setUserReports(reports)
            })
            .catch((err) => {
                console.log(err)
                return null
            })
        }

        if (selectedChat) {
            fetchReports()
        }
        

        

    }, [ selectedChat])

    
    const [missingReportActiveTab, setMissingReportActiveTab] = useState()
    const [foundReportActiveTab, setFoundReportActiveTab] = useState()

    

    const toggleMissingReportTab = (tab) => {
        if (missingReportActiveTab === tab) {
            setMissingReportActiveTab(0);
        } else {
            setMissingReportActiveTab(tab);
        }
    };

    const toggleFoundReportTab = (tab) => {
        if (foundReportActiveTab === tab) {
            setFoundReportActiveTab(0);
        } else {
            setFoundReportActiveTab(tab);
        }
    };

    return (

        // <div>hello</div>

        <>
            
            {selectedChat ? (
                <div className='flex flex-col justify-center items-center'>
                    <div className="pb-3 px-3 flex justify-center w-full">
                        <h1 className="text-3xl font-bold text-center text-primaryColor">Chat Information</h1>
                    </div>

                    <div className="">
                        {opposite_user_info ? (
                            <div className="flex flex-col p-3 border-gray-300 gap-10">
                                
                                <div className="flex flex-col items-center my-2">
                                    
                                    <img src={opposite_user_info.personal_info.pic} className='w-[100px] h-[100px] rounded-full border-gray-300' alt="" />
                                    
                                    <div className="mt-2 flex flex-col items-center ">
                                        <p className="font-semibold">{opposite_user_info.personal_info.name}</p>
                                        
                                        {
                                            opposite_user_info.admin_info ? 
                                            <div className='flex-start'>
                                                <p className="font-semibold">Office:</p>
                                                <p>{opposite_user_info.admin_info.office_location}</p>
                                            </div>
                                            : null
                                        }

                                        {
                                            opposite_user_info.personal_info.access !== "Admin" ? 
                                            <>
                                                <div className='flex-start'>
                                                    <p>{opposite_user_info.personal_info.uid}</p>
                                                </div>
                                                <div className='flex-start'>
                                                    <p>{opposite_user_info.personal_info.email}</p>
                                                </div>
                                                <div className='flex-start'>
                                                    <p>{opposite_user_info.personal_info.membership}</p>
                                                </div>
                                                <div className='flex-start'>
                                                    <p>{opposite_user_info.personal_info.specification}</p>
                                                </div>
                                            </>
                                            : null
                                        }
                                    </div>

                                </div>
                                
                                <div className="flex flex-col gap-10  border-blue-500">
                                    
                                    <p className="font-bold mb-2">Reports</p>
                                    
                                    <div>
                                        <p className="font-bold mb-2">Missing Reports</p>
                                        { userReports ?
                                            
                                            <div className="overflow-y-auto max-h-[180px] mb-4 border-blue-500">
                                            
                                                <ScrollableFeed>

                                                    <div className="mx-auto space-y-4">
                                                        {userReports.filter(report => report.report_info.type === "MissingReport").length > 0 ? (
                                                            userReports.map((report, index) => (
                                                                report.report_info.type === "MissingReport" && (
                                                                    <>
                                                                        <button
                                                                            className="flex items-center justify-between w-full"
                                                                            onClick={() => toggleMissingReportTab(index + 1)}
                                                                            key={report._id}
                                                                        >
                                                                            <span className="text-lg font-medium text-gray-900">
                                                                                {report.report_info.item_name}
                                                                            </span>
                                                                            {missingReportActiveTab === index + 1 ? (
                                                                                <svg
                                                                                    className="h-6 w-6 text-gray-500"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    stroke="currentColor"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth={2}
                                                                                        d="M6 18L18 6M6 6l12 12"
                                                                                    />
                                                                                </svg>
                                                                            ) : (
                                                                                <svg
                                                                                    className="h-6 w-6 text-gray-500"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    stroke="currentColor"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth={2}
                                                                                        d="M9 5l7 7-7 7"
                                                                                    />
                                                                                </svg>
                                                                            )}
                                                                        </button>
                                                                        {missingReportActiveTab === index + 1 && (
                                                                            <div>
                                                                                <p className="font-semibold">Date lost:</p>
                                                                                <p>{new Date(report.report_info.date).toISOString().slice(0, 10)}</p>
                                                                                
                                                                                <p className="font-semibold">Possible lost at:</p>
                                                                                <p>{report.report_info.location}</p>

                                                                                <p className="font-semibold">Item Description:</p>
                                                                                <p className="text-base text-gray-500">
                                                                                    {report.report_info.description}
                                                                                </p>

                                                                                <div className="grid grid-cols-2 gap-4 py-2 mb-4">
                                                                                    {report.report_info.images ? report.report_info.images.map((image, index) => (
                                                                                        <img
                                                                                            key={index}
                                                                                            src={image}
                                                                                            alt={`Image of ${report.report_info.item_name}`}
                                                                                            className="w-40 h-30 object-contain"
                                                                                        />
                                                                                    ))
                                                                                    :
                                                                                    null }
                                                                                </div>

                                                                                <p className='w-max'>
                                                                                    {report.report_info.status === "Missing" 
                                                                                        ? 
                                                                                        <div className='px-2 border-2 border-red-500 font-semibold text-red-500 rounded-2xl'>
                                                                                            <p>Missing</p>
                                                                                        </div>
                                                                                        :
                                                                                        <div className='px-2 border-2 border-green-500 font-semibold text-green-500 rounded-2xl'>
                                                                                            <p>Claimed</p>
                                                                                        </div>
                                                                                    }
                                                                                </p>        
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )
                                                            ))
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full">
                                                                <p className="text-xl">
                                                                    No missing reports yet.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </ScrollableFeed>
                                            </div> 
                                            : 
                                            <div className="flex items-center justify-center h-full">
                                                <p className="text-xl">
                                                    No Missing Reports.
                                                </p>
                                            </div>
                                        }
                                    </div>
                                    
                                    <div>
                                        <p className="font-bold mb-2">Found Reports</p>
                                        { userReports ?
                                            
                                            <div className="overflow-y-auto max-h-[180px] mb-4 border-blue-500">
                                            
                                                <ScrollableFeed>

                                                <div className="mx-auto space-y-4">
                                                        {userReports.filter(report => report.report_info.type === "FoundReport").length > 0 ? (
                                                            userReports.map((report, index) => (
                                                                report.report_info.type === "FoundReport" && (
                                                            <>
                                                                <button
                                                                    className="flex items-center justify-between w-full"
                                                                    onClick={() => toggleMissingReportTab(index + 1)}
                                                                    key={report._id}
                                                                >
                                                                    <span className="text-lg font-medium text-gray-900">
                                                                        {report.report_info.item_name}
                                                                    </span>
                                                                    {missingReportActiveTab === index + 1 ? (
                                                                        <svg
                                                                            className="h-6 w-6 text-gray-500"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M6 18L18 6M6 6l12 12"
                                                                            />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg
                                                                            className="h-6 w-6 text-gray-500"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M9 5l7 7-7 7"
                                                                            />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                                {missingReportActiveTab === index + 1 && (
                                                                    <div>
                                                                        <p className="font-semibold">Date found:</p>
                                                                        <p>{new Date(report.report_info.date).toISOString().slice(0, 10)}</p>
                                                                        
                                                                        <p className="font-semibold">Found at:</p>
                                                                        <p>{report.report_info.location}</p>

                                                                        <p className="font-semibold">Item Description:</p>
                                                                        <p className="text-base text-gray-500">
                                                                            {report.report_info.description}
                                                                        </p>

                                                                        <div className="grid grid-cols-2 gap-4 py-2 mb-4">
                                                                            {report.report_info.images ? report.report_info.images.map((image, index) => (
                                                                                <img
                                                                                    key={index}
                                                                                    src={image}
                                                                                    alt={`Image of ${report.report_info.item_name}`}
                                                                                    className="w-40 h-30 object-contain"
                                                                                />
                                                                            ))
                                                                            :
                                                                            null }
                                                                        </div>

                                                                        <p className='w-max'>
                                                                            {report.report_info.status === "Processing" 
                                                                                ? 
                                                                                <div className='px-2 border-2 border-red-500 font-semibold text-red-500 rounded-2xl'>
                                                                                    <p>Processing</p>
                                                                                </div>
                                                                                : report.reportStatus === "Claimable" 
                                                                                ?
                                                                                <div className='px-2 border-2 border-blue-500 font-semibold text-blue-500 rounded-2xl'>
                                                                                    <p>Claimable</p>
                                                                                </div>
                                                                                :
                                                                                <div className='px-2 border-2 border-green-500 font-semibold text-green-500 rounded-2xl'>
                                                                                    <p>Claimed</p>
                                                                                </div>
                                                                            }
                                                                        </p>        
                                                                    </div>
                                                                )}
                                                            </>
                                                        )))
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full">
                                                                <p className="text-xl">
                                                                    No found reports yet.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </ScrollableFeed>
                                            </div> 
                                            : 
                                            <div className="flex items-center justify-center h-full">
                                                <p className="text-xl">
                                                    No Missing Reports.
                                                </p>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="p-3">No chat mate information available.</p>
                        )}
                    </div>
                </div>
            ) : 
            // (
            //     <div className="flex items-center justify-center h-full">
            //         <p className="text-xl">
            //             No chat selected.
            //         </p>
            //     </div>
            // )
                null
            }
        </>
    )
}

export default UserInfo