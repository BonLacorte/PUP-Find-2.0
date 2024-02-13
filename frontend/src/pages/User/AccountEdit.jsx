import React, { useEffect, useRef, useState } from 'react'
import ScrollableFeed from 'react-scrollable-feed';
import axios from 'axios'
import { getAccessToken, getUserInfo, getUserId } from '../../common/userInfo';
import { Toaster, toast } from "react-hot-toast"
import { uploadImage } from '../../common/cloudinary';
import InputBox from '../../components/InputBox';
import { server } from '../../server';

const AccountEdit = ({ user, setOpen, fetchUserProfile}) => {
    
    const access_token = getAccessToken()
    const user_info = getUserInfo()
    const user_id = getUserId()
    const [specificationLabel, setSpecificationLabel] = useState('Section: (Ex: BSIT 3-2)');
    let userAvatarRef = useRef()
    // let avatar = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    let avatar 
    let [loading, setLoading] = useState(true);
    let [formData, setFormData] = useState({
        // Initialize your form data structure here with default values
        name: '',
        uid:'',
        email: '',
        pic: '',
        access: '',
        membership: '',
        specification: '',
        phone_number: '',
        facebook_link: '',
        twitter_link: '',
        password: '',
        new_password: '',
    });


    const getUserData = async () => {
        
        setFormData({
            name: user.personal_info.name,
            uid: user.personal_info.uid,
            email: user.personal_info.email,
            // password: user.personal_info.location,
            pic: user.personal_info.pic,
            membership: user.personal_info.membership,
            specification: user.personal_info.specification,
            phone_number: user.social_info.phone_number,
            facebook_link:user.social_info.facebook_link,
            twitter_link: user.social_info.twitter_link,
        });

        avatar = user.personal_info.pic
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('User info', formData)

        axios.put(`${server}/user/update-user-info/${user_id}`, formData,
        {
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        }).then(({ data: { user } }) => {

            console.log("New user info",user)

            toast.success('Report updated successfully!');
            
            setOpen(false)
            // window.location.reload(true); 
            fetchUserProfile()
        }).catch(err => {
            console.log(err.response)
            toast.error('Error updating report');
        })
    };


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


    const handleChange = (fieldName, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };


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


    useEffect(() => {
        getUserData();

        // eslint-disable-next-line
    }, []);


    return (
        <ScrollableFeed>
            <>
                <Toaster/>
                <form id="formElement" className='flex flex-col font-semibold align-center w-full gap-2 px-10'>

                    
                        <>
                            <div className='relative w-32 h-32 rounded-full cursor-pointer mx-auto hover:opacity-80 bg-white border-4 border-grey overflow-hidden flex justify-center items-center'>
                                <label htmlFor="uploadAvatar" className="flex justify-center items-center">
                                    
                                        <img src={formData.pic} onError={handleAvatarError} className=' object-cover' alt="" ref={userAvatarRef}/>
                                    
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

                        {/* <div>
                            <p className="font-bold mt-10">Change Password (leave the 'New Password' and 'Old Password' blank if not changing)</p>
                        </div>
                    
                        <>
                            <div className="md:flex flex-row hidden w-full">
                                <div className="w-1/2 mr-4">
                                    <InputBox
                                        name="new_password"
                                        type="password"
                                        label="New Password"
                                        required
                                        // icon="fi-rr-envelope"
                                        value={formData.new_password}
                                        onChange={handleChange} 
                                    />
                                </div> 

                                <div className="w-1/2">
                                    <InputBox
                                        name="password"
                                        type="password"
                                        label="Old Password (for confirmation)"
                                        required
                                        // icon="fi-rr-envelope"
                                        value={formData.password}
                                        onChange={handleChange} 
                                    />
                                </div> 
                            </div>

                            <div className="md:hidden w-full mr-4">
                                <InputBox
                                    name="new_password"
                                    type="password"
                                    label="New Password"
                                    required
                                    // icon="fi-rr-envelope"
                                    value={formData.new_password}
                                    onChange={handleChange} 
                                />
                            </div>

                            <div className="md:hidden w-full">
                                <InputBox
                                    name="password"
                                    type="password"
                                    label="Old Password (for confirmation)"
                                    required
                                    // icon="fi-rr-envelope"
                                    value={formData.password}
                                    onChange={handleChange} 
                                />
                            </div>
                        </> */}

                    <button className='btn-primary mt-10' type='submit' 
                    onClick={handleSubmit}
                    >
                        UPDATE
                    </button>

                </form>
            </>
        </ScrollableFeed>
    )
}

export default AccountEdit