import React, { useEffect, useState } from 'react'
import axios from 'axios'
// import AdminNewUserForm from './AdminNewUserForm'
// import AdminEditUserForm from './AdminEditUserForm'
import { Link, useNavigate } from 'react-router-dom'
import { useTable, useSortBy, usePagination } from "react-table";
import { Toaster, toast } from "react-hot-toast"
import { server } from '../../../server'
import { getAccessToken } from '../../../common/userInfo';
import AdminNewUser from './AdminNewUser';
import AdminUserInfo from './AdminUserInfo';

const AdminUsersPage = () => {

    let { access_token } = getAccessToken()
    let navigate = useNavigate()

    let [ open, setOpen ] = useState(false)
    let [selectedCategoryReport, setSelectedCategoryReport] = useState('Student')
    let [searchQuery, setSearchQuery] = useState('')
    let [showAddUserForm, setShowAddUserForm] = useState(false)
    let [editingUser, setEditingUser] = useState(null)

    let [chosenUser, setChosenUser] = useState(null)
    let [drawerTitle, setDrawerTitle] = useState('')

    let [users, setUsers] = useState([])

    // CSS styles for the table container
    const tableContainerStyles = {
        overflowX: 'auto',
        maxWidth: '100%',
        width: '100%',
    };


    const getAllUsers = async (category, query) => {

        let url = `${server}/user/get-all-users/`

        if (category) url += `?category=${category}`

        if (query) url += category ? `&search=${query}` : `?search=${query}`

        await axios.get(url, 
        {
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        }).then(( {data: {users}}) => {
            // console.log("users",users)
            setUsers(users)
            // setLoading(false)
        })
        .catch (error => {
            // console.log(error)
        })
    }


    const handleCategoryChange = (e) => {
        setSelectedCategoryReport(e.target.value)
        getAllUsers(e.target.value, searchQuery)
    }
    

    const handleSearchChange = (e) => {
        const query = e.target.value
        setSearchQuery(query)
        getAllUsers(selectedCategoryReport, query)
    }


    const handleAddUser = () => {
        setEditingUser(null)
        setShowAddUserForm(true)
    }

    const handleDeleteUser = async (userId) => {
        await axios.delete(`${server}/report/delete-user/${userId}`,
        {
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        }).then(({data}) => {
            // console.log(data)
            toast.success("User deleted successfully")
            getAllUsers()
        }).catch(err => {
            // console.log(err.response)
            toast.error("Error deleting user")
        })
    }

    const handleExportToCSV = () => {
        const usersToExport = users.map((user) => ({
            Name: user.name,
            Id: user.uid,
            Specification: user.specification,
            Membership: user.membership,
            Email: user.email,
            Contact: user.phoneNumber || '-',
            'Twitter Link': user.twitterLink || '-',
            'Facebook Link': user.facebookLink || '-',
        }));
    
        const csvData = [];
        csvData.push(Object.keys(usersToExport[0])); // Add header row
    
        usersToExport.forEach((user) => {
            csvData.push(Object.values(user));
        });
    
        const csvContent = csvData.map((row) => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const currentDate = new Date().toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' });
        a.download = `PUPFind-Users-as-of-${currentDate}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };


    const handleDrawer = (user, form_type) => {

        if (user) {
            setChosenUser(user.id)
        }
        
        if (form_type === 'message') {
            setDrawerTitle('Send Message to ')
        } else if (form_type === 'delete') {
            setUserToDelete(user)
            setDrawerTitle('Delete User')
        } else if (form_type === 'add') {
            setDrawerTitle('Add User')
        } else if (form_type === 'info') {
            setDrawerTitle('User Information')
        }

        setOpen(true)
    }


    useEffect(() => {
        getAllUsers(selectedCategoryReport)
        // eslint-disable-next-line
    }, [])


    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
                Cell: (params) => (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={params.row.original.pic} alt="" className="w-10 h-10 rounded-full mr-2" />
                            {params.row.original.name.length > 25 ?
                            `${params.row.original.name.substring(0, 25)}...` : params.row.original.name}
                        </div>
                    </>
                )
            },
            {
                Header: 'Id',
                accessor: 'uid',
            },
            {
                Header: 'Section/Department/Role',
                accessor: 'specification',
            },
            {
                Header: 'Email',
                accessor: 'email',
            },
            {
                Header: 'Contact',
                accessor: 'phone_number',
            },
            {
                Header: 'Action',
                accessor: 'actions',
                Cell:
                (params) => (
                    <>
                        {/* <button 
                            onClick={() => {
                                navigate(`/admin/dash/users/edit/${params.row.original.id}`, {state: { user: params.row.original}})
                            }} className='bg-blue-500 text-white font-bold py-2 px-2 rounded mr-2 border 
                            hover:bg-blue-700 transition duration-200'
                        >
                            <i class="fi fi-sr-file-edit"></i>
                        </button> */}

                        {/* <button
                            onClick={() => {
                                handleDrawer(params.row.original, 'delete')
                            }}
                            className="bg-red-500 text-white font-bold py-2 px-2 rounded mr-2 border
                            hover:bg-red-700 transition duration-200"
                        >
                            <i class="fi fi-sr-trash"></i>
                        </button> */}

                        <button 
                            onClick={() => {
                                // navigate(`/admin/dash/reports/missing/info`, {state: { report: params.row.original}})
                                handleDrawer(params.row.original, "info")
                        }} className="bg-blue-500 text-white font-bold py-2 px-2 rounded mr-2 border 
                        hover:bg-blue-700 transition duration-200">
                            <i className="fi fi-sr-info" alt="Hello"></i>
                        </button>
                    </>
                )
            },
        ],
        [],
    )
    

    // const row = []

    const row = React.useMemo(
        () => 
        users.map((user) => ({
            id: user._id,
            name: user.personal_info.name,
            uid: user.personal_info.uid,
            email: user.personal_info.email,
            pic: user.personal_info.pic,
            membership: user.personal_info.membership,
            specification: user.personal_info.specification,
            phone_number: user.social_info.phone_number,
            facebook_link: user.social_info.facebook_link,
            twitter_link: user.social_info.twitter_link,
        }
    )), [users]);


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
            <div className='p-8 lg:p-20 w-full'>
                <div className='md:pb-4 flex flex-col md:flex-row md:justify-between gap-4 md:gap-0'>
                    <h1 className='text-3xl font-bold text-primaryColor'>
                        {editingUser ? 'Edit User' : showAddUserForm ? 'Create an Account' : 'Users'}
                    </h1>

                    <div className="flex flex-col md:flex-row gap-2 md:gap-0">
                        {/* <div className='flex justify-end mt-4'> */}
                            <button
                                className='bg-primaryColor text-white w-full font-bold py-2 px-4 rounded mr-2'
                                onClick={handleExportToCSV}
                            >
                                Export to CSV
                            </button>
                        {/* </div> */}

                        <button
                            onClick={() => {
                                handleDrawer(null, "add")
                                // navigate(`/admin/dash/users/new`,)
                            }}
                            className='bg-primaryColor text-white w-full font-bold py-2 px-2 rounded mr-2'
                        >
                                Add New User
                        </button>
                        
                            
                        <input
                            type="text"
                            name="search"
                            id="search"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="bg-gray-100 border-2 w-full px-2 py-1 rounded-lg mr-2"
                        />
                        <select
                            name="category"
                            id="category"
                            value={selectedCategoryReport}
                            onChange={handleCategoryChange}
                            className="bg-gray-100 border-2 w-full px-2 py-1 rounded-lg"
                        >
                            <option value="Student">Student</option>
                            <option value="Professor">Professor</option>
                            <option value="Staff">Staff</option>
                        </select>
                            
                    </div>
                </div>
                {showAddUserForm ? (
                    // <AdminNewUserForm onAddUser={handleAddUser} />
                    <p>AdminNewUserForm</p>
                ) : editingUser ? (
                    // <AdminEditUserForm user={editingUser} onUpdateUser={handleUpdateUser} />
                    <p>AdminEditUserForm</p>
                ) : (
                    
                    <div className="w-full pt-1 mt-5 lg:mt-10 bg-white border" style={tableContainerStyles}>
                        <table 
                            className="w-full table-auto border-collapse"
                        {...getTableProps()}>
                            <thead>
                                {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
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
                                                <i class="fi fi-sr-caret-down"></i>
                                                ) : (
                                                <i class="fi fi-sr-caret-up"></i>
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
                                                className='border-b-2  p-4 text-sm text-gray-600 font-semibold text-center'
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

                )}
            </div>
            {open && (
                <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center rounded-xl">
                    <div className="w-[80%] lg:w-[40%] bg-white rounded-3xl shadow p-4 overflow-hidden">
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
                                <div className="flex justify-center items-center mt-10">
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setOpen(false)
                                            handleDeleteUser(chosenUser)
                                        }}
                                        className="bg-primaryColor text-white font-bold py-2 px-4 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            : drawerTitle === "Add User"?
                                <div className="flex flex-col overflow-y-auto h-[70h] pb-4">
                                    <AdminNewUser setOpen={setOpen} getAllUsers={getAllUsers}/>
                                </div>
                            : drawerTitle === "User Information" ?
                                <div className="flex flex-col overflow-y-auto h-[70vh]">
                                    <AdminUserInfo userId={chosenUser}/>
                                </div>
                            : null
                        }

                    </div>
                </div>
            )}
            
        </>
    )
}

export default AdminUsersPage