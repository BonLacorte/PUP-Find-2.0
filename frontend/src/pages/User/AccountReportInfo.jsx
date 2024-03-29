import React, { useEffect, useState } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import Loader from '../../components/Loader';
import { Toaster, toast } from "react-hot-toast"
import { server } from '../../server';
import axios from 'axios';
import { getAccessToken } from '../../common/userInfo';

const AccountReportInfo = ({ reportId }) => {

    // // console.log("report", report)

    let [loading, setLoading] = useState(true);
    let [report, setReport] = useState();

    let [ selectedImage, setSelectedImage ] = useState(null);
    let [ oldImage, setOldImage ] = useState();
    const [itemFirstImage, setItemFirstImage] = useState()

    let [ partnerSelectedImage, setPartnerSelectedImage ] = useState(null);
    let [ partnerOldImage, setPartnerOldImage ] = useState();
    let [ partnerItemFirstImage, setPartnerItemFirstImage] = useState()

    const access_token = getAccessToken()

    // Fetch the existing report data for editing
    const getReportData = async () => {
        try {
            await axios.get(`${server}/report/get-report-info/${reportId}`,
            {
                withCredentials: true,
                headers: {
                    'authorization': `Bearer ${access_token}`
                }
            })
            .then(({ data: {report} }) => {
                
                // console.log("report",report)
                // console.log("report_info",report.report_info)
                // console.log("report_info.item_name",report.report_info.item_name)

                setReport(report);
                // console.log("report.report_info.images:", report.report_info.images)
                setItemFirstImage(report.report_info.images === null || report.report_info.images === undefined || report.report_info.images.length === 0 ? 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png' : report.report_info.images[0])
                setOldImage(report.report_info.images === null || report.report_info.images === undefined || report.report_info.images.length === 0 ? [] : report.report_info.images)
                
                if (report.partner_report != null) {
                    setPartnerItemFirstImage(report.partner_report.report_info.images === null || report.partner_report.report_info.images === undefined || report.partner_report.report_info.images.length === 0 ? 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png' : report.partner_report.report_info.images[0])
                    setPartnerOldImage(report.partner_report.report_info.images === null || report.partner_report.report_info.images === undefined || report.partner_report.report_info.images.length === 0 ? [] : report.partner_report.report_info.images)
                }

            })
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching report data');
        }
    };

    useEffect(() => {
        getReportData();

        // eslint-disable-next-line
    }, []);

    return (
        <ScrollableFeed>
            {

                loading ? <Loader/> :
                <>
                    <Toaster/>
                        <div className=" rounded-lg flex flex-col lg:flex-row px-8">
                            <div className="w-full lg:w-1/2 p-4 lg:border-r border-gray-400">
                        
                                <div className='flex flex-col p-4 border-b border-gray-400 gap-2'>
                                    <p className='text-2xl font-bold'>{report.report_info.type === "MissingReport" ? "Missing Report" : "Found Report"}</p>
                                    <p className='text-2xl font-bold'>{report.report_info.item_name}</p>
                                    <p><span className="font-bold">{report.report_info.type === 'FoundReport' ? 'Date found:' : 'Date lost:'}</span> {new Date(report.report_info.date).toISOString().slice(0, 10)}</p>
                                    <p><span className="font-bold">{report.report_info.type === 'FoundReport' ? 'Found at:' : 'Possible lost at:'}</span> {report.report_info.location}</p>
                                    <p><span className="font-bold">Description:</span> {report.report_info.description}</p>
                                    <p><span className='font-bold'>Status:</span> {report.report_info.status}</p>
                                    {
                                        report.report_info.type === 'FoundReport' ?
                                            <p><span className='font-bold'>Office Surrendered:</span> {report.report_info.office_location_surrendered}</p>
                                        : null   
                                    }
                                </div>

                                <div className='p-4'>
                                    <div className='flex flex-row justify-between'>
                                        <p className="mb-2">
                                            <span className="font-bold">User Information:</span>
                                        </p>
                                    </div>
                                    <div className='flex flex-col lg:flex-row lg:items-start lg:justify-start items-center justify-center  gap-2'>
                                        <img
                                            src={report.report_info.creatorId.personal_info.pic}
                                            alt=""
                                            className="lg:w-12 lg:h-12 w-24 h-24 rounded-full border border-gray-400 cursor-pointer"
                                        />

                                        <div className='flex flex-col gap-2'>

                                            <div className='flex flex-col lg:flex-row'>

                                                <div className='flex flex-col mx-2 font-bold gap-2 text-center lg:text-start'>
                                                    <p>{report.report_info.creatorId.personal_info.name.length > 15 ? `${report.report_info.creatorId.personal_info.name.substring(0, 15)}...` : report.report_info.creatorId.personal_info.name}</p>
                                                    <p>{report.report_info.creatorId.personal_info.email.length > 15 ? `${report.report_info.creatorId.personal_info.email.substring(0, 15)}...` : report.report_info.creatorId.personal_info.email}</p>
                                                    <p>{report.report_info.creatorId.personal_info.uid}</p>
                                                </div>
                                                <div className='flex flex-col font-bold gap-2 text-center lg:text-start'>
                                                    <p>{report.report_info.creatorId.personal_info.membership}</p>
                                                    <p>{report.report_info.creatorId.personal_info.specification}</p>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 p-4 flex justify-center items-center flex-col ">
                                
                                <div className='h-80 w-full flex justify-center border border-gray-400'>
                                    {!selectedImage && (
                                    <div className='flex h-auto w-auto justify-center'>
                                        
                                        <img className="w-auto h-auto object-contain" src={ selectedImage } alt="" />
                                    </div>
                                    )}
                                    {selectedImage && (
                                    <div className='flex h-full w-full justify-center'>
                                        
                                        <img className="w-auto h-full object-contain" src={selectedImage} alt="Selected Product Preview" />
                                    </div>
                                    )}
                                </div>
                                
                                <div className='flex justify-center '>
                                    <div className="justify-between w-full grid grid-cols-3 gap-4">
                                    {oldImage !== null
                                    ?   oldImage.map((image, index) => (
                                        <img
                                            className="w-24 h-auto object-contain cursor-pointer border border-gray-400"
                                            key={index}
                                            src={image}
                                            alt="itemImage"
                                            onClick={() => setSelectedImage(image)}
                                        />
                                        ))
                                    : <img
                                        className="w-24 h-auto object-contain cursor-pointer border border-gray-400"
                                        src={oldImage}
                                        alt="itemImage"
                                    />}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            report.report_info.status === 'Claimed' ?
                                // <>
                                //     <p>Display Partner Report here</p>
                                // </>
                                    <div className=" rounded-lg flex flex-col lg:flex-row px-8">
                                        <div className="w-full lg:w-1/2 p-4 lg:border-r border-gray-400">
                                    
                                            <div className='flex flex-col p-4 border-b border-gray-400 gap-2'>
                                                <p className='text-2xl font-bold'>{report.partner_report.report_info.type === "MissingReport" ? "Missing Report" : "Found Report"}</p>
                                                <p className='text-2xl font-bold'>{report.partner_report.report_info.item_name}</p>
                                                <p><span className='font-bold'>{report.partner_report.report_info.type === 'FoundReport' ? 'Date found:' : 'Date lost:'}</span> {new Date(report.partner_report.report_info.date).toISOString().slice(0, 10)}</p>
                                                <p><span className='font-bold'>{report.partner_report.report_info.type === 'FoundReport' ? 'Found at:' : 'Possible lost at:'}</span> {report.partner_report.report_info.location}</p>
                                                <p><span className='font-bold'>Description:</span> {report.partner_report.report_info.description}</p>
                                                <p><span className='font-bold'>Status:</span> {report.partner_report.report_info.status}</p>
                                                {
                                                    report.partner_report.report_info.type === 'FoundReport' ?
                                                        <p><span className='font-bold'>Office Surrendered:</span> {report.partner_report.report_info.office_location_surrendered}</p>
                                                    : null   
                                                }
                                            </div>

                                            <div className='p-4'>
                                                <div className='flex flex-row'>
                                                    <p className="mb-2">
                                                        <span className="font-bold">User Information:</span>
                                                    </p>
                                                </div>

                                                <div className='flex flex-col lg:flex-row lg:items-start lg:justify-start items-center justify-center  gap-2'>
                                                    <img
                                                        src={report.report_info.creatorId.personal_info.pic}
                                                        alt=""
                                                        className="lg:w-12 lg:h-12 w-24 h-24 rounded-full border border-gray-400 cursor-pointer"
                                                    />

                                                    <div className='flex flex-col gap-2'>
                                                        <div className='flex flex-col lg:flex-row'>
                                                            <div className='flex flex-col mx-2 font-bold gap-2'>
                                                                <p>{report.partner_report.report_info.creatorId.personal_info.name.length > 15 ? `${report.partner_report.report_info.creatorId.personal_info.name.substring(0, 15)}...` : report.partner_report.report_info.creatorId.personal_info.name}</p>
                                                                <p>{report.partner_report.report_info.creatorId.personal_info.email.length > 15 ? `${report.partner_report.report_info.creatorId.personal_info.email.substring(0, 15)}...` : report.partner_report.report_info.creatorId.personal_info.email}</p>
                                                                <p>{report.partner_report.report_info.creatorId.personal_info.uid}</p>
                                                            </div>
                                                            <div className='flex flex-col font-bold gap-2'>
                                                                <p>{report.report_info.creatorId.personal_info.membership}</p>
                                                                <p>{report.report_info.creatorId.personal_info.specification}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full lg:w-1/2 p-4 flex justify-center items-center flex-col gap-4">
                                            
                                            <div className='h-80 w-full flex justify-center border border-gray-400'>
                                                {!partnerSelectedImage && (
                                                <div className='flex h-auto w-auto justify-center'>
                                                    
                                                    <img className="w-auto h-auto object-contain" src={ partnerItemFirstImage } alt="" />
                                                </div>
                                                )}
                                                {partnerSelectedImage && (
                                                <div className='flex h-full w-full justify-center'>
                                                    
                                                    <img className="w-auto h-full object-contain" src={partnerSelectedImage} alt="Selected Product Preview" />
                                                </div>
                                                )}
                                            </div>
                                            
                                            <div className='flex justify-center '>
                                                <div className="justify-between w-full grid grid-cols-3 gap-4">
                                                {partnerOldImage !== null 
                                                ?   partnerOldImage.map((image, index) => (
                                                    <img
                                                        // className="w-full h-full object-contain cursor-pointer"
                                                        className="w-24 h-auto object-contain cursor-pointer border border-gray-400"
                                                        key={index}
                                                        src={image}
                                                        alt="itemImage"
                                                        onClick={() => setPartnerSelectedImage(image)}
                                                    />
                                                    ))
                                                : <img
                                                    // className="w-full h-full object-contain cursor-pointer"
                                                    className="w-24 h-auto object-contain cursor-pointer border border-gray-400"
                                                    src={partnerOldImage}
                                                    alt="itemImage"
                                                />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            :
                                null
                        }
                </>
            }
        </ScrollableFeed>
    )
}

export default AccountReportInfo