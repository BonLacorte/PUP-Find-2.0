import express from 'express'
import { User, Admin} from './../models/User.js'
import Report from './../models/Report.js'
import jwt from 'jsonwebtoken'
import catchAsyncErrors from "./../middleware/catchAsyncErrors.js"
import { verifyJWT } from '../middleware/verifyJWT.js'

const router = express.Router();

// const verifyJWT = catchAsyncErrors((req, res, next) => {
    
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]

//     if(token == null) {
//         return res.status(401).json({ error: "No access token" })
//     }

//     jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
//         if(err) {
//             return res.status(403).json({ error: "Access token is invalid" })
//         }

//         req.user = user.id
//         next()
//     })
// })

router.post("/create-report", verifyJWT, catchAsyncErrors(async (req, res, next) => {
    
    
    let creatorId
    // // console.log(req.body)

    let {
        item_name,
        date,
        location,
        description,
        creator,
        status,
        type,
        images,
        office_location_surrendered,
    } = req.body

    // // console.log("req.user:",req.user)

    let user = await User.findById({ _id: req.user })

    // // console.log("user:",user)
    // // console.log("user.personal_info.access:",user.personal_info.access)

    if (user.personal_info.access === "Admin") {
        // // console.log("creator:", creator)
        let user = await User.findOne({ "personal_info.uid": creator })
        // // console.log("user-user:", user)
        // if user is admin, find the clien user's id by uid
        // and assign it to creatorId
        creatorId = user._id
    } else {
        // if user is not admin, assign the client user's id to creatorId
        creatorId = req.user
    }

    // // console.log("create-report creatorId:",creatorId)

    if (item_name && item_name.length < 2 && item_name.length > 30 ) {
        return res.status(403).json({ error: "Item name must be at least 2-30 letters long" })
    } else if (!item_name) {
        return res.status(403).json({ error: "Enter item name" });
    }

    if (!date.length || !date) {
        return res.status(403).json({ error: "Enter date" });
    }

    if (!location.length || !location) {
        return res.status(403).json({ error: "Enter location" });
    } else if (location == "Choose Location") {
        return res.status(403).json({ error: "Enter location" });
    }

    if (!description.length || !description) {
        return res.status(403).json({ error: "Enter description" });
    }

    if (type == "FoundReport" && (!images || images == '' || images.length < 0 || images.length > 4) && user.personal_info.access === "User") {
        return res.status(403).json({ error: "Found report must provide minimum of 1 and maximum of 3 photos of found item" });
    }

    if (type == "FoundReport") {
        if (!office_location_surrendered.length || !office_location_surrendered) {
            return res.status(403).json({ error: "Enter office location" });
        } else if (office_location_surrendered == "Choose Office") {
            return res.status(403).json({ error: "Enter office location" });
        }
    }

    // const creatorId = await User.findOne({ "personal_info.uid": creator });

    // generate report_id
    let report_id = Math.floor(100000 + Math.random() * 900000)

    let report = new Report({
        report_info: {
            report_id,
            item_name,
            images,
            date,
            location,
            description,
            creatorId,
            status,
            type,
            ...(type === "FoundReport" && { office_location_surrendered }),
        },
        is_claimed: false,
        partner_report: null,
    })

    report.save().then(report => {
        User.findOneAndUpdate({ _id: creatorId }, { $push : { "reports": report._id } })
        .catch(err => {
            // console.log(err)
            return res.status(500).json({ error: "Failed to push report to user" })
        })
        return res.status(200).json(report);
    })
    .catch(err => {
        // console.log(err.message)
        return res.status(500).json({ "error": err.message })
    }) 
}))


// // Report - Get all reports
router.get("/get-all-reports", catchAsyncErrors( async (req, res) => {

    const { search, reportType } = req.query;

    let reportStatus = 'Claimed'

    if (reportType === 'Claimed') {
        // reportType = 'MissingReport'
        reportStatus = 'Claimed'
    }

    const keywordFilter = search
        ? {
            $or: [
                { "report_info.item_name" : { $regex: search, $options: "i" } },
                { "report_info.description" : { $regex: search, $options: "i" } },
            ],
        }
        : {};

    const reportTypeFilter = 
        reportType ? 
            reportType == 'Claimed' ? 
                {"report_info.status": reportStatus} 
                : 
                {"report_info.type": reportType } 
        :{ "report_info.type": reportType };

    const filters = { ...keywordFilter, ...reportTypeFilter };

    // // console.log("reportTypeFilter:", reportTypeFilter)

    await Report.find({ ...filters})
    .populate("report_info.creatorId", "personal_info social_info")
    .populate("partner_report")
    .then((reports) => {
        // // console.log("reports",reports)
        res.status(200).json({reports});
    });
}))


