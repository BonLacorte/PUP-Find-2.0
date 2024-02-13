import React, { useEffect, useState } from 'react'
import { server } from '../server';
import axios from 'axios';

const SelectBox = () => {
    
    const [locations, setLocations] = useState([])

    useEffect(() => {
        getAllAdminLocation()
    }, [])

    const getAllAdminLocation = () => {
        axios.get(`${server}/user/get-all-admin`)
            .then(({ data: { admins } }) => {
                if (admins && Array.isArray(admins)) {
                    // const locations = {};
                    // console.log(admins)                    okay
                    // admins.forEach(admin => {
                    //     const officeLocation = admin.personal_info.office_location;
                    // });
                    const officeLocations = admins.map(
                        (admin) => admin.personal_info.office_location
                    )
                    setLocations(officeLocations)
                    console.log(locations)
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div>
            {/* <select> */}
                {locations.map((location, index) => (
                    <option key={index}>{location}</option>
                ))}
            {/* </select> */}
        </div>
    )
}

export default SelectBox