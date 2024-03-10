import React, { useEffect, useState } from 'react'
import { getAccessToken, getUserId, getUserInfo } from '../../../../common/userInfo'
import { Locations } from '../../../../common/Locations'
import axios from 'axios'
import { server } from '../../../../server'
import InputBox from '../../../../components/InputBox'
import Loader from '../../../../components/Loader'
import { Toaster, toast } from "react-hot-toast"
import { uploadImage } from '../../../../common/cloudinary'
import ScrollableFeed from 'react-scrollable-feed'

const AdminNewReport = ({ type, setOpen }) => {
    
    const user_id = getUserId()
    const user_info = getUserInfo()
    const [ submitting, setSubmitting ] = useState(false);
    const access_token = getAccessToken()
    let currentDate = new Date().toISOString().split('T')[0];
    let allAdminLocationObject = {}
    let options = Object.values(Locations).map(location => {
        return (
            <option
                key={location}
                value={location}
            > 
                {location}
            </option >
        )
    })

    
    // // console.log(user)
    const [allAdminLocation, setAllAdminLocation] = useState([]);
    const [allAdmin, setAllAdmin] = useState();

    const [ loading, setLoading ] = useState(true)

    const [formData, setFormData] = useState({
        item_name: '',
        images: [],
        date: '',
        location: '',
        description: '',
        creator: '',
        status: '',
        type: '',
        office_location_surrendered: (user_info.admin_info.office_location),
    });

    const getAllAdminLocation = () => {
        axios.get(`${server}/user/get-all-admin`)
            .then(({ data: { admins } }) => {
                if (admins && Array.isArray(admins)) {
                    admins.forEach(admin => {
                        const officeLocation = admin.admin_info.office_location;
                        allAdminLocationObject[officeLocation] = officeLocation;
                    });

                    setAllAdmin(admins)
                    // console.log('allAdminLocationObject before', allAdminLocationObject)

                    setAllAdminLocation(allAdminLocationObject)
                    // console.log("allAdmin",allAdmin)
                    // console.log("allAdminLocation",allAdminLocation)

                    setLoading(false)

                }
            })
            .catch(error => {
                console.error(error);
            });
    };


    useEffect(() => {

        getAllAdminLocation()

        // eslint-disable-next-line
    }, [] )

    

    const handleChange = (fieldName, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const handleReportLocation = (e) => {
        let selectedValue = e.target.value;
        formData.location = selectedValue
        // console.log('formData.location', formData.location)
    }

    const handleItemImagesUpload = (e) => {
        let files = e.target.files;

        if (files && files.length > 0) {
            let loadingToast = toast.loading('Uploading...');

            // Iterate through the selected files
            Promise.all(
                Array.from(files).map((file) => {
                    return uploadImage(file);
                })
            )
                .then((imgUrls) => {
                    // Set the uploaded images in the state
                    setFormData((prevData) => ({
                        ...prevData,
                        images: imgUrls.slice(0, 3),
                    }));

                    toast.dismiss(loadingToast);
                    toast.success('Images Uploaded');
                })
                .catch((err) => {
                    toast.dismiss(loadingToast);
                    // console.log(err);
                    return toast.error(err);
                });
        }
    };

    const handleCreateChatConversation = () => {
        if (!access_token) {
            toast.error('Login first to create a report');
            return;
        }

        if (user_info.personal_info.access !== 'Admin') {
            formData.creator = user_info.personal_info.uid
        }

        if (type === 'FoundReport') {
            
            // If the user is an admin
            if (formData.office_location_surrendered !== '' && user_info.personal_info.access === 'Admin') {
                
                axios.post(`${server}/chat/create-new-conversation`, {
                    chatName: `${user_info.personal_info.uid}_${formData.creator}`,
                    user: formData.creator,
                }, {
                    withCredentials: true,
                    headers: {
                        'authorization': `Bearer ${access_token}`
                    }
                })
                .then(({ data: { chat } }) => {
                    // console.log('chat', chat);
                    toast.success('Chat conversation created successfully!');

                    setOpen(false)
                    window.location.reload(true); 
                })
                .catch(({ response }) => {
                    // console.log(response.data.error);
                    toast.error(response.data.error);
                });
            }
        } else {
            
            // If the user is an admin
            if ( user_info.personal_info.access === 'Admin') {
                axios.get(`${server}/user/get-all-admin`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                })
                .then(({ data: { admins } }) => {
    
                    admins.forEach(admin => {
    
                        axios.post(`${server}/chat/create-new-conversation`, {
                            chatName: `${admin.personal_info.uid}_${formData.creator}`,
                            user: formData.creator,
                            report_type: "MissingReport",
                            admin_id: admin._id,
                        }, {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                            },
                        })
                        .then(({ data: { chat } }) => {
                            // console.log('chat', chat);
                            toast.success('Chat conversation created successfully!');

                            // navigate("/admin/dash")
                            setOpen(false)
                            window.location.reload(true); 
                        })
                        .catch(({ response }) => {
                            // console.log(response.data.error);
                            toast.error(response.data.error);
                        });
                    });
                })
                .catch(({ response }) => {
                    // console.log(response.data.error);
                    toast.error(response.data.error);
                });
            }
        }
    }

    const handleSubmit = (e) => {

        e.preventDefault()

        setSubmitting(true)

        if(!access_token) {
            toast.error("Login first to create a report")
            return
        }
        let loadingToast = toast.loading("Creating " + (type === "missing" ? "Missing " : "Found ") + "report...")
        e.target.classList.add('disable')
        if (user_info.personal_info.access !== 'Admin') {
            formData.creator = user_info.personal_info.uid
        }
        if (type === 'MissingReport') {
            formData.status = 'Missing';
            formData.type = 'MissingReport';
        } else if (type === 'FoundReport') {
            formData.status = 'Processing';
            formData.type = 'FoundReport';
        }
        // console.log(formData)
        axios.post(`${server}`+"/report/create-report", formData, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(() => {
            e.target.classList.remove('disable')

            toast.dismiss(loadingToast)
            toast.success((type === "MissingReport" ? "Missing" : "Found") + " report created successfully!");

            handleCreateChatConversation()
        })
        .catch(({ response }) => {
            e.target.classList.remove('disable')
            toast.dismiss(loadingToast)
            // console.log(response.data.error)
            toast.error(response.data.error)
        }).finally(() => {
            setSubmitting(false)
        })
    }
    
    return (
        <ScrollableFeed>
            <>
                <Toaster/>
                <form className="flex flex-col font-semibold gap-2 border-blue-700 px-10" >
                    <div className='w-full '>
                        <InputBox
                            name="item_name"
                            type="text"
                            label="Item Name"
                            required
                            value={formData.item_name}
                            onChange={handleChange}  
                        />
                    </div>

                    <div className='w-full '>
                        <InputBox
                            name="date"
                            type="date"
                            label={"Date item " + (type == "missing" ? "missing" : "found")}
                            required
                            max={currentDate}
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='w-full '>
                        <label className="block mb-2"><span className='text-red-500'>*</span>
                            { type == "missing" ? "Possible location item lost" : "Location item found" }:
                        </label>
                        <select
                            name="location"
                            id="location"
                            onChange={handleReportLocation}
                            className="w-[100%] rounded-md p-2 pl-12 border  border-gray-300"
                        >
                            <option>
                                Choose Location
                            </option>
                            {options}
                        </select>
                    </div>

                    <div className="w-full">
                        <InputBox
                            name="description"
                            type="textarea"
                            label="Description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="w-full">
                        <label className="block mb-2" htmlFor="image"><span className='text-red-500'>*</span>
                            Item image: (Max of 3 images)
                        </label>
                        <input
                            className="border-gray-300 rounded-md w-full"
                            id="image"
                            name="images"
                            type="file"
                            accept="image/*"
                            required
                            onChange={handleItemImagesUpload}
                            multiple
                            max="3"
                        />

                        <div className="grid grid-cols-3 gap-4 py-2">
                            {Array.isArray(formData.images) && formData.images.slice(0, 3).map((image, index) => (
                                <img className="w-40 h-30 object-contain" key={index} src={image} alt={`Image ${index + 1}`} />
                            ))}
                        </div>

                    </div>

                    {
                        type !== "MissingReport" ?
                            <div className='w-full '>
                                <label className="block mb-2"><span className='text-red-500'>*</span>
                                    Found item will be surrendered at:
                                </label>
                                <select
                                    disabled
                                    name="office_location_surrendered"
                                    id="office_location_surrendered"
                                    value={formData.office_location_surrendered}
                                    className="w-[100%] rounded-md p-2 pl-12 border border-gray-300"
                                    aria-placeholder={formData.office_location_surrendered}
                                >
                                    <option>
                                        {formData.office_location_surrendered}
                                    </option>
                                </select>
                            </div>
                        : ""
                    }

                    <div className="w-full">
                        <InputBox
                            name="creator"
                            type="text"
                            label="User UID"
                            required
                            value={formData.creator}
                            onChange={handleChange}
                        />

                    </div>

                    <button className='btn-primary my-4' type='submit' onClick={handleSubmit}
                    >
                        {submitting ? `Creating...` : type === "MissingReport" ? "CREATE MISSING REPORT" :  "CREATE FOUND REPORT"}
                    </button>
                    
                </form>
            </>
        </ScrollableFeed>
    )
}

export default AdminNewReport