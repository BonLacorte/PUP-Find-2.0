import React from 'react'
// import { getDay } from '../../common/date'
import { Link } from 'react-router-dom'

const ReportPostCard = ({ report, creator }) => {

    let { report_info: { report_id, item_name, images, date, location, description, status, type }, createdAt: publishedAt } = report
    let { personal_info: { name, pic } } = creator

    return (
        <>
            <div className='flex gap-8 items-center border-b border-grey pb-5 mb-4'>
                <div className='w-full'>
                    <div className='flex gap-2 items-center mb-7'>
                        <img src={pic} alt="" className='w-6 h-6 rounded-full'/>
                        <p className='line-clamp-1 font-semibold'>{name}</p>
                        {" "}●{" "}
                        <p className='min-w-fit'>{ new Date(publishedAt).toISOString().slice(0, 10) }</p>
                    </div>

                    <div className='gap-1 flex flex-col'>
                        <h1 className='text-2xl font-medium leading-7  sm:line-clamp-2'>{item_name}</h1>

                        <p className='text-xl leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>{description.length > 15 ? `${description.substring(0,30)}...` : description}</p>

                        {/* <div className='flex gap-4 mt-7'>
                            <span className='btn-light py-1 px-4'>{tags[0]}</span>
                            <span className='ml-3 flex items-center gap-2 text-dark-grey'></span>
                                <i className='fi fi-rr-heart text-xl'></i>
                                { total_likes }
                        </div> */}

                        <p className='w-max'>
                            { (type === "MissingReport" && status === "Missing") || (type === "FoundReport" && status === "Processing")
                                ? 
                                <div className='px-2 border-2 border-red-500 font-semibold text-red-500 rounded-2xl'>
                                    <p>{status === "Missing" ? "Missing" : "Processing"}</p>
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

                        

                </div>

                <div className='h-28 aspect-square bg-grey'>
                    {images[0] ?
                        <img src={images[0]} alt="" className='w-full h-full aspect-square object-cover'/>
                    :
                        <img src={"https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png"} alt="" className='w-full h-full aspect-square object-cover'/>
                    }
                </div>
            </div>
        </>
    )
}

export default ReportPostCard