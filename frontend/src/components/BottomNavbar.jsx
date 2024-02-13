import React, { useContext } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'

const BottomNavbar = () => {

    let navigate = useNavigate()

    const { userAuth, userAuth: { access_token, profile_img } } = useContext(UserContext)

    return (
        <>
            <div className='flex flex-col lg:hidden h-[100vh] justify-center items-center'>

                <Outlet/>

                {/* <div className='z-10 sticky bottom-0 flex items-center gap-12 w-screen px-[5vw] py-5 h-[80px] border border-yellow-500 bg-primaryColor'> */}
                <div className='z-10 sticky bottom-0 flex items-center gap-12 w-screen px-[5vw] py-5 h-[8vh] border-8 border-yellow-500 bg-primaryColor'>
                    
                { 
                    access_token ? 
                        <>
                            <div className="flex w-full justify-around items-center">
                                <div className='flex flex-col justify-center items-center'>
                                    <Link to="/messages">
                                        <button>
                                            <i className='fi fi-sr-messages text-2xl block text-white'></i>
                                        </button>
                                    </Link>
                                    <span className="font-sans font-medium text-lg text-white">Messages</span>
                                </div>

                                <div className='flex flex-col justify-center items-center'>
                                    <Link to="/">
                                        <button>
                                            <i className='fi fi-sr-home text-2xl block text-white'></i>
                                        </button>
                                    </Link>
                                    <span className="font-sans font-medium text-lg text-white">Home</span>
                                </div>

                                <div className='flex flex-col justify-center items-center'>
                                    
                                    <Link to="/account">
                                        <button>
                                            <i className='fi fi-sr-user text-2xl block text-white'></i>
                                        </button>
                                    </Link>
                                    <span className="font-sans font-medium text-lg text-white">Account</span>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className="flex w-full justify-around items-center">
                                <div className='flex flex-col justify-center items-center'>
                                    <Link to="/login">
                                        <button>
                                            <i className='fi fi-sr-sign-in-alt text-2xl block text-white'></i>
                                        </button>
                                    </Link>
                                    <span className="font-sans font-medium text-lg text-white">Login</span>
                                    {/* <Link to="/login" className='btn-navbar py-2 font-bold'>
                                        Login
                                    </Link> */}
                                </div>

                                <div className='flex flex-col justify-center items-center'>
                                    <Link to="/register">
                                        <button>
                                            <i className='fi fi-sr-clipboard-list text-2xl block text-white'></i>
                                        </button>
                                    </Link>
                                    <span className="font-sans font-medium text-lg text-white">Register</span>
                                    {/* <Link to="/register" className='btn-navbar py-2 hidden md:block font-bold'>
                                        Register
                                    </Link> */}
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default BottomNavbar