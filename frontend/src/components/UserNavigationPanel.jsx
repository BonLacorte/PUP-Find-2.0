import { Link, useNavigate } from "react-router-dom"
import PageAnimationWrapper from "../common/PageAnimationWrapper"
import { useContext } from "react"
import { UserContext } from "../App"
import axios from "axios"
import { getAccessToken, getUserInfo, setAccessToken } from "../common/userInfo"
import { server } from "../server"

const UserNavigationPanel = () => {

    const { userAuth: { username }, setUserAuth } = useContext(UserContext)

    let access_token = getAccessToken()
    let user_info = getUserInfo()
    let navigate = useNavigate()

    const logOutUser = (e) => {
        e.preventDefault()

        axios.post(`${server}/user/logout`, {}, { 
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        }).then( ({ data }) => {
            console.log(data)
            setAccessToken("")
            navigate("/")
            window.location.reload(true);
        }).catch(err => {
            console.log(err.response)
            return toast.error(err)
        });
    }

    return (
        // <PageAnimationWrapper 
        //     transition={{ duration: 0.2, y: { duration: 0.1 } }}
        //     className="absolute right-0 z-50"
        // >
            <div className="bg-white absolute right-0 border border-grey w-60 overflow-hidden duration-200">
                

                <Link to={`/account`} className="">
                <button className="text-left p-4 hover:bg-grey w-full pl-8 py-4">
                    <h1 className="font-bold text-xl mg-1 text-black">
                        Profile
                    </h1>
                </button>
                </Link>

                <span className="absolute border-t border-grey w-[100%]"></span>

                <button className="text-left p-4 hover:bg-grey w-full pl-8 py-4" onClick={logOutUser}>
                    <h1 className="font-bold text-xl mg-1 text-black">Sign Out</h1>
                    <p className="text-dark-grey">{user_info.name}</p>
                </button>
            </div>
        // </PageAnimationWrapper>
    )
}

export default UserNavigationPanel