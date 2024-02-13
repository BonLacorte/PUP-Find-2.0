import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAccessToken } from '../../../common/userInfo'
import { Toaster, toast } from "react-hot-toast"
import { server } from '../../../server'
import axios from 'axios'

const AdminEditUser = () => {

    let { access_token } = getAccessToken()
    let navigate = useNavigate()
    let { user_id } = useParams()

    let [userInfo, setUserInfo] = useState()
    
    useEffect(() => {
        getUserInfo()
        // eslint-disable-next-line
    }, [access_token])

    const getUserInfo = async () => {
        
        console.log("user_id",user_id)

        await axios.get(`${server}/user/get-user-by-user-id/${user_id}`,
        { 
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        }).then(({ data: {users} }) => {
            console.log("users",users)
            setUserInfo(users)
        }).catch(err => {
            console.log(err.response)
        })

    }

    return (
        <>
            <Toaster/>
            <div className='p-8 lg:p-20 w-full'>
                <p>Hello</p>
            </div>
        </>
    )
}

export default AdminEditUser