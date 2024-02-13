import { Link, useNavigate } from "react-router-dom"
import { getAccessToken } from "../../common/userInfo";


const ChoicesPage = ({ type }) => {

    const navigate = useNavigate();
    const access_token = getAccessToken()

    return (
        
            access_token ? 
                <section className='flex flex-row items-end justify-center h-[90vh] border-green-700'>
                
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

                    {/* Left Div (Buttons and Info) */}
                    <div className="lg:w-[50%] h-full flex flex-col gap-4 items-center justify-center border-yellow-400 ">
                        <div className="gap-10 flex flex-col items-start border-orange-600">
                            <div className="flex flex-col gap-3 w-full items-start ">
                                <span className="text-2xl md:text-4xl font-semibold w-full">
                                    { 
                                        type == 'missing' ?
                                        'Looking for lost item?'
                                        : type == 'found' ?
                                        'Found an item?'
                                        : ''
                                    }
                                </span>
                                <span className="text-lg md:text-2xl mb-1 w-3/5">
                                    See the report process and navigate to Public Desk Information
                                </span>
                                <span className="text-lg md:text-2xl mb-1" id="LocatedIn">
                                    Located in:{" "}
                                </span>
                                {/* <button className="bg-secondaryColor flex flex-col justify-center items-center rounded-md py-2 px-4" onClick={navigate('/missing/locate')}> */}
                                <button 
                                    className="btn-secondary" 
                                    onClick={() => {
                                        if (type === "found") {
                                            navigate(`/found/locate`);
                                        } else if (type === "missing") {
                                            navigate(`/missing/locate`);
                                        }
                                    }}>
                                    {/* <Link to={'/missing/locate'} className="text-center text-sm md:text-lg font-semibold"> */}
                                        OPEN PUP MAP
                                    {/* </Link> */}
                                </button>
                                <span className="text-md md:text-xl w-3/5 md:w-full">
                                    Click this button to locate the public desk information
                                </span>
                            </div>
                            <div className="flex flex-col justify-between gap-4 w-full items-start">
                                <span className="text-2xl md:text-4xl font-semibold w-5/6">
                                    {
                                        type === "found" ?
                                        "Report found item"
                                        : "Report missing item"
                                    }
                                </span>
                                    <button className="btn-primary" 
                                        onClick={() => {
                                            if (type === "found") {
                                                navigate(`/found/new`);
                                            } else if (type === "missing") {
                                                navigate(`/missing/new`);
                                            }
                                        }}
                                    >
                                        {/* <Link to={'/missing/new'} className="text-center text-sm md:text-lg font-semibold text-white"> */}
                                                CONNECT
                                        {/* </Link> */}
                                    </button>
                                <div className="text-md md:text-xl w-3/5 md:w-full">
                                Click this button to ask for your missing item
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Div Design */}
                    <div className="lg:w-[50%] h-full flex justify-center items-center border-blue-700">
                        <div className="hidden lg:flex flex-row mb-4 gap-6 border-green-700">
                            <div className="flex flex-col mt-2 gap-px w-56 shrink-0 items-start">
                                <div className="relative flex flex-col ml-12 w-10 items-start">
                                <div className="w-8 h-10 bg-[url(https://file.rendit.io/n/mssh2EwLUCyml6gMVeHa.svg)] bg-cover bg-50%_50% bg-blend-normal bg-no-repeat absolute top-1 left-2 flex flex-row justify-end gap-1 items-start pt-3 px-px">
                                    <div className="flex flex-col gap-1 w-1 shrink-0 h-2 items-start">
                                    <img  alt=""  src="https://file.rendit.io/n/gsjmksQmjnOpgeCWpwAF.svg"className="w-1"/>
                                    <img  alt=""  src="https://file.rendit.io/n/OYhHjl7Ethx5w9CULRlL.svg"className="ml-px w-px"/>
                                    </div>
                                    <div className="relative flex flex-col mt-0 w-2 shrink-0 items-start">
                                    <img  alt=""  src="https://file.rendit.io/n/BteVpgRw88dHApcvFRi9.svg"className="w-px h-px absolute top-2 left-1"/>
                                    <img  alt=""  src="https://file.rendit.io/n/7CF2WlT7wKqBFZ36764N.svg"className="relative w-2"/>
                                    </div>
                                </div>
                                <img  alt=""
                                    src="https://file.rendit.io/n/D79EwfRWLVPhfhCP9cDv.svg"
                                    className="w-1 h-1 absolute top-5 left-1"
                                />
                                <img  alt=""
                                    src="https://file.rendit.io/n/YkuaUQysOzApKVHpxt3W.svg"
                                    className="relative w-10"
                                />
                                </div>
                                <div className="self-stretch relative flex flex-col items-end pt-1 pb-56">
                                <img  alt=""
                                    src="https://file.rendit.io/n/FnprJ0w38zWBTLc715wt.svg"
                                    className="w-32 h-64 absolute top-20 left-16"
                                />
                                <img  alt=""
                                    src="https://file.rendit.io/n/JFVaOThhr6rSuWebj0gO.svg"
                                    className="w-20 h-[240px] absolute top-20 left-6"
                                />
                                <img  alt=""
                                    src="https://file.rendit.io/n/Q4vL1q52p4RYdkOvpulU.svg"
                                    className="w-20 h-[108px] absolute top-0 left-6"
                                />
                                <img  alt=""
                                    src="https://file.rendit.io/n/cEjCRL0RYdxDKrSPzGwb.svg"
                                    className="w-6 h-56 absolute top-24 left-16"
                                />
                                <div className="w-3/5 h-24 bg-[url(https://file.rendit.io/n/VYsIoC2725HIyVXUo7Or.svg)] bg-cover bg-50%_50% bg-blend-normal bg-no-repeat absolute top-3 left-0 flex flex-col items-start pt-12 pb-10 pl-10">
                                    <img  alt=""
                                    src="https://file.rendit.io/n/WLrPhUIucM7Q4lWGWj15.svg"
                                    className="ml-2 w-8"
                                    />
                                </div>
                                <img  alt=""
                                    src="https://file.rendit.io/n/Jp7UtKD792KBeU0w5Q1y.svg"
                                    className="w-20 h-8 absolute top-24 left-6"
                                />
                                <img  alt=""
                                    src="https://file.rendit.io/n/T1BrK6GonjJTwmh3c4VR.svg"
                                    className="relative"
                                />
                                </div>
                            </div>
                            <div className="relative flex flex-col w-32 shrink-0 items-start pt-12 pb-56 px-5">
                                <div className="w-20 h-48 bg-[url(https://file.rendit.io/n/e2k7Y9xWWi3tyGCLSOyT.svg)] bg-cover bg-50%_50% bg-blend-normal bg-no-repeat absolute top-[114.357421875px] left-0 flex flex-col items-end pt-16 pb-20 pr-2">
                                <img  alt=""
                                    src="https://file.rendit.io/n/L2yXiXD9p4SBsVuVnJfj.svg"
                                    className="w-6"
                                />
                                </div>
                                <img  alt=""
                                src="https://file.rendit.io/n/sjxV3lxuNA8oy90Lqg8b.svg"
                                className="w-16 h-56 absolute top-32 left-12"
                                />
                                <div className="w-6 h-8 bg-[url(https://file.rendit.io/n/B6PuX9TgIrDY0vkDSH7C.svg)] bg-cover bg-50%_50% bg-blend-normal bg-no-repeat absolute top-1 left-16 flex flex-row gap-2 items-start pt-4 px-1">
                                <img  alt=""
                                    src="https://file.rendit.io/n/bkKmrE4XjtF5pq7isxcB.svg"
                                    className="w-px shrink-0"
                                />
                                <img  alt=""
                                    src="https://file.rendit.io/n/ORdfgZG8hZWIZ5AX2SW0.svg"
                                    className="w-px shrink-0"
                                />
                                </div>
                                <img  alt=""
                                src="https://file.rendit.io/n/bX3KAXDw8W5IrIQe0NjY.svg"
                                className="w-6 h-4 absolute top-6 left-16"
                                />
                                <img  alt=""
                                src="https://file.rendit.io/n/nib95KvgFCHtqac4MfFa.svg"
                                className="w-3 h-3 absolute top-4 left-16"
                                />
                                <img  alt=""
                                src="https://file.rendit.io/n/EhqwWNkS4yusOobm1BwJ.svg"
                                className="w-20 h-24 absolute top-10 left-10"
                                />
                                <img  alt=""
                                src="https://file.rendit.io/n/qP7Q0XPMh7du0ZCVUL4e.svg"
                                className="w-6 h-[213px] absolute top-32 left-12"
                                />
                                <img  alt=""
                                src="https://file.rendit.io/n/a35Gk1Ajpxvh1q0M5z31.svg"
                                className="w-6 h-3 absolute top-2 left-16"
                                />
                                <img  alt=""
                                src="https://file.rendit.io/n/irZf6M0fSH9Ifik8kq9G.svg"
                                className="w-16 h-16 absolute top-0 left-16"
                                />
                                <img  alt=""
                                src="https://file.rendit.io/n/NAgbd4ZrKmB0PfAPhk5V.svg"
                                className="w-20 h-16 absolute top-16 left-12"
                                />
                                <img  alt=""
                                src="https://file.rendit.io/n/OKF6I4zUmuaYYV9wWrpj.svg"
                                className="relative w-10"
                                />
                            </div>
                        </div>

                    </div>
                </section>
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

export default ChoicesPage