import express from 'express'
// import Report from "../models/Report";
import Report from '../models/Report.js';
import catchAsyncErrors from "./../middleware/catchAsyncErrors.js"
import { Admin, User } from '../models/User.js';
import { verifyJWT } from '../middleware/verifyJWT.js';

const router = express.Router();

// Dashboard - monthly missing report counts in a year
router.get("/counts/:year", catchAsyncErrors(async (req, res, next) => {
    
    // // console.log(req.params.year)
    const year = parseInt(req.params.year); // Parse the year from the URL parameter
    const startOfYear = new Date(year, 0, 1); // January 1st of the selected year
    const endOfYear = new Date(year, 11, 31, 23, 59, 59); // December 31st of the selected year

    // Fetch data for the selected year from your database
    // You can use Mongoose or any other database library here
    await Report.find({
        "report_info.type": 'MissingReport',
        createdAt: {
            $gte: startOfYear,
            $lte: endOfYear,
        }
        /* Add more filters based on your data structure if needed */
    }).then((reports) => {
        // // console.log("counts - reports: ",reports)
         // Function to process data and calculate counts for each month
        let processData = (reports) => {
            // Initialize an object to store counts for each month
            let countsByMonth = {};

            // Iterate through the data and count reports for each month
            reports.forEach((report) => {
                let reportDate = new Date(report.report_info.date);
                let year = reportDate.getFullYear();
                let month = reportDate.getMonth() + 1; // Month is 0-based (0 = January, 11 = December)

                // Create a key for the month and year combination
                const key = `${year}-${month}`;

                // Increment the count for the month
                if (countsByMonth[key]) {
                    countsByMonth[key]++;
                } else {
                    countsByMonth[key] = 1;
                }
            });

            // Transform countsByMonth object into an array of objects
            const formattedData = Object.entries(countsByMonth).map(([key, value]) => ({
                month: key,
                count: value,
            }));

            // Sort the formattedData array by month and year
            formattedData.sort((a, b) => {
                const [yearA, monthA] = a.month.split('-').map(Number);
                const [yearB, monthB] = b.month.split('-').map(Number);

                if (yearA !== yearB) {
                    return yearA - yearB;
                }

                return monthA - monthB;
            });
            // // console.log(`formattedData`, formattedData)
            return formattedData;
        };

        const formattedData = processData(reports);
        return res.status(200).json(formattedData);
    })

    
}))


// Dashboard - Get Report Counts
router.get("/counts", verifyJWT, catchAsyncErrors(async (req, res, next) => {

    // // console.log("req.user:",req.user)

    // let admin  

    let admin = await User.findById({ _id: req.user })
    .populate('admin_info')
    // .then((user) => {
    //     // admin = user
    //     // // console.log("Admin", user)
    // })

    // // console.log("let admin", admin)
    // // console.log("admin.admin_info.office_location", admin.admin_info.office_location)
    // // console.log("admin.personal_info.office_location", admin.personal_info.office_location)

    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    await Report.find({
        "report_info.type": 'MissingReport',
        ...(startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {}),
    }).then( async (reports) => {
        // // console.log({reports})

        
        let locationCounts = {};
        let userSpecifications = {};
        
        // Calculate location counts
        reports.forEach((report) => {
            // // // console.log(report)
            
            const { report_info: { location } } = report;
            if (locationCounts[location]) {
                locationCounts[location]++;
            } else {
                locationCounts[location] = 1;
            }
        });
        // // // console.log(locationCounts)

        // Calculate user specifications counts
        for (const report of reports) {
            // const creator = await User.findOne({
            //     "personal_info.uid": report.report_info.creatorId.personal_info.uid,
            // });
            const creator = await User.findById(report.report_info.creatorId);
            // console.log('creator', creator)
            if (creator && creator.personal_info.specification) {
                if (userSpecifications[creator.personal_info.specification]) {
                    userSpecifications[creator.personal_info.specification]++;
                } else {
                    userSpecifications[creator.personal_info.specification] = 1;
                }
            }
        }

        // Sort location counts from highest to lowest
        const sortedLocationCounts = Object.entries(locationCounts).sort(
            (a, b) => b[1] - a[1]
        );

        // Sort user specifications counts from highest to lowest
        const sortedUserSpecifications = Object.entries(userSpecifications).sort(
            (a, b) => b[1] - a[1]
        );

        const missingReportCount = await Report.countDocuments({
            "report_info.type": 'MissingReport',
            "report_info.status": 'Missing',
            ...(startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {}),
        });

        const claimedReportCount = await Report.countDocuments({
            "report_info.type": 'FoundReport',
            "report_info.status": 'Claimed',
            "report_info.office_location_surrendered": admin.personal_info.office_location,
            ...(startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {}),
        });

        const claimableReportCount = await Report.countDocuments({
            "report_info.type": 'FoundReport',
            "report_info.status": 'Claimable',
            "report_info.office_location_surrendered": admin.personal_info.office_location,
            ...(startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {}),
        });

        const processingReportCount = await Report.countDocuments({
            "report_info.type": 'FoundReport',
            "report_info.status": 'Processing',
            "report_info.office_location_surrendered": admin.personal_info.office_location,
            ...(startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {}),
        });

        const userCount = await User.countDocuments({
            ...(startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {}),
        });

        // // console.log(
        //     "missingReportCount: ", missingReportCount,
        //     "claimedReportCount: ", claimedReportCount,
        //     "claimableReportCount: ", claimableReportCount,
        //     "processingReportCount: ", processingReportCount,
        //     "userCount: ", userCount,
        //     "locationCounts: ", sortedLocationCounts,
        //     "userSpecifications: ", sortedUserSpecifications
        // )

        return res.status(200).json({
            missingReportCount,
            claimedReportCount,
            claimableReportCount,
            processingReportCount,
            userCount,
            locationCounts: sortedLocationCounts,
            userSpecifications: sortedUserSpecifications,
        });
    })

    

}))

export default router