import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import AdminBarChart from '../../components/AdminBarChart';
import AdminYearSelector from './AdminYearSelector';
import AdminPieChart from '../../components/AdminPieChart';
import { server } from '../../../server';
import { getAccessToken, getUserInfo } from '../../../common/userInfo';
import Loader from '../../../components/Loader';
import { Toaster, toast } from "react-hot-toast"

const AdminDash = () => {
    const navigate = useNavigate()

    let access_token = getAccessToken()
    let user_info = getUserInfo()

    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [counts, setCounts] = useState('');
    const [error, setError] = useState(null)
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [barLoading, setBarLoading] = useState(true)

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    // Create a function to handle the "Go" button click
    const handleGoButtonClick = () => {
        if (selectedStartDate && selectedEndDate) {
            getReportsWithDateRange(selectedStartDate, selectedEndDate);
        } else {
            // Fetch all-time total results
            getReportsWithDateRange('', '');
        }
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);

        // Fetch data for the selected year
        // You need to modify this part to fetch data for the selected year
        // You might need to add an API endpoint that accepts the year as a parameter
        // and returns the data for that year.
    };

    // Function to fetch data based on the selected year
    const fetchDataByYear = async (year) => {
        await axios.get(`${server}/dashboard/counts/${year}`, 
        { 
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        })
        .then( ({ data }) => {
            // console.log("fetchDataByYear - data:",data)
            setChartData(data);
            setBarLoading(false)
        })
        .catch(err => {
            // console.log(err.response)
        })
        // .finally(() => {
        //     setBarLoading(false)
        // })
    };

    // Create a function to fetch all reports
    const getReportsWithDateRange  = async (startDate, endDate) => {
        
        // console.log("startDate:",startDate)
        // console.log("endDate:",endDate)

        const config = { 
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        }

        let url = `${server}/dashboard/counts?startDate=${startDate}&endDate=${endDate}`;

        await axios.get(url,
            { 
                withCredentials: true,
                headers: {
                    'authorization': `Bearer ${access_token}`
                }
            })
        .then( async ({ data }) => {

            // console.log("getReportsWithDateRange - data:",data)

            setCounts(data); // Set the reports in state
            setLoading(false)
        })
        .catch(err => {
            // console.log(err.response)
        })
        // .finally(() => {
        //     setLoading(false)
        // })
            
    };

    useEffect(() => {
        // Fetch all-time total results when the page is initially loaded
        getReportsWithDateRange('', '');

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchDataByYear(selectedYear);

        // eslint-disable-next-line
    }, [access_token, selectedYear]);

    return (
        // counts && chartData ? (
        access_token && counts ? 
        
        <>
            <Toaster/>
            <div className='p-8 lg:p-20 w-[100%] border-red-700'>
                {/* <section className='w-[80%] border-8 border-red-700'> */}
                    {/* <p>{today}</p> */}
                    <div className='flex flex-col sm:flex-row justify-between gap-4 sm:gap-0'>
                        {/* <h1 className='text-3xl font-bold text-primaryColor'>Dashboard</h1> */}
                        <h1 className='text-2xl font-bold text-primaryColor'>{user_info.admin_info.office_location} (Admin)</h1>

                        <div className="flex flex-col sm:flex-row sm:w-max w-full gap-2">
                            <input
                                type="date"
                                name="start-date"
                                id="start-date"
                                value={selectedStartDate}
                                onChange={(e) => setSelectedStartDate(e.target.value)}
                                max={selectedEndDate}
                                className="bg-gray-100 border-2 w-full px-2 py-1 rounded-lg"
                            />

                            <input
                                type="date"
                                name="end-date"
                                id="end-date"
                                value={selectedEndDate}
                                onChange={(e) => setSelectedEndDate(e.target.value)}
                                max={selectedEndDate}
                                className="bg-gray-100 border-2 w-full px-2 py-1 rounded-lg"
                            />

                            <button
                                onClick={handleGoButtonClick}
                                className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                            >
                                Go
                            </button>
                        </div>
                    </div>
                    {
                        counts ? 
                        <>
                            <div className='sm:py-4 flex flex-col sm:flex-row gap-4 w-full'>
                                
                                    <div 
                                        className='flex flex-col justify-between p-4 w-full border cursor-pointer hover:bg-yellow-100 hover:border-yellow-100' 
                                        onClick={() =>
                                            navigate(`/admin/dash/reports/missing`)
                                        }
                                    >
                                        <h1 className='font-bold'>Missing Reports</h1>
                                        <div className='flex justify-between items-center'>
                                            <h1 className='font-bold text-2xl'>{counts.missingReportCount}</h1>
                                            {/* <h1>+25</h1> */}
                                        </div>
                                    </div>
                                    <div 
                                        className='flex flex-col justify-between p-4 w-full border cursor-pointer hover:bg-yellow-100 hover:border-yellow-100'
                                        onClick={() =>
                                            navigate(`/admin/dash/reports/found`)
                                        }
                                    >
                                        <h1 className='font-bold'>Claimable Found Reports</h1>
                                        <div className='flex justify-between items-center'>
                                            <h1 className='font-bold text-2xl'>{counts.claimableReportCount}</h1>
                                            {/* <h1>+25</h1> */}
                                        </div>
                                    </div>
                                    <div 
                                        className='flex flex-col justify-between p-4 w-full border cursor-pointer hover:bg-yellow-100 hover:border-yellow-100'
                                        onClick={() =>
                                            navigate(`/admin/dash/reports/found`)
                                        }
                                    >
                                        <h1 className='font-bold'>Processing Found Reports</h1>
                                        <div className='flex justify-between items-center'>
                                            <h1 className='font-bold text-2xl'>{counts.processingReportCount}</h1>
                                            {/* <h1>+25</h1> */}
                                        </div>
                                    </div>
                                    <div 
                                        className='flex flex-col justify-between p-4 w-full border cursor-pointer hover:bg-yellow-100 hover:border-yellow-100'
                                        onClick={() =>
                                            navigate(`/admin/dash/reports/claimed`)
                                        }
                                    >
                                        <h1 className='font-bold'>Claimed Reports</h1>
                                        <div className='flex justify-between items-center'>
                                            <h1 className='font-bold text-2xl'>{counts.claimedReportCount}</h1>
                                            {/* <h1>+25</h1> */}
                                        </div>
                                    </div>
                            </div>
                            <div className='sm:py-4 flex flex-col sm:flex-row justify-between gap-4'>
                                <div className='w-full sm:w-1/2 border flex flex-col justify-between p-4'>
                                    <h1 className='font-bold'>Top Missing Locations</h1>
                                    <ul>
                                        {/* {counts.locationCounts.map(([location, count]) => (
                                            <li key={location}>
                                                {location}: {count}
                                            </li>
                                        ))} */}
                                        {counts.locationCounts.slice(0, 5).map(([location, count]) => (
                                            <li key={location}>
                                                {location}: {count}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className='w-full sm:w-1/2 border flex flex-col p-4'>
                                    <h1 className='font-bold'>Top User Specifications</h1>
                                    <ul>
                                        {/* {counts.userSpecifications.map(([specification, count]) => (
                                            <li key={specification}>
                                                {specification}: {count}
                                            </li>
                                        ))} */}
                                        {counts.userSpecifications.slice(0, 5).map(([location, count]) => (
                                            <li key={location}>
                                                {location}: {count}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </>
                        : 
                        <div className='flex justify-center items-center'>
                            <Loader/>
                        </div>
                        
                    }
                    {
                        chartData ? 
                        <>
                            <div className='sm:py-4 flex justify-between gap-y-4 '>
                                <div className='w-full border flex flex-col justify-between p-4 overflow-hidden'>
                                    <h1 className='font-bold'>Monthly Reported Items</h1>
                                    <div className="">
                                        <AdminYearSelector selectedYear={selectedYear} onYearChange={handleYearChange} />
                                    </div>
                                    {barLoading ? (
                                        <div className="w-full h-screen flex items-center justify-center">
                                            <div className="flex justify-center">
                                                <Loader/>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-scroll">
                                            <AdminBarChart data={chartData} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                        :
                        <div className='flex justify-center items-center'>
                            <Loader/>
                        </div>
                    }
                {/* </section> */}
            </div>
        </>
        :
        <div className='flex justify-center items-center'>
            <Loader/>
        </div>
        )
        // :
        // (
        //     <Loader />
        // )
    // )
}
export default AdminDash