// Report - Get report information by id
router.get("/get-report-info/:report_id", catchAsyncErrors(async (req, res) => {

    let { report_id } = req.params;

    Report.findById(report_id)
        .then(async (report) => {
            if (report.partner_report) {
                report = await report.populate("report_info.creatorId", "personal_info social_info")
                report = await report.populate({
                    path: "partner_report",
                    populate: {
                        path: "report_info.creatorId",
                        select: "-personal_info.password, -personal_info.access, -token_version"
                    }
                })
                    
            } else {
                report = await report.populate("report_info.creatorId", "personal_info social_info")
            }
            // console.log("get-report-info - report", report);
            return res.status(200).json({ report });
        })
        .catch(err => {
            // console.log(err.message)
            return res.status(500).json({ error: err.message });
        })
}))

// Get all reports of user
router.get("/get-all-reports-by-user/:user_id", verifyJWT, catchAsyncErrors(async (req, res, next) => {
    
    let user_id = req.params.user_id

    // // console.log("get-all-reports-by-user - user_id",user_id)

    const reports = await Report.find({ "report_info.creatorId" : user_id })
        .populate("report_info.creatorId", "personal_info social_info")
        .populate("partner_report", "report_info" )
        .populate("partner_report.report_info.creatorId", "personal_info social_info")
        .sort({ createdAt: -1 })
        .then( async (reports) => {
            
            // // console.log("reports",reports)
            // await reports.populate("report_info.creatorId", "personal_info social_info")
            return res.status(200).json({ reports })
        })
}))

// // Report - Update report status
// router.put("/update-report-status/:report_id", verifyJWT, catchAsyncErrors(async (req, res, next) => {

//     let { report_id } = req.params
//     let { status } = req.body

//     if (!status) {
//         return res.status(403).json({ error: "Enter status" });
//     }

//     await Report.findByIdAndUpdate(report_id, { "report_info.status": status })
//         .then((report) => {
//             return res.status(200).json({ report })
//         })
//         .catch(err => {
//             // console.log(err.message)
//             return res.status(500).json({ error: err.message });
//         })
// }))

// Report - Update report information
router.put("/update-report-info/:report_id", catchAsyncErrors(async (req, res, next) => {

    let { report_id } = req.params

    // // console.log("report_id:", report_id)

    let {
        item_name,
        date,
        location,
        description,
        status,
        type,
        images,
        office_location_surrendered,
    } = req.body

    // // console.log("req.body:",req.body)

    if (item_name && item_name.length < 2 && item_name.length > 30 ) {
        return res.status(403).json({ error: "Item name must be at least 2-30 letters long" })
    } else if (!item_name) {
        return res.status(403).json({ error: "Enter item name" });
    }

    if (!date.length || !date) {
        return res.status(403).json({ error: "Enter date" });
    }

    if (!location.length || !location || location == "Choose Location") {
        return res.status(403).json({ error: "Enter location" });

    } else if (location == "Choose Location") {
        return res.status(403).json({ error: "Enter location" });
    }

    if (!description.length || !description) {
        return res.status(403).json({ error: "Enter description" });
    }

    if (type == "FoundReport" && (!images || images == '' || images.length < 0 || images.length > 4)) {
        return res.status(403).json({ error: "Found report must provide minimum of 1 and maximum of 4 photos of found item" });
    }

    await Report
        .findByIdAndUpdate(report_id, {
            "report_info.item_name": item_name,
            "report_info.date": date,
            "report_info.location": location,
            "report_info.description": description,
            "report_info.status": status,
            "report_info.images": images,
            // ...(type === "FoundReport" && { "report_info.office_location_surrendered": office_location_surrendered }),
        })
        .then((report) => {
            return res.status(200).json({ report })
        })
        .catch(err => {
            // console.log(err.message)
            return res.status(500).json({ error: err.message });
        })
    }
))

// Report - Delete report
router.delete("/delete-report/:report_id", catchAsyncErrors(async (req, res, next) => {

    let { report_id } = req.params

    // console.log("report_id", report_id)

    await Report.findByIdAndDelete(report_id)
        .then((report) => {
            return res.status(200).json({ report })
        })
        .catch(err => {
            // console.log(err.message)
            return res.status(500).json({ error: err.message });
        })
}))

// Report - Claim report
router.put("/match-reports", verifyJWT, catchAsyncErrors(async (req, res, next) => {

    // let { found_report_id } = req.params
    let { partner_missing_report_id, found_report_id } = req.body

    // // console.log("report_id", report_id)
    // // console.log("partner_report_id", partner_report_id)

    let updated_found_report
    let updated_partner_missing_report

    await Report.findByIdAndUpdate(found_report_id, { "is_claimed": true, "partner_report": partner_missing_report_id, "report_info.status": "Claimed"})
        .then((report) => {
            updated_found_report = report
            // return res.status(200).json({ report })
        })
        .catch(err => {
            // console.log(err.message)
            return res.status(500).json({ error: err.message });
        })

    await Report.findByIdAndUpdate(partner_missing_report_id, { "is_claimed": true, "partner_report": found_report_id, "report_info.status": "Claimed" })
        .then((report) => {
            updated_partner_missing_report = report
            // return res.status(200).json({ report })
        })
        .catch(err => {
            // console.log(err.message)
            return res.status(500).json({ error: err.message });
        })

    return res.status(200).json({ updated_found_report, updated_partner_missing_report })
}))


export default router