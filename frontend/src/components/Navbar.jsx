import React, { useContext, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import pupfind_word from '../imgs/pupfind_word.png'
import { UserContext } from '../App'
import { getAccessToken, getUserId,  } from '../common/userInfo'
import UserNavigationPanel from './UserNavigationPanel'

const Navbar = () => {

    // let navigate = useNavigate()

    // const { userAuth, userAuth: { access_token, profile_img } } = useContext(UserContext)
    const access_token = getAccessToken()
    const user_id = getUserId()
    const [ userNavPanel, setUserNavPanel ] = useState(false)

    const handleUserNavBar = () => {
        setUserNavPanel(currentVal => !currentVal)
    }

    return (
        <>
            
            
            <div className=''>

                <div className='z-10 sticky top-0 flex items-center gap-12 w-screen px-[5vw] py-5 h-[8vh] border-yellow-500 bg-primaryColor'>
                    
                    <div className='flex flex-row justify-between items-center min-w-full border-green-700'>
                        <Link to="/" className='flex'>
                            <img src={pupfind_word} className="px-6" alt="" />
                        </Link>

                        <div className='flex flex-row'>
                            { 
                                access_token && user_id ? 
                                <>

                                    {/* Responsive messages link */}
                                    <Link to="/messages" className='hidden md:block btn-navbar py-2 font-bold'>
                                        Messages
                                    </Link>

                                    {/* Mobile messages link */}
                                    <Link to="/messages" className='md:hidden'>
                                        <button>
                                            <i className='fi fi-sr-messages text-2xl block py-2 px-6 text-white'></i>
                                        </button>
                                    </Link>

                                    

                                    {/* Responsive account link */}
                                    <Link className='hidden md:block btn-navbar py-2 font-bold' onClick={handleUserNavBar}>                        
                                            Account
                                        {
                                            userNavPanel ? <UserNavigationPanel />
                                            : ""
                                        }
                                    </Link>
                                    {/* <Link to="/account" className='hidden md:block btn-navbar py-2 font-bold'>
                                        Account
                                    </Link> */}

                                    {/* Mobile account link */}
                                    <Link className='md:hidden' onClick={handleUserNavBar}>
                                        <button>
                                            <i className='fi fi-sr-user text-2xl block py-2 px-6 text-white'></i>
                                        </button>

                                        {
                                            userNavPanel ? <UserNavigationPanel />
                                            : ""
                                        }
                                    </Link>
                                </>
                                : 
                                <>
                                    {/* Responsive login link */}
                                    <Link to="/login" className='hidden md:block btn-navbar py-2 font-bold'>
                                        Login
                                    </Link>

                                    {/* Mobile login link */}
                                    <Link to="/login" className='md:hidden'>
                                        <button>
                                            <i className='fi fi-sr-sign-in-alt text-2xl block py-2 px-6 text-white'></i>
                                        </button>
                                    </Link>

                                    {/* Responsive register link */}
                                    <Link to="/register" className='hidden md:block btn-navbar py-2 font-bold'>
                                        Register
                                    </Link>

                                    {/* Mobile login link */}
                                    <Link to="/register" className='md:hidden'>
                                        <button>
                                            <i className='fi fi-sr-clipboard-list text-2xl block py-2 px-6 text-white'></i>
                                        </button>
                                    </Link>

                                </>
                            }
                        </div>
                    </div>
                </div>

                <div>
                    <Outlet/>
                </div>
            </div>
        </> 
    )
}

export default Navbar