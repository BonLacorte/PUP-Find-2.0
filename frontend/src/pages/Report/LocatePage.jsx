import React, { useState } from 'react'
import map from '../../imgs/map.png'
// import Lightbox from '@seafile/react-image-lightbox';
// import '@seafile/react-image-lightbox';
import ImageZoom from "react-image-zooom";
import { useNavigate } from 'react-router-dom';
import { access_token, getAccessToken } from '../../common/userInfo';
import { Toaster, toast } from 'react-hot-toast'
import ScrollableFeed from 'react-scrollable-feed';

const LocatePage = ({ type }) => {

    const navigate = useNavigate()
    const access_token = getAccessToken()
    let [ open, setOpen ] = useState(false)
    // const after_report = location.search.split('after_report=')[1]
    const after_report = location.state
    const handleDrawer = () => {
        setOpen(!open)
    }

    console.log("type", type)
    console.log("after_report", after_report)

    return (
        access_token ?
        <>
            <Toaster />
            <section className='flex flex-col  items-center justify-center h-[90vh]  border-green-700 overflow-hidden'>

                <div className="absolute hidden lg:flex flex-col left-0 bottom-0">
                    <img alt="" src="https://file.rendit.io/n/d4pFfFHPbtM6Gj5j2YWE.svg" className="w-20 h-16 absolute top-64 left-0 z-0" />
                    <img alt="" src="https://file.rendit.io/n/KPfOZKCRuRSFGmey9AWj.svg" className="w-12 h-56 absolute top-24 left-0 z-0"/>
                    <img alt="" src="https://file.rendit.io/n/lnOSNwFIl9xHUHBhIDjt.svg" className="relative z-0"/>
                </div>
                
                <img alt="" src="https://file.rendit.io/n/6pqpGxjbbyM1B8AnjoDp.svg" className=" lg:flex w-[111px] h-40 absolute top-24 right-0"/>

                <div className="absolute  lg:flex flex-col w-56 items-start right-0 bottom-0 z-0">
                    <img alt="" src="https://file.rendit.io/n/AyZ958KVZDdkvBnClSIZ.svg" className="w-40 h-40 absolute top-16 left-16 z-0" id="Ellipse"/>
                    <img alt="" src="https://file.rendit.io/n/52Gyzn7j1eB4irdFrXjv.svg" className="w-32 h-[286px] absolute top-24 left-24 z-0" id="Ellipse1"/>
                    <img alt="" src="https://file.rendit.io/n/i41HWlHDYSfHPajsbj4O.svg" className="relative z-0" id="Ellipse2"/>
                </div>          

                <ScrollableFeed>

                    <div className='flex flex-col w-full justify-center items-center px-10 gap-2  border-red-700 overflow-y-auto '>
                        <div className="flex flex-row justify-center items-center lg:w-3/5  border-blue-700">
                            <div className="flex flex-col gap-4 items-center w-full border-yellow-700">
                                {/* <div className="flex flex-col gap-2 items-start"> */}
                                    <p className="text-2xl md:text-3xl font-semibold w-full">
                                        {/* { type == 'missing' ?  'Looking for lost item?' : 'Thank you for reporting found item' } */}
                                        { 
                                            type == 'missing' ?
                                            'Looking for lost item?'
                                            : type == 'found' ?
                                            'Found an item?'
                                            : ''
                                        }
                                    </p>
                                    <p className="text-lg md:text-xl mb-1 w-full">
                                        { type == 'missing' ? 'Create a missing item report and communicate with our admins for updates.' : 'Create a found item report and surrender the item to our admin offices.' }
                                    </p>
                                    <p className="text-lg md:text-xl mb-1 w-full">
                                        { 
                                            type == 'missing' ? 
                                            'The admins will message the user once a similar item were surrendered to the office through "Messages" tab. Admins may ask user some questions to verify the item descriptions from the missing report and will update the user to claim. To claim missing item proceed to Public Desk Information' 
                                            : 
                                            'User must surrender their found item to verify the created found report. If the found item were not surrendered to the admin then the found report will be invalid. User can communicate with the admin through "Messages" tab. To surrender found item please proceed to the Public Desk Office.' 
                                        }
                                    </p>
                                    <span className="text-lg md:text-xl mb-1 w-full">
                                        Located at: PUP A. Mabini (main) Campus, ground floor
                                    </span>
                                {/* </div> */}
                            </div>
                        </div>

                        <div className='flex flex-col justify-center items-center h-[50vh] border-blue-700 z-10 py-5'>
                            <img src={map} className='h-full' alt="" onClick={() => handleDrawer()}/>
                            <p className='pt-4'>*Click the photo to zoom</p>
                        </div>

                        <div className='flex justify-center items-center'>
                            <button
                                onClick={() => {
                                    if (type === "found") {
                                        navigate(`/found/`);
                                    } else if (type === "missing") {
                                        navigate(`/missing`);
                                    }
                                }}
                                className="btn-primary w-full z-10"
                            >
                                Go back
                            </button>
                        </div>
                    </div>
                    {
                        open && (
                            <div className="fixed top-0 left-0 w-full h-[90vh] bg-[#00000062] z-[20000] flex items-center justify-center rounded-xl">
                                <div className="w-[100%] lg:w-[50%] bg-white rounded-3xl shadow p-4 overflow-hidden">
                                    <div className="w-full flex justify-end">
                                        <i
                                            className="fi fi-br-cross text-2xl cursor-pointer"
                                            onClick={() => setOpen(false)}
                                        ></i>
                                    </div>

                                    {/* <h5 className="text-[30px] font-semibold text-center pb-4">
                                        {drawerTitle}
                                    </h5> */}

                                    <div className='flex flex-col justify-center items-center h-[50vh] border-blue-700 z-10'>
                                        <ImageZoom
                                            src={map}
                                            zoomPosition="original"
                                            zoomStyle={{ zIndex: 100 }}
                                            // width={500}
                                            // height={500}
                                        />
                                        <p className='pt-4'>*Click the photo to zoom</p>
                                    </div>

                                </div>
                            </div>
                        )
                    }
                </ScrollableFeed>

            </section>
        </>
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

export default LocatePage