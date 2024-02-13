import React, { createContext, useContext, useRef, useState } from 'react';
import axios from 'axios';
import { server } from '../server';
import { Link, useNavigate } from 'react-router-dom';
import InputBox from '../components/InputBox';
import { Toaster, toast } from "react-hot-toast"
import { storeInSession } from '../common/session';
import { UserContext } from '../App';
import { uploadImage } from '../common/cloudinary';
import defaultAvatar from '../imgs/blog banner.png'
import ScrollableFeed from 'react-scrollable-feed';

const UserAuthForm = ({ type }) => {

    let userAvatarRef = useRef()
    let avatar = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"

    let { userAuth: { access_token }, setUserAuth } = useContext(UserContext)

    // console.log(access_token)

    let navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        uid: '',
        email: '',
        phone_number: '',
        specification: '',
        twitter_link: '',
        facebook_link: '',
        password: '',
        confirm_password: '',
        access: 'User',
        membership: 'Student',
        pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        // ... other fields
    });

    const [specificationLabel, setSpecificationLabel] = useState('Section: (Ex: BSIT 3-2)');

    
    const onMembershipChange = (e) => {
        let selectedValue = e.target.value;
        formData.membership = selectedValue
        // Set the specification label based on the selected membership
        switch (selectedValue) {
            case 'Student':
                setSpecificationLabel('Section: (Ex: BSIT 3-2)');
                break;
            case 'Professor':
                setSpecificationLabel('Department: (Ex: CCIS)');
                break;
            case 'Staff':
                setSpecificationLabel('Role: (Ex: Utility)');
                break;
            default:
                setSpecificationLabel('Section: (Ex: BSIT 3-2)');
                break;
        }
    };

    const userAuthThroughServer = async (serverRoute, formData, e) => {

        if(e.target.className.includes("disable")) {
            return
        }

        let loadingToast = toast.loading("Loading...")

        e.target.classList.add('disable')

        await axios.post(`${server}`+`${serverRoute}`, formData,
        { withCredentials: true })
        .then(({ data }) => {
            // storeInSession("user", JSON.stringify(data))
            if (type == "login") {
                console.log('Login, data:',data)
                setUserAuth(data)
            }    

            e.target.classList.remove('disable')

            toast.dismiss(loadingToast)

            if (type == "login") {
                toast.success("Successfully logged in!")
                
                setTimeout(() => {
                    
                    navigate("/")
                    window.location.reload(true); 
                }, 1000)
            } else {
                toast.success("Account successfully registered!")

                setTimeout(() => {
                    navigate("/login")
                }, 1000)
            }
            
        })
        .catch(({ response }) => {
            e.target.classList.remove('disable')
            toast.dismiss(loadingToast)
            toast.error(response.data.error)
        })
    }

    const handleChange = (fieldName, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const handleSubmit = (e) => {
        
        e.preventDefault()

        let serverRoute = type == "login" ? "/user/login" : "/user/register"

        if (!formData.pic) {
            formData.pic = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        }

        console.log(formData)

        userAuthThroughServer(serverRoute, formData, e)
    }


    const handleAvatarUpload = (e) => {
        let img = e.target.files[0]

        if (img) {

            let loadingToast = toast.loading("Uploading...")

            uploadImage(img).then((imgUrl) => {
                if(imgUrl) {
                    console.log(`On the upload image function: `, imgUrl)
                    toast.dismiss(loadingToast)
                    toast.success("Uploaded")
                    userAvatarRef.current.src = imgUrl

                    formData.pic = imgUrl

                    console.log("avatar1", avatar)
                }
            })
            .catch(err => {
                toast.dismiss(loadingToast)
                console.log(err)
                return toast.error(err)
            })
        }
    }
    

    const handleAvatarError = (e) => {
        let img = e.target

        img.src = defaultAvatar
    } 

    return (
        <section className={'flex justify-center items-center max-w-full h-[90vh] border-red-700 overflow-hidden' }>
            
            <Toaster/>

            <div className="absolute flex flex-col left-0 bottom-0">
                <img alt="" src="https://file.rendit.io/n/d4pFfFHPbtM6Gj5j2YWE.svg" className="w-20 h-16 absolute top-64 left-0 z-0" />
                <img alt="" src="https://file.rendit.io/n/KPfOZKCRuRSFGmey9AWj.svg" className="w-12 h-56 absolute top-24 left-0 z-0"/>
                <img alt="" src="https://file.rendit.io/n/lnOSNwFIl9xHUHBhIDjt.svg" className="relative z-0"/>
            </div>
            
            <img alt="" src="https://file.rendit.io/n/6pqpGxjbbyM1B8AnjoDp.svg" className="flex w-[111px] h-40 absolute top-24 right-0"/>

            <div className="absolute flex flex-col w-56 items-start right-0 bottom-0 z-0">
                <img alt="" src="https://file.rendit.io/n/AyZ958KVZDdkvBnClSIZ.svg" className="w-40 h-40 absolute top-16 left-16 z-0" id="Ellipse"/>
                <img alt="" src="https://file.rendit.io/n/52Gyzn7j1eB4irdFrXjv.svg" className="w-32 h-[286px] absolute top-24 left-24 z-0" id="Ellipse1"/>
                <img alt="" src="https://file.rendit.io/n/i41HWlHDYSfHPajsbj4O.svg" className="relative z-0" id="Ellipse2"/>
            </div>

                <div className={'bg-gray-100 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl shadow-md flex justify-center items-center w-max h-full overflow-y-auto p-10 border-blue-600 ' + ( type != 'register' ? ' lg:w-96 h-max'  : ' lg:w-3/5 xl:w-4/5 min-h-full ' )}>
                    {/* <div className="border-solid font-semibold flex flex-col justify-center w-full"> */}
                    <ScrollableFeed>
                        <form id="formElement" className='flex flex-col font-semibold align-center w-full gap-2'>

                            {
                                type != "register" ?
                                <header className="text-center">
                                    {/* <img src={Redpupfind} alt="PUP Logo" className="w-20 mx-auto mb-4" /> */}
                                    <img alt="" className="w-32 mx-auto" src="https://file.rendit.io/n/033oE67RrtllAVLok4Ha.png"/>
                                    <h1 className="text-3xl font-bold">PUP Find</h1>
                                    <p className=" text-sm my-2">Sign in to start your session</p>
                                </header>
                                : ""
                            }

                            {
                                type != "login" ?
                                <>
                                    <div className='relative w-32 h-32 rounded-full cursor-pointer mx-auto hover:opacity-80 bg-white  border-grey overflow-hidden flex justify-center items-center'>
                                        <label htmlFor="uploadAvatar" className="flex justify-center items-center">
                                            
                                                <img src={avatar} onError={handleAvatarError} className=' object-cover' alt="" ref={userAvatarRef}/>
                                            
                                            <input type="file" id="uploadAvatar" accept='.png, .jpg, .jpeg' className='border-green-700' style={{ position: 'absolute', opacity: 0, height: '100%', width: '100%', cursor: 'pointer' }} onChange={handleAvatarUpload} />
                                        </label>
                                    </div>

                                    <div className='flex flex-row justify-center items-center mb-4'>
                                        <h2 className="text-2xl font-semibold mr-2">I am a PUPian</h2>
                                        
                                        <select
                                            name="membership"
                                            id="membership"
                                            value={formData.membership}
                                            onChange={onMembershipChange}
                                            className="bg-gray-100 border-2 px-2 py-1 rounded-lg text-primaryColor font-semibold"
                                        >
                                            <option value="Student">Student</option>
                                            <option value="Professor">Professor</option>
                                            <option value="Staff">Staff</option>
                                        </select>
                                    </div>
                                </>
                                : ""
                            }

                            {
                                type != "login" ?
                                    <>
                                        <div className="md:flex flex-row hidden w-full">
                                            <div className="w-1/2 mr-4">
                                                <InputBox
                                                    name="name"
                                                    type="text"
                                                    label="Name"
                                                    // icon="fi-rr-user"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </div> 

                                            <div className="w-1/2">
                                                <InputBox
                                                    name="uid"
                                                    type="text"
                                                    label="ID Number"
                                                    required
                                                    // icon="fi-rr-envelope"
                                                    value={formData.uid}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="md:hidden w-full mr-4">
                                        <InputBox
                                            name="name"
                                            type="text"
                                            label="Name"
                                            // icon="fi-rr-user"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        </div>

                                        <div className="md:hidden w-full">
                                        <InputBox
                                            name="uid"
                                            type="text"
                                            label="ID Number"
                                            required
                                            // icon="fi-rr-envelope"
                                            value={formData.uid}
                                            onChange={handleChange}
                                        />
                                        </div>
                                    </>
                                : ""
                            }

                            <div className="flex flex-col w-full">
                                <InputBox
                                    name="email"
                                    type="email"
                                    label="Email"
                                    required
                                    // icon="fi-rr-envelope"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            {
                                type != "login" ?
                                <>

                                    <div className="md:flex flex-row hidden w-full">
                                        <div className="w-1/2 mr-4">
                                            <InputBox
                                                name="phone_number"
                                                type="number"
                                                label="Phone Number"
                                                required
                                                // icon="fi-rr-envelope"
                                                value={formData.phone_number}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="w-1/2">
                                            <InputBox
                                                name="specification"
                                                type="text"
                                                // label="ID Number"
                                                required
                                                specificationLabel={specificationLabel}
                                                value={formData.specification}
                                                onChange={handleChange}                                                    // icon="fi-rr-envelope"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:hidden w-full mr-4">
                                        <InputBox
                                            name="phone_number"
                                            type="number"
                                            label="Phone Number"
                                            required
                                            // icon="fi-rr-envelope"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="md:hidden w-full">
                                        <InputBox
                                            name="specification"
                                            type="text"
                                            // label="ID Number"
                                            required
                                            specificationLabel={specificationLabel}   
                                            value={formData.specification}
                                            onChange={handleChange}                                                  // icon="fi-rr-envelope"
                                        />
                                    </div>
                                </>
                                : ""
                            }

                            {
                                type != "login" ?
                                <div className="flex flex-col w-full">
                                    <InputBox
                                        name="twitter_link"
                                        type="text"
                                        label="Twitter link"
                                        // icon="fi-rr-envelope"
                                        value={formData.twitter_link}
                                        onChange={handleChange}  
                                    />
                                </div>
                                : ""    
                            }

                            {
                                type != "login" ?
                                <div className="flex flex-col w-full">
                                    <InputBox
                                        name="facebook_link"
                                        type="text"
                                        label="Facebook link"
                                        // icon="fi-rr-envelope"
                                        value={formData.facebook_link}
                                        onChange={handleChange}  
                                    />
                                </div>
                                : ""    
                            }

                            {
                                type != "login" ?
                                <>
                                    <div className="md:flex flex-row hidden w-full">
                                        <div className="w-1/2 mr-4">
                                            <InputBox
                                                name="password"
                                                type="password"
                                                label="Password"
                                                required
                                                // icon="fi-rr-envelope"
                                                value={formData.password}
                                                onChange={handleChange} 
                                            />
                                        </div> 

                                        <div className="w-1/2">
                                            <InputBox
                                                name="confirm_password"
                                                type="password"
                                                label="Confirm password"
                                                required
                                                // icon="fi-rr-envelope"
                                                value={formData.confirm_password}
                                                onChange={handleChange} 
                                            />
                                        </div> 
                                    </div>

                                    <div className="md:hidden w-full mr-4">
                                        <InputBox
                                            name="password"
                                            type="password"
                                            label="Password"
                                            required
                                            // icon="fi-rr-envelope"
                                            value={formData.password}
                                            onChange={handleChange} 
                                        />
                                    </div>

                                    <div className="md:hidden w-full">
                                        <InputBox
                                            name="confirm_password"
                                            type="password"
                                            label="Confirm password"
                                            required
                                            // icon="fi-rr-envelope"
                                            value={formData.confirm_password}
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </>
                                :
                                <div className="w-full mr-4">
                                    <InputBox
                                        name="password"
                                        type="password"
                                        label="Password"
                                        required
                                        // icon="fi-rr-envelope"
                                        value={formData.password}
                                        onChange={handleChange} 
                                    />
                                </div>    
                            }

                            <button className='btn-primary my-4' type='submit' 
                            onClick={handleSubmit}
                            >
                                { type.toUpperCase() }
                            </button>

                            {
                                type == "login" ?
                                <p className='mt-4 text-dark-grey text-center'>
                                    Don't have an account ?
                                    <br/>
                                    <Link to="/register" className="underline text-black">
                                        Register here.
                                    </Link>
                                </p>
                                :
                                <p className='mt-4 text-dark-grey text-center'>
                                    Already have an account?
                                    <br/>
                                    <Link to="/login" className="underline text-black">
                                        Login here.
                                    </Link>
                                </p>
                            }
                        </form>
                    {/* </div> */}
                    </ScrollableFeed>
                </div>
        </section>
    );
}

export default UserAuthForm