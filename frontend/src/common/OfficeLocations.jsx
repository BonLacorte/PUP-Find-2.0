import axios from "axios";
import { server } from "../server";

let officeLocation = null
let locations = {};

export const getAllAdminLocation = () => {

    
    axios.get(`${server}/user/get-all-admin`)
        .then(({ data: { admins } }) => {
            
            if (admins && Array.isArray(admins)) {
                admins.forEach(admin => {
                    officeLocation = admin.personal_info.office_location;
                    locations[officeLocation] = officeLocation;
                    // console.log('locations =>', locations)
                });
            }
            return locations
        })
        .catch(error => {
            console.error(error);
        });
};

// export const OfficeLocations = {}