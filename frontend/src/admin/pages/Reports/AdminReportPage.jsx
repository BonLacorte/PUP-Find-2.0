import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getAccessToken, getUserInfo } from '../../../common/userInfo'
import { Link, useNavigate } from 'react-router-dom'
import { useTable, useSortBy, usePagination } from "react-table";
import { Toaster, toast } from "react-hot-toast"
import { server } from '../../../server';
import AdminEditUser from '../Users/AdminEditUser';
import AdminNewReport from './components/AdminNewReport';
import AdminEditReport from './components/AdminEditReport';
import AdminReportInfo from './components/AdminReportInfo';
import { Tooltip } from 'react-tooltip'
import AdminDownloadReceipt from './components/AdminDownloadReceipt';
import AdminSendMessage from './components/AdminSendMessage';

const AdminReportPage = ({ type }) => {
    
    let access_token = getAccessToken()
    let user_info = getUserInfo()
    let navigate = useNavigate()

    let [ open, setOpen ] = useState(false)
    let [selectedCategoryReport, setSelectedCategoryReport] = useState('Student')
    let [searchQuery, setSearchQuery] = useState('')

    let [chosenReport, setChosenReport] = useState(null)
    let [drawerTitle, setDrawerTitle] = useState('')
    let [reportCreatorId, setReportCreatorId] = useState('')
    let [reportCreatorUid, setReportCreatorUid] = useState('')

    let [reports, setReports] = useState([])
    let [error, setError] = useState(null)
    let [loading, setLoading] = useState(true)


    // CSS styles for the table container
    const tableContainerStyles = {
        overflowX: 'auto',
        maxWidth: '100%',
        width: '100%',
    };


    const getAllReports = async (query) => {
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
            let filteredData

            if (type === 'MissingReport') {
                filteredData = reports.filter((report) => 
                    report.is_claimed === false);
                filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order
                setReports(filteredData);
                setLoading(false);
                return;
            } else if (type === 'FoundReport') {
                filteredData = reports.filter((report) => 
                    report.report_info.office_location_surrendered === user_info.admin_info.office_location 
                    && report.is_claimed === false);
                // filteredData = reports.filter((report) => report.is_claimed === false);
                filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order
                setReports(filteredData);
                setLoading(false);
            }else if (type === 'Claimed') {
                // filteredData = reports.filter((report) => report.report_info.type === 'FoundReport' && report.is_claimed === true && report.report_info.office_location_surrendered === user_info.admin_info.office_location);
                filteredData = reports.filter((report) => 
                    report.report_info.type === 'FoundReport' 
                    && report.is_claimed === true 
                    && report.report_info.office_location_surrendered === user_info.admin_info.office_location)
                filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order
                setReports(filteredData);
                setLoading(false);
            }

        })
        .catch (error => {
            console.log(error)
            setError(error)
        })
    }


    const handleSearchChange = (e) => {
        const query = e.target.value
        setSearchQuery(query)
        getAllReports(query)
    }


    const handleDeleteReport = async (reportId) => {
        // e.preventDefault()
        await axios.delete(`${server}/report/delete-report/${reportId}`,
        {
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        }).then(({data}) => {
            // console.log(data)
            toast.success("Report deleted successfully")
            getAllReports()
        }).catch(err => {
            console.log(err.response)
            toast.error("Error deleting report")
        })
        // FIX THIS
    }


    const handleExportToCSV = () => {
        const reversedReports = [...reports].reverse(); // Reverse the sortedReports array
        let reportsToExport;
        if (type === "Claimed") {
            reportsToExport = reversedReports.map((report) => ({
                'Found Report Id': report.report_info.report_id,
                "Found Item": report.report_info.item_name,
                'Found Report Status': report.report_info.status,
                'Date Found': new Date(report.report_info.date).toLocaleDateString(),
                'Location Found': report.report_info.location || '-',
                'Founder': report.report_info.creatorId.personal_info.name || '-',
                'Partner Missing Report Id': report.partner_report.report_info.report_id,
                "Missing Item": report.partner_report.report_info.item_name,
                "Date Missing": new Date(report.partner_report.report_info.date).toLocaleDateString(),
                'Location Missing': report.partner_report.report_info.location || '-',  
                'Claimed By/Owner': report.partner_report.report_info.creatorId.personal_info.name || '-',                    
            }));
        } else if (type === "MissingReport"){
            reportsToExport = reversedReports.map((report) => ({
                'Report Id': report.report_info.report_id,
                "Item": report.report_info.item_name,
                'Report Status': report.report_info.status,
                // 'Report Type': report.report_info.type,
                'Location Lost': report.report_info.location || '-',
                'Date Missing': new Date(report.report_info.date).toLocaleDateString(),
                'Owner': report.report_info.creatorId.personal_info.name || '-',
            }));
        } else if (type === "FoundReport"){
            reportsToExport = reversedReports.map((report) => ({
                'Report Id': report.report_info.report_id,
                "Item": report.report_info.item_name,
                'Report Status': report.report_info.status,
                // 'Report Type': report.report_info.type,
                'Location Found': report.report_info.location || '-',
                'Date Found': new Date(report.report_info.date).toLocaleDateString(),
                'Founder': report.report_info.creatorId.personal_info.name || '-',
            }));
        }
        const csvData = [];
        csvData.push(Object.keys(reportsToExport[0])); // Add header row
    
        reportsToExport.forEach((report) => {
            csvData.push(Object.values(report));
        });

        const csvContent = csvData.map((row) => row.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const reportType = 
        (
            type === 'MissingReport' ?
            'Missing'
            :
            type === 'FoundReport' ?  
            'Found'
            :
            'Claimed'
        )
        const currentDate = new Date().toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' })
        a.download = `PUPFind-${reportType}-Reports-as-of-${currentDate}.csv`
        a.click();
        window.URL.revokeObjectURL(url);
    };


    const handleDrawer = (report, form_type) => {

        // console.log("handleDrawer report: ",report.id)

        if (report) {
            setChosenReport(report.id)
        }

        // console.log("report",report.creatorId.id)

        // console.log("report.report_info.creatorId._id",report.report_info.creatorId._id)

        if (form_type === 'delete') {
            setDrawerTitle('Delete Report')
        } else if (form_type === 'add') {
            // setDrawerTitle(type === "MissingReport" ? "Add Missing Report" :  "Add Found Report")
            setDrawerTitle("Create New Report")
        } else if (form_type === 'edit') {
            setDrawerTitle('Edit Report')
        } else if (form_type === 'info') {
            setDrawerTitle('Report Information')
        } else if (form_type === 'download') {
            setDrawerTitle('Download Claim Receipt')
        } else if (form_type === 'message') {
            setDrawerTitle('Send Message')
            setReportCreatorId(report.creatorId.id)
            setReportCreatorUid(report.creatorId.uid)
        }

        setOpen(true)
    }


    useEffect(() => {
        getAllReports()

        setDrawerTitle(null)
        // eslint-disable-next-line
    }, [])


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
                    <div 
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Message user"
                        data-tooltip-place="top"
                        className='flex flex-row justify-center items-center cursor-pointer 
                            hover:bg-gray-200 transition duration-2000
                        '
                        onClick={() => {
                            handleDrawer(params.row.original, "message")
                        }}
                        >

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

                        {
                            type === "Claimed" && 
                            <div
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content="Download claim receipt"
                                data-tooltip-place="top"
                            >
                                <button
                                    onClick={() => {
                                        handleDrawer(params.row.original, "download")
                                    }}
                                    className="bg-green-500 text-white font-bold py-1 px-2 rounded mr-2 border 
                                    hover:bg-green-700 transition duration-200"
                                >
                                    <i className="fi fi-sr-download" alt="Hello"></i>
                                </button>
                            </div>
                        }

                        {
                            type === "FoundReport" && params.row.original.status === "Claimable" &&
                            <div 
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content="Match this report with a missing report"
                                data-tooltip-place="top"
                            >
                                <button
                                    onClick={() => {
                                        navigate(`/admin/dash/reports/match/${params.row.original.id}`, {state: { report: params.row.original}})
                                        // console.log("params.row.original",params.row.original)
                                    }}
                                    className="bg-green-500 text-white font-bold py-1 px-2 rounded mr-2 border 
                                    hover:bg-green-700 transition duration-200"
                                >
                                    <i className="fi fi-sr-check"></i>
                                </button>
                            </div>
                        }
                        

                        <button
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="Edit report"
                            data-tooltip-place="top"
                            onClick={() => {
                                // navigate(`/admin/dash/reports/missing/edit/${params.row.original.id}`, {state: { report: params.row.original}})
                                handleDrawer(params.row.original, "edit")
                            }} 
                            className="bg-blue-500 text-white font-bold py-1 px-2 rounded mr-2 border hover:bg-blue-700 transition duration-200">
                            <i className="fi fi-sr-file-edit"></i>
                        </button> 

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
                        </button>
                        
                    </div>
                ),
            },
        ],
        [],
    )
    

    const row = React.useMemo(
        () => 
        reports.map((report) => {
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
        }), 
    [reports]
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
            initialState: { pageIndex: 0, pageSize: 10 },
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
        <>
            <Toaster/>
            {/* <ReactTooltip /> */}
            <Tooltip id="my-tooltip" />
            <div className='p-8 lg:p-20'>
                <div className='md:pb-4 flex flex-col md:flex-row md:justify-between gap-4 md:gap-0'>
                    <h1 className='text-3xl font-bold text-primaryColor'>
                        {type === "MissingReport" ? "Missing Reports" : type === "FoundReport" ? 'Found Reports' : 'Claimed Reports'}
                    </h1>

                    <div className="flex flex-col md:flex-row gap-2 md:gap-0">
                        
                        <button
                            className='bg-primaryColor text-white w-full font-bold py-2 px-4 rounded mr-2'
                            onClick={handleExportToCSV}
                        >
                            Export to CSV
                        </button>

                        {
                            type !== "Claimed" &&

                            <button 
                                onClick={() => {
                                    handleDrawer(null, "add")
                                }}
                                className="bg-primaryColor text-white w-full font-bold py-2 px-2 rounded mr-2"
                            >
                                {/* <Link to={`/admin/dash/reports/missing/new`}> */}
                                    {
                                        type !== "Claimed" ?
                                            type === "MissingReport" ? "Add Missing Report" 
                                            : 
                                            "Add New Found Report"
                                        : null
                                    }
                                {/* </Link> */}
                            </button>
                        }
                        
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
                <div className="flex justify-center">

                    <div className="w-full pt-1 mt-5 lg:mt-10 bg-white border" style={tableContainerStyles}>
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

                        <h5 className="text-[30px] font-semibold text-center pb-4">
                            {drawerTitle}
                        </h5>

                        {
                            drawerTitle === "Delete Report" ?
                                <div className="flex flex-col justify-center items-center mt-10 gap-10 mb-10">
                                    
                                    <p className="text-center">Are you sure you want to delete this report?</p>

                                    <div>
                                        <button
                                            onClick={() => setOpen(false)}
                                            className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                setOpen(false)
                                                handleDeleteReport(chosenReport)
                                            }}
                                            className="bg-primaryColor text-white font-bold py-2 px-4 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            : drawerTitle === "Edit Report" ?
                                <div className="flex flex-col overflow-y-auto h-[60vh] pb-4">
                                    <AdminEditReport type={type} reportId={chosenReport} setOpen={setOpen} getAllReports={getAllReports}/>
                                </div>
                            : drawerTitle === ("Create New Report") ?
                                <div className="flex flex-col overflow-y-auto h-[60vh] pb-4">
                                    <AdminNewReport type={type} setOpen={setOpen}/>
                                </div>
                            : drawerTitle === "Report Information" ?
                                <div className="flex flex-col overflow-y-auto h-[50vh] pb-4">
                                    <AdminReportInfo type={type} reportId={chosenReport} setOpen={setOpen}/>
                                </div>
                            : drawerTitle === "Download Claim Receipt" ?
                                <div className="flex flex-col overflow-y-auto h-[50vh] pb-4">
                                    <AdminDownloadReceipt type={type} reportId={chosenReport} setOpen={setOpen}/>
                                </div>
                            : drawerTitle === "Send Message" ?
                                <div className="flex flex-col overflow-y-auto pb-4">
                                    <AdminSendMessage type={type} reportId={chosenReport} reportCreatorId={reportCreatorId} reportCreatorUid={reportCreatorUid} setOpen={setOpen}/>
                                </div>
                            :
                            null
                        }
                    </div>
                </div>
            )}
        </>
    )
}

export default AdminReportPage