import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScrollableFeed from 'react-scrollable-feed'
import { getAccessToken, getUserId, getUserInfo, setAccessToken } from '../../common/userInfo'
import axios from 'axios'
import { server } from '../../server'
import { Toaster, toast } from "react-hot-toast"
import InPageNavigation from '../../components/InPageNavigation'
import Loader from '../../components/Loader'
import ReportPostCard from '../../components/ReportPostCard'
import AccountEdit from './AccountEdit'
import AccountReportInfo from './AccountReportInfo'

const AccountPage = () => {

    let [ profile, setProfile ] = useState()
    let [open, setOpen] = useState(false);
    let [ loading, setLoading ] = useState(true)
    let [ userReports, setUserReports ] = useState(null)
    let [ drawerTitle, setDrawerTitle ] = useState('')
    let [ chosen, setChosen ] = useState(null)
    let [ selectedImage, setSelectedImage ] = useState(null);
    let [ oldImage, setOldImage ] = useState("https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png");

    let access_token = getAccessToken()
    let user_info = getUserInfo()
    let user_id = getUserId()

    let navigate = useNavigate()

    useEffect(() => {
        if(userReports == null) {
            resetStates()
            fetchUserProfile()
        }

    }, [access_token, userReports,])

    const resetStates = () => {
        setProfile("")
        setLoading(true)
    }

    const fetchUserProfile = async () => {
        await axios.get(`${server}` + `/user/get-user-info/${user_id}`,
        {
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data: { user } }) => {
            console.log("AccountPage - user",user)
            console.log("AccountPage - user",user.personal_info.name)

            if(user != null) {
                setProfile(user)
            }
            setProfile(user)
            fetchReports({ user_id })
            setLoading(false)
        })
        .catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    const fetchReports = async () => {
        console.log(`user_id`, user_id)

        await axios.get(`${server}/report/get-all-reports-by-user/${user_id}`, 
        {
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data: { reports } }) => {
            console.log("reports", reports)
            console.log("user_info", user_info)
            console.log("profile", profile)
            setUserReports(reports)
        })
        .catch((err) => {
            console.log(err)
            return null
        })
    };


    const handleDrawer = (chosen, form_type) => {

        // console.log("handleDrawer report: ",report.id)

        if (chosen) {
            // setChosenReport(report.id)
            console.log(chosen)
        }

        if (form_type === 'report_info') {
            setDrawerTitle("Report Information")
            setChosen(chosen)
            console.log(form_type)
        } else if (form_type === 'edit') {
            setDrawerTitle('Edit Account')
            setChosen(chosen)
            console.log(form_type)
        } 

        setOpen(true)
    }


    const handleReportClick = (report) => {

        console.log("handleReportClick report: ",report)

        axios.get(`${server}/report/get-report-info/${report._id}`,
        {
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data: { report } }) => {
            console.log("get-user-by-creator-id - reportCreator", report.report_info.creatorId)
            setChosenReport(report)
            setOpen(true)
        })
        .catch((err) => {
            console.log(err)
            return null
        })
    }


    const handleEditProfile = () => {

        axios.get(`${server}/report/get-report-info/${report._id}`,
        {
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data: { report } }) => {
            console.log("get-user-by-creator-id - reportCreator", report.report_info.creatorId)
            setChosenReport(report)
            setOpen(true)
        })
        .catch((err) => {
            console.log(err)
            return null
        })

    }


    const logOutUser = (e) => {

        e.preventDefault()

        axios.post(`${server}/user/logout`, {}, { 
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        }).then( ({ data }) => {
            console.log(data)
            setAccessToken("")
            navigate("/")
        }).catch(err => {
            console.log(err.response)
        });
    }

    // console.log(user_info.personal_info, "user_info")

    return (
        access_token ? 
            profile ? (

                // <section className='flex justify-center items-center  border-green-700 h-screen max-w-full'>
                <section className='h-cover md:flex flex-row items-start gap-5 min-[1100px]:gap-12 border-blue-700'>

                    <Toaster/>
                    
                    <div className='flex flex-col items-center gap-3 lg:h-[90vh] min-w-[250px] md:w-[50%] md:pl-8 md:border-r-2  md:sticky md:top-[100px] md:py-10'>
                        <img src={profile.personal_info.pic} alt="" className='w-48 h-48 bf-grey rounded-full md:w-32 md:h-32'/>
                        <p className='text-xl font-semibold'>{profile.personal_info.name}</p>
                        <p className='text-xl'>{profile.personal_info.uid}</p>
                        <p className='text-xl'>{profile.personal_info.email}</p>
                        <p className='text-xl'>{profile.personal_info.membership}</p>
                        <p className='text-xl'>{profile.personal_info.specification}</p>
                        <button onClick={() => {handleDrawer( profile, "edit" )}} className='btn-primary'>Edit Profile</button>
                    </div>

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
                                                                <div key={i} className='cursor-pointer'
                                                                    onClick={() => handleDrawer(report, "report_info")}
                                                                >
                                                                    <ReportPostCard report={report} creator={profile}/>
                                                                </div>
                                                            ))
                                                        : 
                                                        <div className="flex items-center justify-center">
                                                            <p className="text-3xl">
                                                                No missing reports yet.
                                                            </p>
                                                        </div>
                                                }
                                            </div>
                                        </ScrollableFeed>
                                    }
                                    {/* <LoadMoreDataButton state={blogs} fetchDataFunction={getBlogs} /> */}
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
                                                                <div key={i} className='cursor-pointer' 
                                                                    onClick={() => handleDrawer(report, "report_info")}
                                                                >
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
                                        // <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                        
                                        userReports.filter(report => report.report_info.status === "Claimed").length > 0 ? 
                                        userReports
                                            .filter(report => report.report_info.status === "Claimed")
                                            .map((report, i) => (
                                                <div key={i} className='cursor-pointer'
                                                    onClick={() => handleDrawer(report, "report_info")}
                                                >
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
                                </>
                            </InPageNavigation>
                    </div>

                    {open && (
                        <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center rounded-lg">
                            <div className="justify-center items-center w-[80%] md:w-[80%] bg-white rounded-3xl shadow p-4 overflow-hidden">
                                <div className="w-full flex justify-end">
                                    <i
                                        className="fi fi-br-cross text-2xl cursor-pointer"
                                        onClick={() => setOpen(false)}
                                    ></i>
                                </div>

                                <h5 className="text-[30px] font-semibold text-center pb-4">
                                    {/* {reportInfo.report_info.type === "FoundReport" ? "Found Report" : "Missing Report"} */}
                                    {drawerTitle}
                                </h5>
                                
                                {
                                    drawerTitle === "Edit Account" ?
                                        <div className="flex flex-col overflow-y-auto h-[60vh] pb-4">
                                            <AccountEdit user={chosen} setOpen={setOpen} fetchUserProfile={fetchUserProfile}/>
                                        </div>
                                    : drawerTitle === "Report Information" ?
                                        <div className="flex flex-col overflow-y-auto h-[50vh] pb-4">
                                            <AccountReportInfo reportId={chosen._id} setOpen={setOpen}/>
                                        </div>
                                    : null
                                }
                            </div>
                        </div>
                    )}
                </section>
                
                )
                :
                (<Loader />)
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

export default AccountPage