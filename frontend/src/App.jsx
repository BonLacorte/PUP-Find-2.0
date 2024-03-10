import { useEffect, useState } from 'react'
import { createContext } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import UserAuthForm from './pages/UserAuthForm'
import HomePage from './pages/HomePage'
import NewReportPage from './pages/Report/NewReportPage'
import LocatePage from './pages/Report/LocatePage'
import AccountPage from './pages/User/AccountPage'
import MessagePage from './pages/Chat/MessagePage'
import axios from 'axios'
import { server } from './server'
import { getAccessToken, setAccessToken, setUserId, setUserInfo } from './common/userInfo'
import AdminLayout from './admin/components/AdminLayout'
import AdminUserAuthForm from './admin/pages/AdminUserAuthForm'
import AdminHomePage from './admin/pages/AdminHomePage'
import AdminDash from './admin/pages/Dashboard/AdminDash'
import AdminUsersPage from './admin/pages/Users/AdminUsersPage'
import AdminEditUser from './admin/pages/Users/AdminEditUser'
import AdminNewUser from './admin/pages/Users/AdminNewUser'
import AdminReportPage from './admin/pages/Reports/AdminReportPage'
import AdminReportMatchPage from './admin/pages/Reports/AdminReportMatchPage'
import ChoicesPage from './pages/Report/ChoicesPage'

export const UserContext = createContext({})

const App = () => {

    const [userAuth, setUserAuth] = useState({})
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        axios.post(`${server}` + "/refresh_token", {}, {
            withCredentials: true,
        }).then( ({ data }) => {
            // let { access_token } = data
            // setUserAuth( access_token )
            // // console.log("App.jsx",data)
            // // console.log("access_token",access_token)
            // console.log("App.jsx data:",data.user_info._doc)
            if ( data && data.access_token && data.user_id ) {
                setAccessToken(data.access_token)
                userAuth.access_token = getAccessToken()
                setUserId(data.user_id)
                setUserInfo(data.user_info._doc)
            }
            setLoading(false)
        }).catch(err => {
            // console.log(err.response)
        });
    
    }, [])

    // if (loading) {
    //     return <Loader/>
    // }

    return (
        <BrowserRouter>
            <UserContext.Provider value={{userAuth, setUserAuth, user, setUser}}>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<HomePage />}/>
                        <Route path="login" element={<UserAuthForm type="login" />} />
                        <Route path="register" element={<UserAuthForm type="register" />} />
                        <Route path="missing">
                            <Route index element={<ChoicesPage type="missing"/>}/>
                            <Route path="locate" element={<LocatePage type="missing"/>}/>
                            <Route path="new" element={<NewReportPage type="missing"/>} />
                        </Route>
                        <Route path="found">
                            <Route index element={<ChoicesPage type="found"/>}/>
                            <Route path="new" element={<NewReportPage type="found"/>} />
                            <Route path="locate" element={<LocatePage type="found"/>}/>
                        </Route>
                        <Route path="account">
                            <Route index element={<AccountPage/>}/>
                        </Route>
                        <Route path="messages">
                            <Route index element={<MessagePage/>}/>
                        </Route>
                    </Route>

                    <Route path="/admin">
                        <Route index element={<AdminHomePage />}/>
                        <Route path="login" element={<AdminUserAuthForm type="login" />} />

                        <Route exact path="dash" element={<AdminLayout/>}>

                            <Route index element={<AdminDash/>} /> 
                            <Route path="reports">
                                <Route path='found' element={<AdminReportPage type="FoundReport" />} />
                                {/* <Route path='found/new' element={<AdminNewFoundLoad/>} /> */}
                                {/* <Route path='found/:id' element={<AdminItemPage/>} /> */}
                                {/* <Route path='found/info' element={<AdminReportInfo/>} /> */}
                                {/* <Route path='receipt/' element={<AdminClaimedReciptLoad/>} /> */}
                                <Route path='missing' element={<AdminReportPage type="MissingReport" />} />
                                {/* <Route path='missing/new' element={<AdminNewMissingLoad/>} /> */}
                                {/* <Route path='missing/info' element={<AdminReportInfo/>} /> */}
                                {/* <Route path='found/edit/:id' element={<AdminEditFoundForm/>} /> */}
                                {/* <Route path='missing/edit/:id' element={<AdminEditMissingForm/>} /> */}
                                <Route path='claimed' element={<AdminReportPage type="Claimed" />} />
                                <Route path='match/:report_id' element={<AdminReportMatchPage />} />
                            </Route>
                            <Route path="users">
                                <Route index element={<AdminUsersPage/>}/>
                                <Route path="edit/:user_id" element={<AdminEditUser/>}/>
                                <Route path="new" element={<AdminNewUser />}/>
                            </Route>
                            <Route path="messages">
                                <Route index element={<MessagePage/>}/>
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </UserContext.Provider>
        </BrowserRouter>
    )
}

export default App
