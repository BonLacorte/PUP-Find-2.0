import React, { useEffect, useContext, useState } from 'react'
import { Toaster, toast } from "react-hot-toast"
import { Locations } from '../../common/Locations';
import InputBox from '../../components/InputBox';
import { uploadImage } from '../../common/cloudinary';
import axios from 'axios';
import { server } from '../../server';
import Loader from '../../components/Loader';
import { getAccessToken, getUserId, getUserInfo } from '../../common/userInfo';
import { useNavigate, useLocation } from 'react-router-dom';

const NewReportPage = ({ type }) => {

    const user_id = getUserId()
    const user_info = getUserInfo()

    // console.log(user_info, "user_info")

    const access_token = getAccessToken()
    let currentDate = new Date().toISOString().split('T')[0];
    let navigate = useNavigate()
    let allAdminLocationObject = {}
    // let allAdmin

    let sampleImages = ["https://res.cloudinary.com/dkzlw5aub/image/upload/v1705757386/blog/yqfuo4okamadbjzlp7bf.jpg", 
    "https://res.cloudinary.com/dkzlw5aub/image/upload/v1705757387/blog/hpezshim4xcrwg1si6xf.png", 
    "https://res.cloudinary.com/dkzlw5aub/image/upload/v1705757387/blog/d7nxgpsnsoqyzfbz6skc.jpg", 
    "https://res.cloudinary.com/dkzlw5aub/image/upload/v1705757387/blog/htcvvag5r7dyi4kmeayw.jpg", 
    "https://res.cloudinary.com/dkzlw5aub/image/upload/v1705757388/blog/meeaepvucjdtuufargsb.jpg",
    "https://res.cloudinary.com/dkzlw5aub/image/upload/v1705757387/blog/hpezshim4xcrwg1si6xf.png", 
    "https://res.cloudinary.com/dkzlw5aub/image/upload/v1705757387/blog/d7nxgpsnsoqyzfbz6skc.jpg", 
    "https://res.cloudinary.com/dkzlw5aub/image/upload/v1705757387/blog/htcvvag5r7dyi4kmeayw.jpg", 
    "https://res.cloudinary.com/dkzlw5aub/image/upload/v1705757388/blog/meeaepvucjdtuufargsb.jpg",
    ]

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

    
    // console.log(user)
    const [allAdminLocation, setAllAdminLocation] = useState([]);
    const [allAdmin, setAllAdmin] = useState();

    const [ loading, setLoading ] = useState(true)
    const [ submitting, setSubmitting ] = useState(false);
    const [formData, setFormData] = useState({
        item_name: '',
        images: [],
        date: '',
        location: '',
        description: '',
        creator: '',
        status: '',
        type: '',
        office_location_surrendered: '',
    });

    const getAllAdminLocation = () => {
        axios.get(`${server}/user/get-all-active-admin`)
            .then(({ data: { admins } }) => {
                if (admins && Array.isArray(admins)) {
                    admins.forEach(admin => {
                        const officeLocation = admin.admin_info.office_location;
                        allAdminLocationObject[officeLocation] = officeLocation;
                    });

                    setAllAdmin(admins)
                    console.log('allAdminLocationObject before', allAdminLocationObject)

                    setAllAdminLocation(allAdminLocationObject)
                    console.log("allAdmin",allAdmin)
                    console.log("allAdminLocation",allAdminLocation)

                    setLoading(false)

                }
            })
            .catch(error => {
                console.error(error);
            });
    };



    useEffect(() => {

        getAllAdminLocation()

        console.log("hello1")

        
        console.log("hello2")

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
        console.log('formData.location', formData.location)
    }

    const handleOfficeLocationSurrendered = (e) => {
        let selectedValue = e.target.value;
        formData.office_location_surrendered = selectedValue
        console.log('formData.office_location_surrendered', formData.office_location_surrendered)
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
                    console.log(err);
                    return toast.error(err);
                });
        }
    };

    const handleCreateChatConversation = (e) => {
        
        // e.preventDefault();

        if(e.target.className.includes("disable")) {
            return
        }

        if (!access_token) {
            toast.error('Login first to create a report');
            return;
        }

        console.log(allAdmin)
        console.log(type)

        if (type === 'found') {
            let chosenAdmin
            console.log("formData.office_location_surrendered in handleCreateConversation", formData.office_location_surrendered)
            console.log("allAdmin in handleCreateConversation", allAdmin)
            
            // If the user is not an admin
            if (formData.office_location_surrendered !== '' && user_info.personal_info.access !== 'admin') {
                
                chosenAdmin = allAdmin.filter(admin => admin.admin_info.office_location === formData.office_location_surrendered)[0];
                console.log("chosenAdmin", chosenAdmin)
                console.log("uid", user_info.personal_info.uid)
                console.log(`chatName: ${chosenAdmin.personal_info.uid}-${user_info.personal_info.uid}`)

                axios.post(`${server}/chat/create-new-conversation`, {
                    chatName: `${chosenAdmin.personal_info.uid}_${user_info.personal_info.uid}`,
                    user: chosenAdmin.personal_info.uid
                }, { 
                    withCredentials: true,
                    headers: {
                        'authorization': `Bearer ${access_token}`
                    }
                })
                .then(({ data: { chat } }) => {
                    console.log('chat', chat);
                    toast.success('Chat conversation created successfully!');
                    
                    setTimeout(() => {
                        // e.target.classList.remove('disable')
                        navigate("/found/locate");
                    }, 3000);
                })
                .catch(({ response }) => {
                    console.log(response.data.error);
                    toast.error(response.data.error);
                });
            } 

        } else {
            
            // If the user is not an admin
            if (user_info.personal_info.access !== 'admin') {
                axios.get(`${server}/user/get-all-active-admin`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                })
                .then(({ data: { admins } }) => {
                    console.log('admins', admins);
    
                    admins.forEach(admin => {
                        console.log('admin', admin);
                        console.log('uid', user_info.personal_info.uid);
                        console.log(`chatName: ${admin.personal_info.uid}-${user_info.personal_info.uid}`);
    
                        axios.post(`${server}/chat/create-new-conversation`, {
                            chatName: `${admin.personal_info.uid}_${user_info.personal_info.uid}`,
                            user: admin.personal_info.uid,
                        }, {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                            },
                        })
                        .then(({ data: { chat } }) => {
                            console.log('chat', chat);
                            toast.success('Chat conversation created successfully!');
                            
                            setTimeout(() => {
                                // e.target.classList.remove('disable')
                                setSubmitting(false)
                                navigate("missing/locate")
                            }, 3000);
                        })
                        .catch(({ response }) => {
                            console.log(response.data.error);
                            toast.error(response.data.error);
                        });
                    });
                })
                .catch(({ response }) => {
                    console.log(response.data.error);
                    toast.error(response.data.error);
                });
            } 
        }
    }

    const handleSubmit = (e) => {

        if(e.target.className.includes("disable")) {
            return
        }

        setSubmitting(true)
        e.preventDefault()

        if(!access_token) {
            toast.error("Login first to create a report")
            return
        }
        
        let loadingToast = toast.loading("Creating " + (type === "missing" ? "Missing " : "Found ") + "report...")
        
        // e.target.classList.add('disable')

        formData.creator = user_info.personal_info.uid

        if (type === 'missing') {
            formData.status = 'Missing';
            formData.type = 'MissingReport';
        } else if (type === 'found') {
            formData.status = 'Processing';
            formData.type = 'FoundReport';
        }

        console.log(formData)

        // handleCreateChatConversation()

        axios.post(`${server}`+"/report/create-report", formData, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(() => {
            

            toast.dismiss(loadingToast)
            toast.success((type === "missing" ? "Missing" : "Found") + " report created successfully!");

            // handleCreateChatConversation(e)

            if (type === 'found') {
                let chosenAdmin
                console.log("formData.office_location_surrendered in handleCreateConversation", formData.office_location_surrendered)
                console.log("allAdmin in handleCreateConversation", allAdmin)
                
                // If the user is not an admin
                if (formData.office_location_surrendered !== '' && user_info.personal_info.access !== 'admin') {
                    
                    chosenAdmin = allAdmin.filter(admin => admin.admin_info.office_location === formData.office_location_surrendered)[0];
                    console.log("chosenAdmin", chosenAdmin)
                    console.log("uid", user_info.personal_info.uid)
                    console.log(`chatName: ${chosenAdmin.personal_info.uid}-${user_info.personal_info.uid}`)
    
                    axios.post(`${server}/chat/create-new-conversation`, {
                        chatName: `${chosenAdmin.personal_info.uid}_${user_info.personal_info.uid}`,
                        user: chosenAdmin.personal_info.uid
                    }, { 
                        withCredentials: true,
                        headers: {
                            'authorization': `Bearer ${access_token}`
                        }
                    })
                    .then(({ data: { chat } }) => {
                        console.log('chat', chat);
                        toast.success('Chat conversation created successfully!');
                        
                        // e.target.classList.remove('disable')
                        // setSubmitting(false)
                        setTimeout(() => {
                            setSubmitting(false)
                            navigate("/found/locate");
                        }, 3000);
                    })
                    .catch(({ response }) => {
                        console.log(response.data.error);
                        toast.error(response.data.error);
                    })
                    .finally(() => {
                        // e.target.classList.remove('disable')
                        // setSubmitting(false)
                    });
                } 
    
            } else {
                
                // If the user is not an admin
                if (user_info.personal_info.access !== 'admin') {
                    axios.get(`${server}/user/get-all-active-admin`, {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    })
                    .then(({ data: { admins } }) => {
                        console.log('admins', admins);
        
                        admins.forEach(admin => {
                            console.log('admin', admin);
                            console.log('uid', user_info.personal_info.uid);
                            console.log(`chatName: ${admin.personal_info.uid}-${user_info.personal_info.uid}`);
        
                            axios.post(`${server}/chat/create-new-conversation`, {
                                chatName: `${admin.personal_info.uid}_${user_info.personal_info.uid}`,
                                user: admin.personal_info.uid,
                            }, {
                                headers: {
                                    Authorization: `Bearer ${access_token}`,
                                },
                            })
                            .then(({ data: { chat } }) => {
                                console.log('chat', chat);
                                toast.success('Chat conversation created successfully!');
                                
                                e.target.classList.remove('disable')
                                // setSubmitting(false)
                                setTimeout(() => {
                                    setSubmitting(false)
                                    navigate("/missing/locate/")
                                }, 3000);
                            })
                            .catch(({ response }) => {
                                console.log(response.data.error);
                                toast.error(response.data.error);
                            })
                            .finally(() => {
                                // e.target.classList.remove('disable')
                                // setSubmitting(false)
                            });
                        });
                    })
                    .catch(({ response }) => {
                        console.log(response.data.error);
                        toast.error(response.data.error);
                    });
                } 
            }

        })
        .catch(({ response }) => {
            // e.target.classList.remove('disable')
            toast.dismiss(loadingToast)
            setSubmitting(false)
            console.log(response.data.error)
            toast.error(response.data.error)
        })
    }
    
    return (
        access_token ?
        <section className='flex justify-center items-center  border-green-700 h-[90vh] max-w-full '>
            {
                loading ? 
                    <Loader/>
                :
                <>
                    <Toaster/>

                    <div className="absolute hidden lg:flex flex-col left-0 bottom-0">
                        <img alt="" src="https://file.rendit.io/n/d4pFfFHPbtM6Gj5j2YWE.svg" className="w-20 h-16 absolute top-64 left-0 z-0" />
                        <img alt="" src="https://file.rendit.io/n/KPfOZKCRuRSFGmey9AWj.svg" className="w-12 h-56 absolute top-24 left-0 z-0"/>
                        <img alt="" src="https://file.rendit.io/n/lnOSNwFIl9xHUHBhIDjt.svg" className="relative z-0"/>
                    </div>
                    
                    <img alt="" src="https://file.rendit.io/n/6pqpGxjbbyM1B8AnjoDp.svg" className="lg:flex w-[111px] h-40 absolute top-24 right-0"/>

                    <div className="absolute lg:flex flex-col w-56 items-start right-0 bottom-0 z-0">
                        <img alt="" src="https://file.rendit.io/n/AyZ958KVZDdkvBnClSIZ.svg" className="w-40 h-40 absolute top-16 left-16 z-0" id="Ellipse"/>
                        <img alt="" src="https://file.rendit.io/n/52Gyzn7j1eB4irdFrXjv.svg" className="w-32 h-[286px] absolute top-24 left-24 z-0" id="Ellipse1"/>
                        <img alt="" src="https://file.rendit.io/n/i41HWlHDYSfHPajsbj4O.svg" className="relative z-0" id="Ellipse2"/>
                    </div>

                    <div className='bg-gray-100 bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl shadow-md flex flex-row justify-center items-center w-max h-full p-10  border-blue-600 scrollbar-thin scrollbar-webkit overflow-x-auto min-h-full xl:w-3/5'>
                        

                        
                            {/* <div className="border-solid border-[#dde1e6] bg-white relative flex flex-col justify-center mb-[301px] gap-6 w-[655px] items-start pt-4 pb-5 px-4 border"> */}
                            {/* <div className="border-solid font-semibold flex flex-col justify-center w-full border"> */}
                                <form className="flex flex-col font-semibold gap-2 overflow-x-auto " >
                                    <h1 className="text-3xl font-bold mb-4">
                                        Report your { type == "missing" ? "missing" : "found" } item
                                    </h1>

                                    <div className='w-full '>
                                        <InputBox
                                            name="item_name"
                                            type="text"
                                            label="Item Name"
                                            required
                                            // icon="fi-rr-envelope"
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
                                            // icon="fi-rr-envelope"
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
                                            // value={formData.membership}
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
                                            // icon="fi-rr-envelope"
                                            value={formData.uid}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="w-full">
                                        <label className="block mb-2" htmlFor="image"><span className='text-red-500'>{ type === 'found' ? "*" : null }</span>
                                            Item image: (Max of 3 images)
                                        </label>
                                        {
                                            type === 'found' ?
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
                                            :
                                            <input
                                                className="border-gray-300 rounded-md w-full"
                                                id="image"
                                                name="images"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleItemImagesUpload}
                                                multiple
                                                max="3"
                                            />
                                        }
                                        

                                        <div className="grid grid-cols-3 gap-4 py-2">
                                            {/* {Array.isArray(sampleImages) && sampleImages.slice(0, 3).map((image, index) => (
                                                <img className="w-40 h-30 object-contain" key={index} src={image} alt={`Image ${index + 1}`} />
                                            ))} */}
                                            {Array.isArray(formData.images) && formData.images.slice(0, 3).map((image, index) => (
                                                <img className="w-40 h-30 object-contain" key={index} src={image} alt={`Image ${index + 1}`} />
                                            ))}
                                        </div>

                                    </div>

                                    {
                                        type === 'found' ?
                                            <div className='w-full '>
                                                <label className="block mb-2"><span className='text-red-500'>*</span>
                                                    Found item will be surrendered at:
                                                </label>
                                                <select
                                                    name="office_location_surrendered"
                                                    id="office_location_surrendered"
                                                    // value={formData.office_location_surrendered}
                                                    onChange={handleOfficeLocationSurrendered}
                                                    className="w-[100%] rounded-md p-2 pl-12 border border-gray-300"
                                                >
                                                    <option>
                                                        Choose Office
                                                    </option>
                                                    {Object.values(allAdminLocation).map(location => (
                                                        <option key={location} value={location}>
                                                            {location}
                                                        </option>
                                                    ))} 
                                                        {/* <SelectBox/> */}
                                                    
                                                </select>
                                            </div>
                                        : ""
                                    }

                                <button className='btn-primary my-4' type='submit' onClick={handleSubmit} disabled={submitting}
                                >
                                    {submitting ? `Creating...`: `CREATE ${ type.toUpperCase() } REPORT`}
                                </button>
                                    
                                </form>
                            {/* </div> */}
                        

                    </div>
                </>
            }
        </section>
        :
        <div className="flex flex-col justify-center items-center h-screen gap-2">
            <p className="text-2xl font-bold text-center">{`You are not logged in`}</p>
            <button
                className='bg-primaryColor text-white font-bold py-2 px-4 rounded mr-2'
                onClick={() => navigate("/login")}
            >
                Login
            </button>
        </div>
    )
}

export default NewReportPage