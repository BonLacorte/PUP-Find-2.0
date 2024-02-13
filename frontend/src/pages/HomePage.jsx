import React, { createContext, useContext, useEffect, useState } from 'react'
import front from '../imgs/front.png'
import { Toaster, toast } from 'react-hot-toast'
import { UserContext } from '../App'
import { useNavigate } from 'react-router-dom'
import { getAccessToken } from '../common/userInfo'

export const reportStructure = {
    item_name: '',
    image: [],
    date: '',
    location: '',
    description: '',
    creator: { personal_info: { } },
    status: '',
    type: '',
}

export const ReportContext = createContext({ })

const HomePage = () => {
    
    const [ report, setReport ] = useState(reportStructure)
    
    let { item_name, image, date, description, location, status, type, creator: { personal_info: { name: author_name, pic, email } } } = report
    // let { setUserAuth, userAuth: { access_token }, user , setUser } = useContext(UserContext)
    const access_token = getAccessToken()

    let navigate = useNavigate();

    // useEffect(() => {
    //     window.location.reload()
    // }, [])

    const handleCreateReport = (reportType) => {
        if(!access_token) {
            toast.error("Login first to create a report")

            // setTimeout(() => {
            //     navigate("/login")
            // }, 3000)
        } else {
            // Check reportType and navigate accordingly
            if (reportType === 'missing') {
                navigate('/missing');
            } else if (reportType === 'found') {
                navigate('/found');
            }
        }

        
    }

    return (
        <section className='flex flex-row items-center justify-center h-[80vh]  border-green-700'>

            <Toaster/>

            <div className="absolute  lg:flex flex-col left-0 bottom-0">
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

            <div className='flex flex-row justify-center items-center'>

                {/* Left Div (Logo and Images) */}
                <div className="flex-col lg:w-[50%] h-full items-center justify-center hidden lg:flex py-20 border-orange-700">
                    {/* <img alt="" src="https://file.rendit.io/n/6pqpGxjbbyM1B8AnjoDp.svg" className="w-[111px] h-40 absolute top-24 left-0"/> */}
                    <div className='border-blue-700'>
                        <img alt="" src={front} />
                    </div>
                    
                </div>
                <div>

                </div>

                {/* Right Div (Text and Buttons) */}
                <div className="flex flex-col lg:w-[50%] h-[100%] items-start justify-center px-4 lg:px-8 border-violet-700 z-10">
                    
                    <div className='lg:px-2 w-full border-blue-700'>
                        <div className="flex flex-col justify-end items-center pb-8  lg:pb-16">
                            <img alt="" src="https://file.rendit.io/n/033oE67RrtllAVLok4Ha.png"/>
                            <span className="text-4xl lg:text-9xl font-bold text-primaryColor">
                                PUPFind
                            </span>
                            <span className="text-center text-lg lg:text-3xl font-semibold text-primaryColor">
                                Find what's lost, surrender what's found
                            </span>
                        </div>
                        <div className="flex w-full flex-col lg:flex-row gap-5 items-center justify-center border-orange-700">
                            
                            <button className="bg-primaryColor btn-primary" onClick={() => handleCreateReport('missing')}>
                                CREATE MISSING REPORT
                            </button>
                        
                            <button className="btn-secondary" onClick={() => handleCreateReport('found')}>
                                CREATE FOUND REPORT
                            </button>
                            
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    )
}

export default HomePage