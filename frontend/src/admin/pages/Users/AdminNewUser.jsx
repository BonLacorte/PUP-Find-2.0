import React, { useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import ScrollableFeed from 'react-scrollable-feed'
import InputBox from '../../../components/InputBox'
import { uploadImage } from '../../../common/cloudinary'
import axios from 'axios'
import { server } from '../../../server'
import { getAccessToken } from '../../../common/userInfo'

const AdminNewUser = ({ setOpen, getAllUsers }) => {

    let { access_token } = getAccessToken()
    let userAvatarRef = useRef()
    let avatar = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"

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


    const handleChange = (fieldName, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };


    const handleSubmit = async (e) => {

        e.preventDefault()

        if (!formData.pic) {
            formData.pic = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        }
        
        if(e.target.className.includes("disable")) {
            return
        }

        let loadingToast = toast.loading("Loading...")

        e.target.classList.add('disable')

        console.log(formData)

        await axios.post(`${server}/user/register`, formData,
        {
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data }) => {

            e.target.classList.remove('disable')

            toast.dismiss(loadingToast)

            toast.success("Account successfully registered!")

            setOpen(false)
            // window.location.reload(true)
            getAllUsers()
            
        })
        .catch(({ response }) => {
            e.target.classList.remove('disable')
            toast.dismiss(loadingToast)
            toast.error(response.data.error)
        })
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

    return (
        // <div>AdminNewUser</div>
        <ScrollableFeed>
            <>
                <Toaster/>
                <form id="formElement" className='flex flex-col font-semibold align-center w-full gap-2 px-10'>

                    
                        <>
                            <div className='relative w-32 h-32 rounded-full cursor-pointer mx-auto hover:opacity-80 bg-white border-4 border-grey overflow-hidden flex justify-center items-center'>
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

                    <button className='btn-primary my-4' type='submit' 
                    onClick={handleSubmit}
                    >
                        CREATE USER
                    </button>

                </form>
            </>
        </ScrollableFeed>
    )
}

export default AdminNewUser