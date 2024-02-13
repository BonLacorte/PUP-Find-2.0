import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { server } from '../../../../server';
import { getAccessToken, getUserInfo } from '../../../../common/userInfo';
import InputBox from '../../../../components/InputBox';
import ScrollableFeed from 'react-scrollable-feed';
import { Locations } from '../../../../common/Locations';
import Loader from '../../../../components/Loader';
import { uploadImage } from '../../../../common/cloudinary';

const AdminEditReport = ({ type, reportId,  setOpen, getAllReports}) => {
    
    const [ submitting, setSubmitting ] = useState(false);
    let [loading, setLoading] = useState(true);
    let [formData, setFormData] = useState({
        // Initialize your form data structure here with default values
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


    const access_token = getAccessToken()
    const user_info = getUserInfo()
    let currentDate = new Date().toISOString().split('T')[0];
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


    // Fetch the existing report data for editing
    const getReportData = async () => {
        try {
            await axios.get(`${server}/report/get-report-info/${reportId}`,
            {
                withCredentials: true,
                headers: {
                    'authorization': `Bearer ${access_token}`
                }
            })
            .then(({ data: {report} }) => {
                
                // console.log("report",report)
                // console.log("report_info",report.report_info)
                // console.log("report_info.item_name",report.report_info.item_name)


                setFormData({
                    item_name: report.report_info.item_name,
                    images: report.report_info.images,
                    date: new Date(report.report_info.date).toISOString().slice(0, 10),
                    location: report.report_info.location,
                    description: report.report_info.description,
                    creator: report.report_info.creatorId.personal_info.uid,
                    status: report.report_info.status,
                    type: report.report_info.type,
                    office_location_surrendered: report.report_info.office_location_surrendered,
                });
            })
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching report data');
        }
    };


    useEffect(() => {
        getReportData();

        // eslint-disable-next-line
    }, []);


    const handleChange = (fieldName, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const handleReportStatusChange = (e) => {
        let selectedValue = e.target.value;
        // formData.status = selectedValue

        setFormData((prevData) => ({
            ...prevData,
            status: selectedValue,
        }));

        // console.log('formData.status', formData.status)
    }
    

    const handleReportLocation = (e) => {
        let selectedValue = e.target.value;

        setFormData((prevData) => ({
            ...prevData,
            location: selectedValue,
        }));

        // console.log('formData.location', formData.location)
    }


    const handleDate = (e) => {
        let selectedValue = e.target.value;

        setFormData((prevData) => ({
            ...prevData,
            date: selectedValue,
        }));

        // console.log('formData.location', formData.location)
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitting(true);

        // console.log('Old report info', formData)

        axios.put(`${server}/report/update-report-info/${reportId}`, formData,
        {
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        }).then(({ data: { report} }) => {

            // console.log("New report info",report)

            toast.success('Report updated successfully!');
            
            setOpen(false)
            // window.location.reload(true); 
            getAllReports()
        }).catch(err => {
            // console.log(err.response)
            toast.error('Error updating report');
        }).finally(() => {
            setSubmitting(false);
        })

        // // Implement the logic to update the report in the database
        // try {
        //     const response = await axios.put(`${server}/report/update-report/${reportId}`, formData);
        //     toast.success('Report updated successfully!');
        //     setOpen(false);
        //     // You may choose to reload the page or update the data in your parent component
        // } catch (error) {
        //     console.error(error);
        //     toast.error('Error updating report');
        // }
    };


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


    return (
        // <div>
        //     {/* <p>AdminEditReport</p>
        //     <p>{reportId}</p> */}
        // </div>
        <ScrollableFeed>
            {
                loading ? 
                    <Loader/>
                :
                <>
                    <Toaster />
                    <form className="flex flex-col font-semibold gap-2 border-blue-700 px-10">
                        {/* Render your input fields similar to AdminNewReport */}
                        <InputBox
                            name="item_name"
                            type="text"
                            label="Item Name"
                            required
                            value={formData.item_name}
                            onChange={handleChange}
                        />
                        {/* Add more InputBox components for other fields */}
                        
                        <div className='w-full '>
                            {/* <InputBox
                                name="date"
                                type="date"
                                label={"Date item " + (type == "MissingReport" ? "missing" : "found")}
                                required
                                max={currentDate}
                                value={formData.date}
                                onChange={handleChange}
                            /> */}
                            <label className="flex mb-2" htmlFor="name"><span className='text-red-500'>*</span>
                                Date {type == "MissingReport" ? "missing" : "found"}
                            </label>
                            <input
                                className="w-[100%] rounded-md p-2 pl-12 border border-gray-300"
                                id="date"
                                name="date"
                                type="date"
                                max={currentDate}
                                value={formData.date}
                                required
                                onChange={handleDate}
                            />
                        </div>

                        <div className='w-full '>
                            <label className="block mb-2"><span className='text-red-500'>*</span>
                                { type == "MissingReport" ? "Possible location item lost" : "Location item found" }:
                            </label>
                            <select
                                name="location"
                                id="location"
                                value={formData.location}
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
                                disabled
                                name="creator"
                                type="text"
                                label="User UID"
                                required
                                value={formData.creator}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="w-full">
                            <label className="block mb-2"><span className='text-red-500'>*</span>
                                Report Status:
                            </label>
                            <select
                                disabled={type === "MissingReport"}
                                name="status"
                                id="status"
                                value={formData.status}
                                className="w-[100%] rounded-md p-2 pl-12 border border-gray-300"
                                aria-placeholder={formData.status}
                                onChange={handleReportStatusChange}
                            >
                                {
                                    type === "MissingReport" ?
                                        <>
                                            <option>
                                                Missing
                                            </option>
                                        </>
                                    :
                                    <>
                                        <option>
                                            Processing
                                        </option >
                                        <option>
                                            Claimable
                                        </option >
                                    </>
                                }
                            </select>
                        </div>

                        <button className="btn-primary my-4" type="submit" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? `Updating...` : `UPDATE REPORT`}
                        </button>
                    </form>
                </>
            }
        </ScrollableFeed>
    )
}

export default AdminEditReport