import React, { useState } from 'react';
import logo from '../../imgs/Redpupfind 4.png';
import miniLogo from './../../imgs/Redlogo 1.png';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { server } from "../../server"
import axios from "axios"
import { Toaster, toast } from "react-hot-toast"
import { getAccessToken, getUserInfo, setAccessToken } from "../../common/userInfo"

const AdminDashSidebar = () => {

    // const { userId, name, accessToken } = useAdminAuth()
    // const [isSubmitting, setIsSubmitting] = useState(false);
    // const navigate = useNavigate()

    // const [sendLogout, { isLoadingLogout, isSuccessLogout, isErrorLogout, errorLogout }] = useSendLogoutMutation();

    let access_token = getAccessToken()
    let user_info = getUserInfo()
    let navigate = useNavigate()

    const toggleLogout = (e) =>  {
        e.preventDefault()

        axios.post(`${server}/user/logout`, {}, { 
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        }).then( ({ data }) => {
            // console.log(data)
            setAccessToken("")
            navigate("/admin")
        }).catch(err => {
            // console.log(err.response)
            return toast.error(err)
        });
    }

    // Define the list of webpages for the sidebar
    const webpages = [
        { name: 'Home', path: '', icon: "home" },
        { name: 'Messages', path: 'messages', icon: "messages" },
        { name: 'Users', path: 'users', icon: "users" },
    ];

    // const location = useLocation();

    // return (
    //     <div className="w-full h-screen shadow-sm overflow-y-scroll sticky top-0 left-0 z-10 rounded-lg border">
    //     {/* <div className="w-1/6 h-screen p-4 border-r flex flex-col items-center justify-between border-red-700"> */}
    //         {/* <div className='w-full flex items-center p-4'> */}
    //             {/* <h2 className="text-xl font-bold mb-4 w-full flex flex-row">Admin Dashboard</h2> */}
    //             <div className='border-blue-700  flex justify-center'>
    //                 <img src={logo} alt="" className='hidden md:w-[100px] md:flex md:items-center md:p-4'/>
    //                 <img src={miniLogo} alt="" className='md:hidden h-[80px] w-[80px] flex items-center py-4'/>
    //             </div>
                
    //             <div className='w-full flex justify-center items-center px-4'>
    //                 <ul className='border-yellow-500 flex flex-col'>
    //                     {webpages.map((page, index) => (
                            
    //                             <Link
    //                                 to={`/admin/dash/${page.path}`}
    //                                 className={`${location.pathname === `/admin/dash/${page.path}` ? 'font-bold bg-yellow-100 w-full' : ''} flex flex-row w-full justify-center items-center px-4 hover:bg-yellow-100`}
    //                             >
    //                                 <li key={index} className="mb-1 h-14 w-full flex flex-row justify-start items-center border-blue-500 ">
    //                                     {/* <FontAwesomeIcon icon={page.icon} /> */}
    //                                     <div className='border-red-700'>
    //                                         {/* <img src={page.icon} alt="" className='flex '/> */}
    //                                         <FontAwesomeIcon icon={page.icon} size='xl'/>
    //                                     </div>
    //                                     <span className='ml-2 hidden md:flex'>{page.name}</span>
    //                                 </li>
    //                                 {/* <button
    //                                     className="flex justify-start items-center pl-4 text-sm w-full"
    //                                     role="menuitem"
    //                                     onClick={toggleLogout}
    //                                     >
    //                                         <div className="mb-1 gap-2 h-14 w-full flex flex-row items-center border-purple-500 hover:bg-yellow-100">
    //                                             <FontAwesomeIcon icon={faRightFromBracket} size='xl'/>
    //                                             <span className='ml-2 hidden md:flex'>Logout</span>
    //                                         </div>
    //                                 </button> */}
    //                             </Link>
                            
    //                     ))}
    //                     <button
    //                         className="flex justify-start items-center pl-4 text-sm w-full border-purple-500 hover:bg-yellow-100"
    //                         role="menuitem"
    //                         onClick={toggleLogout}
    //                         disabled={isSubmitting}
    //                         >
    //                             <div className="mb-1 gap-2 h-14 w-full flex flex-row items-center ">
    //                                 <FontAwesomeIcon icon={faRightFromBracket} size='xl'/>
    //                                 <span className='ml-2 hidden md:flex'>{isSubmitting ? 'Logging out...' : 'Logout'}</span>
    //                             </div>
    //                     </button>
    //                 </ul>
    //             </div>
    //     </div>
    // );



    return (
        <>
            <div className='flex flex-row w-screen  '>

                <div className="min-w-[80px] lg:min-w-[133px] shadow-sm sticky top-0 left-0 z-10 rounded-lg  border-green-700">
                    <div className="border-r h-[100vh] flex flex-col items-center border">
                        <div className='border-blue-700  flex justify-center'>
                            <img src={logo} alt="" className='hidden md:w-[100px] md:flex md:items-center md:p-4'/>
                            <img src={miniLogo} alt="" className='md:hidden h-[80px] w-[80px] flex items-center py-4'/>
                        </div>
                        
                        <div className='w-full flex justify-center items-center'>
                            <ul className='border-yellow-500 flex flex-col'>
                                {webpages.map((page, index) => (
                                    
                                        <Link
                                            key={index}
                                            to={`/admin/dash/${page.path}`}
                                            className={`${location.pathname === `/admin/dash/${page.path}` ? 'font-bold bg-yellow-100 w-full' : ''} flex flex-row w-full justify-center items-center hover:bg-yellow-100 px-2 lg:px-0`}
                                        >
                                            {/* <div className='flex justify-start'> */}

                                                <li key={index} className="mb-1 h-14 w-full flex flex-row justify-center lg:justify-start items-center  border-blue-500 ">
                                                    <i className={'fi fi-sr-' + page.icon + " text-2xl lg:block py-2 px-2 lg:px-4 text-black"}></i>
                                                    <span className='lg:ml-2 hidden lg:flex'>{page.name}</span>
                                                </li>
                                            {/* </div> */}
                                            
                                        </Link>
                                    
                                ))}
                                {
                                    access_token ? 
                                        <button
                                            className="mb-1 h-14 w-full flex flex-row justify-center lg:justify-start items-center  border-blue-500 "
                                            onClick={toggleLogout}
                                            >
                                                <div className='flex flex-row'>
                                                    <i className="fi fi-br-sign-out-alt text-2xl lg:block px-2 lg:px-4 text-black  items-center"></i>
                                                    <span className='lg:mx-2 hidden lg:flex'>Logout</span>
                                                </div>
                                        </button>
                                        :
                                        <button
                                            className="mb-1 gap-2 h-14 flex flex-row w-full items-center border-purple-500 hover:bg-yellow-100 px-2"
                                            onClick={() => navigate("/admin")}
                                            >
                                                <div className='flex flex-row'>
                                                    <i className="fi fi-br-sign-in-alt text-2xl block py-2 px-6 text-black  items-center"></i>
                                                    <span className='ml-2 hidden lg:flex lg:items-center'>Login</span>
                                                </div>
                                        </button>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                    

                <div className='w-[100%]'>
                    {
                        access_token ? 
                            
                            <Outlet/>
                            :
                            <div className="flex flex-col justify-center items-center h-screen gap-2">
                                <p className="text-2xl font-bold text-center">{`You are not logged in`}</p>
                                <button
                                    className='bg-primaryColor text-white font-bold py-2 px-4 rounded mr-2'
                                    onClick={() => navigate("/admin/login")}
                                >
                                    Login as Admin
                                </button>
                            </div>
                    }
                </div>
            </div>
        </>
    )
};

export default AdminDashSidebar;
