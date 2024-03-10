import React, { useEffect, useState } from 'react'
import ScrollableFeed from 'react-scrollable-feed';
import { server } from '../../../../server';
import { Margin, usePDF } from "react-to-pdf";
import axios from 'axios';
import Loader from '../../../../components/Loader';
import successIcon from '../../../../imgs/successIcon.png';
import { getAccessToken } from '../../../../common/userInfo';
import { Toaster, toast } from "react-hot-toast"

let toPDF;
let targetRef;

const AdminDownloadReceipt = ({ type, reportId, setOpen }) => {

    let access_token = getAccessToken()
    let [loading, setLoading] = useState(true);
    const [report, setReport] = useState('');

    const pdf = usePDF({
        filename: `PUPFind-Claimed-Report.pdf`,
        page: { margin: Margin.LARGE }
    });
    toPDF = pdf.toPDF;
    targetRef = pdf.targetRef;
    

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
                
                // const pdf = usePDF({
                //     filename: `PUPFind-Claimed-${report.report_info.report_id}-${report.partner_report.report_info.report_id}.pdf`,
                //     page: { margin: Margin.LARGE }
                // });
                // toPDF = pdf.toPDF;
                // targetRef = pdf.targetRef;

                // console.log(report.partner_report.report_info.creatorId.personal_info.uid)
                // // console.log("report.partner_report.report_info.creatorId.peronal_info.uid:",report.partner_report.report_info.creatorId.peronal_info.uid)

                setReport(report);    
                setLoading(false);
            })
        } catch (error) {
            console.error(error);
            toast.error('Error fetching report data');
        }
    };

    useEffect(() => {
        getReportData();

        // const pdf = usePDF({
        //     filename: `PUPFind-Claimed-${report.report_info.report_id}-${report.partner_report.report_info.report_id}.pdf`,
        //     page: { margin: Margin.LARGE }
        // });
        // toPDF = pdf.toPDF;
        // targetRef = pdf.targetRef;

        // eslint-disable-next-line
    }, []);

    return (
        // <div>AdminDownloadReceipt</div>
        <ScrollableFeed>
            {
                loading ? 
                    <Loader/> 
                    :
                    report ?
                        // <Loader/>
                        // <p>{report.report_info.status}</p>
                        <>
                            <Toaster/>
                            <div className="p-20 w-full rounded-lg border">
                                
                                <div id="receipt" className="flex flex-col justify-center border-2 mx-auto w-full p-6" ref={targetRef}>
                                    <div className='flex flex-col border-red-600 items-center mb-16'>
                                        <img src={successIcon} alt="" className='w-20 mb-4'/>
                                        <h1 className='text-xl'>Item claimed successfully</h1>
                                        {/* <h1 className='text-sm'>and saved to reference code section</h1> */}
                                    </div>
                                    <div className='border-t py-10 flex flex-col gap-4'>
                                        
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-row justify-between mb-2'>
                                                <h1>Found Report:</h1>
                                            </div>
                                            <div className='flex flex-row justify-between mb-2'>
                                                <h1>Report Id:</h1>
                                                <h1 className='font-bold'>{report.report_info.report_id}</h1>
                                            </div>
                                            <div className='flex flex-row justify-between mb-2'>
                                                <h1>Found Item:</h1>
                                                <h1 className='font-bold'>{report.report_info.item_name}</h1>
                                            </div>
                                            <div className='flex flex-row justify-between mb-2'>
                                                <h1>Founder Name:</h1>
                                                <h1 className='font-bold'>{report.report_info.creatorId.personal_info.name}</h1>
                                            </div>
                                            <div className='flex flex-row justify-between mb-2'>
                                                <h1>Founder UID:</h1>
                                                <h1 className='font-bold'>{report.report_info.creatorId.personal_info.uid}</h1>
                                            </div>
                                            <div className='flex flex-row justify-between mb-2'>
                                                <h1>Date Found:</h1>
                                                <h1 className='font-bold'>{new Date(report.report_info.date).toLocaleDateString()}</h1>
                                            </div>
                                            <div className='flex flex-row justify-between mb-2'>
                                                <h1>Location Found:</h1>
                                                <h1 className='font-bold'>{report.report_info.location}</h1>
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-row justify-between my-2'>
                                                <h1>Missing Report:</h1>
                                            </div>
                                            <div className='flex flex-row justify-between mb-2'>
                                                <h1>Report Id:</h1>
                                                <h1 className='font-bold'>{report.partner_report.report_info.report_id}</h1>
                                            </div>
                                            <div className='flex flex-row justify-between mb-2'>
                                                <h1>Missing Item:</h1>
                                                <h1 className='font-bold'>{report.partner_report.report_info.item_name}</h1>
                                            </div>
                                            <div className='flex flex-row justify-between mb-2'>
                                                <h1>Owner Name:</h1>
                                                <h1 className='font-bold'>
                                                    {report.partner_report.report_info.creatorId.personal_info.name}
                                                </h1>
                                            </div>
                                            <div className='flex flex-row justify-between mb-2'>
                                                <h1>Owner UID:</h1>
                                                <h1 className='font-bold'>
                                                    {report.partner_report.report_info.creatorId.personal_info.uid}
                                                </h1>
                                            </div>
                                            <div className='flex flex-row justify-between mb-2'>
                                                <h1>Date Lost:</h1>
                                                <h1 className='font-bold'>{new Date(report.partner_report.report_info.date).toLocaleDateString()}</h1>
                                            </div>
                                            <div className='flex flex-row justify-between mb-2'>
                                                <h1>Possible Location Lost:</h1>
                                                <h1 className='font-bold'>{report.partner_report.report_info.location}</h1>
                                            </div>
                                        </div>

                                    </div>
                                    <div className='border-dashed border-t-2 py-10'>
                                        <div className='flex flex-row justify-between mb-2'>
                                            <h1>Date Claimed:</h1>
                                            <h1 className='font-bold'>{new Date(report.updatedAt).toLocaleDateString()}</h1>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex justify-center'>
                                    <button className="w-full md:w-3/4 lg:w-1/2 border-solid border-primaryColor bg-primaryColor flex flex-col justify-center h-12 shrink-0 items-center border-2 mt-4 font-sans font-medium text-white"
                                    onClick={toPDF}>
                                        Download as PDF
                                    </button>
                                </div>
                            </div>
                        </>
                    :
                    <Loader/>

            }
        </ScrollableFeed>
    )
}

export default AdminDownloadReceipt