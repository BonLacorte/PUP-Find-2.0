import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { getAccessToken, getUserId, getUserInfo } from '../../../common/userInfo'
import { server } from '../../../server'
import Loader from '../../../components/Loader'
import { Toaster, toast } from 'react-hot-toast'
import { Tooltip } from 'react-tooltip'
import axios from 'axios'
import { useTable, useSortBy, usePagination } from "react-table";
import AdminReportMatch from './components/AdminReportMatch'

const AdminReportMatchPage = () => {

    const { report_id } = useParams()
    let access_token = getAccessToken()
    let user_info = getUserInfo()
    let user_id = getUserId()
    let [ foundReportLoading, setFoundReportLoading] = useState(true);
    let [ foundReport, setFoundReport ] = useState();
    let [ missingReportsLoading, setMissingReportsLoading ] = useState(true);
    let [ missingReports, setMissingReports ] = useState();
    let [ selectedImage, setSelectedImage ] = useState(null);
    let [ oldImage, setOldImage ] = useState();
    let [ itemFirstImage, setItemFirstImage ] = useState()
    const [searchQuery, setSearchQuery] = useState('');

    let [ open, setOpen ] = useState(false)
    let [ drawerTitle, setDrawerTitle ] = useState('')
    let [ chosenMissingReport, setChosenMissingReport ] = useState('')

    let location = useLocation();
    console.log('location.state:',location.state)
    console.log('location.state.report.creatorId.id:',location.state.report.creatorId.id)
    let reportCreatorId = location.state.report.creatorId.id
    let firstImage = location.state.report.images?.[0]

    const [runCount, setRunCount] = useState(0);

    let type = 'MissingReport'


    // Fetch all missing reports
    const getAllMissingReports = async (query) => {
        let url = `${server}/report/get-all-reports/`
        if (type) url += `?reportType=${type}`
        if (query) url += type ? `&search=${query}` : `?search=${query}`

        await axios.get(url, 
        {
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        }).then(( {data: {reports}}) => {
            // console.log("reports",reports)
            // console.log("foundReport:",foundReport)
            // console.log("user_id:",user_id)
            let filteredData

            if (type === 'MissingReport') {
                filteredData = reports.filter((report) => report.is_claimed === false && report.report_info.creatorId._id !== reportCreatorId);
                filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order
                console.log(filteredData)
                setMissingReports(filteredData);
                setMissingReportsLoading(false);
                return;
            } 
        })
        .catch (error => {
            console.log(error)
            // setError(error)
        })
    }


    // Fetch the existing claimable found report data for matching
    const getFoundReportData = async () => {
        try {
            await axios.get(`${server}/report/get-report-info/${report_id}`,
            {
                withCredentials: true,
                headers: {
                    'authorization': `Bearer ${access_token}`
                }
            })
            .then(({ data: {report} }) => {
                
                console.log("report",report)
                console.log("report_info",report.report_info)
                console.log("report_info.item_name",report.report_info.item_name)

                setFoundReport(report);
                // const firstImage = foundReport?.report_info?.images?.[0];
                console.log(firstImage)
                const itemFirstImage = firstImage || 'https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png';
                setItemFirstImage(itemFirstImage);
                setOldImage(report.report_info.images ?? []);
                console.log("report.report_info.images:", report.report_info.images)
            })
            setFoundReportLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching report data');
        }
    };


    const handleDrawer = (report, form_type) => {

        console.log("handleDrawer report: ",report)

        if (report) {
            setChosenMissingReport(report)
        }

        if (form_type === 'match') {
            setDrawerTitle('Match these reports')
        } 

        setOpen(true)
    }


    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        // Call fetchUsers with updated searchQuery and selected category
        getAllMissingReports(query);
    };


    useEffect(() => {
        getFoundReportData();
        getAllMissingReports()


        // eslint-disable-next-line
    }, []);


    // CSS styles for the table container
    const tableContainerStyles = {
        overflowX: 'auto',
        maxWidth: '100%',
        width: '100%',
    };


    const columns = React.useMemo(
        () => [
            {
                accessor: 'itemName',
                Header: 'Item',
                Cell: (params) => {
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {
                                params.row.original.images.length > 0  ?
                                    <img src={params.row.original.images[0]} alt="" className="w-10 h-10 rounded-full mr-2" />
                                    :
                                    <img src={"https://www.greenheath.co.uk/wp-content/uploads/2015/09/no_image_available1.png"} alt="" className="w-10 h-10 rounded-full mr-2" />
                            }
                            {params.row.original.item_name.length > 15 ? `${params.row.original.item_name.substring(0, 15)}...` : params.row.original.item_name}
                        </div>
                    );
                },
            },
            {
                accessor: 'reportStatus',
                Header: 'Status',
                Cell: (params) => {
                    return (
                        <div>
                            { (type === "MissingReport" && params.row.original.status === "Missing") || (type === "FoundReport" && params.row.original.status === "Processing")
                                ? 
                                <div className='px-2 border-2 border-red-500 font-semibold text-red-500 rounded-2xl'>
                                    <p>{params.row.original.status === "Missing" ? "Missing" : "Processing"}</p>
                                </div>
                                : params.row.original.status === "Claimable" 
                                ?
                                <div className='px-2 border-2 border-blue-500 font-semibold text-blue-500 rounded-2xl'>
                                    <p>Claimable</p>
                                </div>
                                :
                                <div className='px-2 border-2 border-green-500 font-semibold text-green-500 rounded-2xl'>
                                    <p>Claimed</p>
                                </div>
                            }
                        </div>
                    );
                },
            },
            {
                accessor: 'createdAt',
                Header: 'Date Reported',
                Cell: (params) => {
                    return new Date(params.row.original.createdAt).toLocaleDateString();
                }
            },
            {
                accessor: 'report_id',
                Header: 'Report Id',
            },
            {
                accessor: 'creatorId',
                Header: 'Report Creator',
                Cell: (params) => {
                    return (
                    // <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className='flex flex-row justify-center items-center'>
                        <img src={params.row.original.creatorId.pic} alt="" className="w-10 h-10 rounded-full mr-2" />
                        <div style={{ 
                            display: 'flex', 
                            flexDirection:
                            'column',
    
                            }}>
                            <p>{params.row.original.creatorId.name.length > 15 ? `${params.row.original.creatorName.substring(0, 15)}...` : params.row.original.creatorName}</p>
                            <p>{params.row.original.creatorId.uid}</p>
                        </div>
                    </div>
                    )
                },
            },
            {
                accessor: 'actions',
                Header: 'Action',
                minWidth: 150, flex: 0.7,
                sortable: false,
                Cell: (params) => (
                    <div 
                        className="flex justify-center items-center"
                    >
                        {/* {
                            type === "FoundReport" && params.row.original.status === "Claimable" &&
                            <div 
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content="Match this report with a missing report"
                                data-tooltip-place="top"
                            >
                                <button
                                    onClick={() => {
                                        navigate(`/admin/dash/reports/match/${params.row.original.id}`)
                                        // console.log("params.row.original",params.row.original)
                                    }}
                                    className="bg-green-500 text-white font-bold py-1 px-2 rounded mr-2 border 
                                    hover:bg-green-700 transition duration-200"
                                >
                                    <i className="fi fi-sr-check"></i>
                                </button>
                            </div>
                        } */}
                        

                        <button
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="Match this report with a missing report"
                            data-tooltip-place="top"
                            onClick={() => {
                                // navigate(`/admin/dash/reports/missing/edit/${params.row.original.id}`, {state: { report: params.row.original}})
                                handleDrawer(params.row.original, "match")
                            }} 
                            className="bg-green-500 text-white font-bold py-1 px-2 rounded mr-2 border hover:bg-green-700 transition duration-200">
                            <i className="fi fi-sr-check"></i>
                        </button> 

{/*                         
                        <button 
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="Report information"
                            data-tooltip-place="top"
                            onClick={() => {
                                // navigate(`/admin/dash/reports/missing/info`, {state: { report: params.row.original}})
                                handleDrawer(params.row.original, "info")
                        }} className="bg-blue-500 text-white font-bold py-1 px-2 rounded mr-2 border 
                        hover:bg-blue-700 transition duration-200">
                            <i className="fi fi-sr-info" alt="Hello"></i>
                        </button>

                        <button
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="Delete report"
                            data-tooltip-place="top"
                            onClick={() => {
                                handleDrawer(params.row.original, "delete")
                            }}
                            className="
                            bg-red-500 text-white font-bold py-1 px-2 rounded mr-2 border
                            hover:bg-red-700 transition duration-200"
                        >
                            <i className="fi fi-sr-trash"></i>
                        </button> */}
                        
                    </div>
                ),
            },
        ],
        [],
    )


    const row = React.useMemo(
        () => 
        missingReports ? missingReports.map((report) => {
            return {
                id: report._id,
                report_id: report.report_info.report_id,
                item_name: report.report_info.item_name,
                images: report.report_info.images, // Fix: Access the 'images' property as an array
                date: report.report_info.date,
                location: report.report_info.specification,
                description: report.report_info.phone_number,
                creatorId: {
                    id: report.report_info.creatorId._id,
                    name: report.report_info.creatorId.personal_info.name,
                    uid: report.report_info.creatorId.personal_info.uid,
                    email: report.report_info.creatorId.personal_info.email,
                    pic: report.report_info.creatorId.personal_info.pic,
                    membership: report.report_info.creatorId.personal_info.membership,
                    specification: report.report_info.creatorId.personal_info.specification,
                    phone_number: report.report_info.creatorId.social_info.phone_number,
                    facebook_link: report.report_info.creatorId.social_info.facebook_link,
                    twitter_link: report.report_info.creatorId.social_info.twitter_link,
                },
                status: report.report_info.status,
                type: report.report_info.type,
                office_location_surrendered: report.report_info.office_location_surrendered,
                // is_claimed: report.social_info.is_claimed,
                partner_report: report.partner_report ? report.partner_report : null,
                createdAt: report.createdAt,
            }
        })
        : [], 
    [missingReports]
    )


    const { 
        getTableProps, 
        getTableBodyProps, 
        headerGroups, 
        page, 
        prepareRow, 
        canPreviousPage, 
        canNextPage, 
        pageOptions, 
        pageCount, 
        gotoPage, 
        nextPage, 
        previousPage, 
        state: { pageIndex, pageSize },
    } = useTable(
        { 
            columns, 
            data: row,
            initialState: { pageIndex: 0, pageSize: 5 },
        }, 
            useSortBy,
            usePagination
        );


    // Displayed data range
    const displayedDataRange = `${pageIndex * pageSize + 1}-${Math.min(
        (pageIndex + 1) * pageSize,
        row.length
    )} of ${row.length}`;
    
    
    return (
        // <div>
        //     <p>AdminReportMatch</p>
        //     <p>{report_id}</p>
        // </div>
        <>
            <Toaster/>
            <Tooltip id="my-tooltip" />
            
                    <div className='p-8 lg:p-20'>
                            {
                                foundReportLoading ?
                                    <Loader/>
                                :
                                    foundReport.report_info.status === "Claimed" ?
                                        <div className="flex justify-center items-center h-[80vh]">
                                            <p className="text-2xl font-bold text-center">{`Report no. ${foundReport.report_info.report_id} (${foundReport.report_info.item_name}) has already been claimed`}</p>
                                        </div>
                                        :
                                        <>
                                            {/* <div className="px-8"> */}
                                                <div className=" rounded-lg flex flex-col lg:flex-row ">
                                                    <div className="w-full lg:w-1/2 p-4 lg:border-r border-gray-400">
                                                
                                                        <div className='flex flex-col p-4 border-b border-gray-400 gap-2'>
                                                            <p className='text-2xl font-bold'>{foundReport.report_info.item_name}</p>
                                                            <p><span className='font-bold'>{foundReport.report_info.type === 'FoundReport' ? 'Date found:' : 'Date lost:'}</span> {new Date(foundReport.report_info.date).toISOString().slice(0, 10)}</p>
                                                            <p><span className='font-bold'>{foundReport.report_info.type === 'FoundReport' ? 'Found at:' : 'Possible lost at:'}</span> {foundReport.report_info.location}</p>
                                                            <p><span className='font-bold'>Description:</span> {foundReport.report_info.description}</p>
                                                            <p><span className='font-bold'>Status:</span> {foundReport.report_info.status}</p>
                                                            {
                                                                type === 'FoundReport' ?
                                                                    <p><span className='font-bold'>Office Surrendered:</span> {foundReport.report_info.office_location_surrendered}</p>
                                                                : null   
                                                            }
                                                        </div>

                                                        <div className='p-4 border-b border-gray-400 lg:border-hidden'>

                                                            <div className='flex flex-row'>
                                                                <p className="mb-2">
                                                                    <span className="font-bold">User Information:</span>
                                                                </p>
                                                            </div>

                                                            <div className='flex flex-col lg:flex-row justify-center items-center lg:justify-start  gap-2'>
                                                                <img
                                                                    src={foundReport.report_info.creatorId.personal_info.pic}
                                                                    alt=""
                                                                    className="w-24 h-auto object-contain rounded-lg border border-gray-400 cursor-pointer"
                                                                />
                                                                <div className='flex justify-center items-center lg:justify-start flex-col font-bold gap-2'>
                                                                    <p>{foundReport.report_info.creatorId.personal_info.name.length > 15 ? `${foundReport.report_info.creatorId.personal_info.name.substring(0, 15)}...` : foundReport.report_info.creatorId.personal_info.name}</p>
                                                                    <p>{foundReport.report_info.creatorId.personal_info.email.length > 15 ? `${foundReport.report_info.creatorId.personal_info.email.substring(0, 15)}...` : foundReport.report_info.creatorId.personal_info.email}</p>
                                                                    <p>{foundReport.report_info.creatorId.personal_info.uid}</p>
                                                                </div>
                                                                <div className='flex justify-center items-center lg:justify-start flex-col font-bold gap-2'>
                                                                    <p>{foundReport.report_info.creatorId.personal_info.membership}</p>
                                                                    <p>{foundReport.report_info.creatorId.personal_info.specification}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="w-full lg:w-1/2 p-4 flex justify-center items-center flex-col gap-4 border-b border-gray-400 lg:border-hidden">
                                                        <div className='h-80 w-full flex justify-center border border-gray-400'>
                                                            {!selectedImage && (
                                                            <div className='flex h-auto w-auto justify-center'>
                                                                
                                                                <img className="w-auto h-auto object-contain" src={ itemFirstImage } alt="" />
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
                                                                    // className="w-full h-full object-contain cursor-pointer"
                                                                    className="w-24 h-auto object-contain cursor-pointer border border-gray-400"
                                                                    key={index}
                                                                    src={image}
                                                                    alt="itemImage"
                                                                    onClick={() => setSelectedImage(image)}
                                                                />
                                                                ))
                                                            : <img
                                                                // className="w-full h-full object-contain cursor-pointer"
                                                                className="w-24 h-auto object-contain cursor-pointer border border-gray-400"
                                                                src={oldImage}
                                                                alt="itemImage"
                                                            />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            {/* </div> */}
                                            {/* <h1>{report.report._id}</h1> */}
                                        </>
                            }
                            {
                                // missingReportsLoading && foundReportLoading ?
                                //     <Loader/>
                                // : foundReport.report_info.status === "Claimed" ?
                                //     null
                                //     :
                                    <div className="flex flex-col justify-center">

                                        <div className="flex justify-between">
                                            <h1 className="text-3xl font-bold text-primaryColor">Missing Reports</h1>

                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    name="search"
                                                    id="search"
                                                    placeholder="Search"
                                                    value={searchQuery}
                                                    onChange={handleSearchChange}
                                                    className="bg-gray-100 border-2 w-full px-2 py-1 rounded-lg mr-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full mt-4 bg-white border" style={tableContainerStyles}>
                                            <table 
                                                className="w-full table-auto border-collapse"
                                            {...getTableProps()}>
                                                <thead
                                                    // className="bg-gray-100 border-b-2  text-left text-xs font-semibold uppercase tracking-wider " 
                                                >
                                                    {headerGroups.map((headerGroup) => (
                                                    <tr 
                                                        
                                                    {...headerGroup.getHeaderGroupProps()}>
                                                        {headerGroup.headers.map((column) => (
                                                        <th
                                                            className='border-b-2 p-4'
                                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                                            isNumeric={column.isNumeric}
                                                        >
                                                            {column.render('Header')}
                                                            <span>
                                                                {column.isSorted ? (
                                                                    column.isSortedDesc ? (
                                                                    <i className="fi fi-sr-caret-down"></i>
                                                                    ) : (
                                                                    <i className="fi fi-sr-caret-up"></i>
                                                                    )
                                                                ) : null}
                                                            </span>
                                                        </th>
                                                        ))}
                                                    </tr>
                                                    ))}
                                                </thead>
                                                <tbody 
                                                    className="w-full table-auto border-collapse"
                                                {...getTableBodyProps()}>
                                                    {page.map((row) => {
                                                        prepareRow(row);
                                                        return (
                                                            <tr key={row.id} {...row.getRowProps()}>
                                                            {row.cells.map((cell) => (
                                                                <td 
                                                                    className='border-b-2 p-4 text-sm text-gray-600 font-semibold text-center'
                                                                key={cell.id} {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                                                                    {cell.render('Cell')}
                                                                </td>
                                                            ))}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                            
                                            {/* Pagination */}
                                            <div className="flex justify-center mt-4">
                                                <button
                                                    onClick={() => previousPage()}
                                                    disabled={!canPreviousPage}
                                                    className="bg-primaryColor text-white font-bold py-2 px-4 rounded mr-2 cursor-pointer
                                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={() => nextPage()}
                                                    disabled={!canNextPage}
                                                    className="bg-primaryColor text-white font-bold py-2 px-4 rounded cursor-pointer
                                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Next
                                                </button>
                                            </div>

                                            {/* Displayed data range text */}
                                            <p className="text-center mt-2">
                                                {displayedDataRange}
                                            </p>
                                        </div>
                                    </div>
                            } 
                    </div>
            {open && (
                <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center rounded-xl">
                    <div className={'justify-center items-center w-[80%] lg:w-['+ 
                    ( drawerTitle === "Report Information" ? 
                        "70%" 
                        : 
                        drawerTitle === "Delete Report" ?
                            "40%"
                            :
                            "40%" 
                    ) +']  bg-white rounded-3xl shadow p-4 overflow-hidden'}>
                        <div className="w-full flex justify-end">
                            <i
                                className="fi fi-br-cross text-2xl cursor-pointer"
                                onClick={() => setOpen(false)}
                            ></i>
                        </div>

                        <h5 className="text-[30px] font-semibold text-center">
                            {drawerTitle}
                        </h5>

                        {
                            drawerTitle === "Match these reports" ?
                                // <div className="flex flex-col justify-center items-center mt-10 gap-10 mb-10">
                                    
                                //     <p className="text-center">Are you sure you want to delete this report?</p>

                                //     <div>
                                //         <button
                                //             onClick={() => setOpen(false)}
                                //             className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2"
                                //         >
                                //             Cancel
                                //         </button>
                                //         <button
                                //             onClick={() => {
                                //                 setOpen(false)
                                //                 handleDeleteReport(chosenMissingReport)
                                //             }}
                                //             className="bg-primaryColor text-white font-bold py-2 px-4 rounded"
                                //         >
                                //             Delete
                                //         </button>
                                //     </div>
                                // </div>
                                <div className="flex flex-col overflow-y-auto pb-4">
                                    <AdminReportMatch missingReport={chosenMissingReport} foundReport={foundReport} setOpen={setOpen}/>
                                </div>
                            : null
                        }
                    </div>
                </div>
            )}
        </>
    )
}

export default AdminReportMatchPage