import React, { useEffect, useState } from 'react'
import InPageNavigation from '../../../components/InPageNavigation';
import Loader from '../../../components/Loader';
import { getAccessToken } from '../../../common/userInfo';
import { Toaster, toast } from "react-hot-toast"
import axios from 'axios';
import { server } from '../../../server';
import ScrollableFeed from 'react-scrollable-feed';
import ReportPostCard from '../../../components/ReportPostCard';

const AdminUserInfo = ({ userId }) => {
    
    let [ loading, setLoading ] = useState(true);
    let [ profile, setProfile ] = useState();
    let [ userReports, setUserReports ] = useState();
    let [ selectedImage, setSelectedImage ] = useState(null);
    let [ oldImage, setOldImage ] = useState();
    let [itemFirstImage, setItemFirstImage] = useState()

    const access_token = getAccessToken()

    // Fetch the existing report data for editing
    const getUserData = async () => {
        try {
            await axios.get(`${server}/user/get-user-info/${userId}`,
            {
                withCredentials: true,
                headers: {
                    'authorization': `Bearer ${access_token}`
                }
            })
            .then(({ data: {user} }) => {
                
                // console.log("user",user)
                // console.log("user",user.personal_info)
                // console.log("personal_info.item_name",user.personal_info.item_name)

                setProfile(user);
                fetchReports()
                // console.log("user.user.images:", user.personal_info.pic)
                setLoading(false);
            })
        } catch (error) {
            console.error(error);
            toast.error('Error fetching user data');
            setLoading(false)
        }
    };


    const fetchReports = async () => {

        await axios.get(`${server}/report/get-all-reports-by-user/${userId}`, 
        {
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data: { reports } }) => {
            // console.log("reports", reports)
            setUserReports(reports)
        })
        .catch((err) => {
            // console.log(err)
            return null
        })
    };


    useEffect(() => {
        getUserData();

        // eslint-disable-next-line
    }, []);

    return (
        
        <ScrollableFeed>

            <div className='flex flex-col justify-center items-center w-full px-8'>
                <Toaster/>
                {/* <p>Hello</p> */}
                {
                loading ?
                    <Loader />
                    :
                    <>
                        {
                            profile ? 
                            <div className='flex flex-col justify-center items-center gap-3 min-w-[250px] md:w-[50%]  w-full'>
                                <img src={profile.personal_info.pic} alt="" className='w-48 h-48 bf-grey rounded-full md:w-32 md:h-32'/>
                                <p className='text-xl font-semibold'>{profile.personal_info.name}</p>
                                <p className='text-xl'>{profile.personal_info.uid}</p>
                                <p className='text-xl'>{profile.personal_info.email}</p>
                                <p className='text-xl'>{profile.personal_info.membership}</p>
                                <p className='text-xl'>{profile.personal_info.specification}</p>
                            </div>
                        :   
                            <Loader />
                        }

                        <div className='max-md:mt-12 w-full overflow-y-auto border-red-700'>
                            

                                <InPageNavigation routes={[ "Missing Reports", "Found Reports", "Claimed Reports"]} defaultHidden={["Found Reports", "Claimed Reports"]}>

                                    
                                    <>
                                        {
                                            userReports == null ? (
                                                <Loader />
                                            ) :
                                            // <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                            <ScrollableFeed>
                                                <div>
                                                    {
                                                        userReports
                                                        .filter(report => report.report_info.type === "MissingReport" && report.report_info.status !== "Claimed").length > 0 ? 
                                                            userReports
                                                                .filter(report => report.report_info.type === "MissingReport" && report.report_info.status !== "Claimed")
                                                                .map((report, i) => (
                                                                    <div key={i} className='cursor-pointer'>
                                                                        <ReportPostCard report={report} creator={profile}/>
                                                                    </div>
                                                                ))
                                                            : 
                                                            <div className="flex items-center justify-center h-full">
                                                                <p className="text-3xl">
                                                                    No missing reports yet.
                                                                </p>
                                                            </div>
                                                    }
                                                </div>
                                            </ScrollableFeed>
                                        }
                                    </>

                                    <>
                                        {
                                            userReports == null ? (
                                                <Loader />
                                            ) :
                                            // <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                            <ScrollableFeed>
                                                <div>
                                                    {
                                                        userReports
                                                        .filter(report => report.report_info.type === "FoundReport" && report.report_info.status !== "Claimed").length > 0 ? 
                                                            userReports
                                                                .filter(report => report.report_info.type === "FoundReport" && report.report_info.status !== "Claimed")
                                                                .map((report, i) => (
                                                                    <div key={i} className='cursor-pointer'>
                                                                        <ReportPostCard report={report} creator={profile}/>
                                                                    </div>
                                                                ))
                                                            : 
                                                            <div className="flex items-center justify-center h-full">
                                                                <p className="text-3xl">
                                                                    No found reports yet.
                                                                </p>
                                                            </div>
                                                    }
                                                </div>
                                            </ScrollableFeed>
                                        }
                                    </>

                                    <>
                                        {
                                            userReports == null ? (
                                                <Loader />
                                            ) :
                                            <ScrollableFeed>
                                                <div>
                                                    {
                                                        userReports.filter(report => report.report_info.status === "Claimed").length > 0 ? 
                                                            userReports
                                                                .filter(report => report.report_info.status === "Claimed")
                                                                .map((report, i) => (
                                                                    <div key={i} className='cursor-pointer'>
                                                                        <ReportPostCard report={report} creator={profile}/>
                                                                    </div>
                                                                ))
                                                            : 
                                                            <div className="flex items-center justify-center h-full">
                                                                <p className="text-3xl">
                                                                    No claimed reports yet.
                                                                </p>
                                                            </div>
                                                    }
                                                </div>
                                            </ScrollableFeed>
                                        }
                                    </>
                                </InPageNavigation>
                        </div>
                    </>
                }
            </div>
        </ScrollableFeed>
    )
}

export default AdminUserInfo