// models/ClaimedReport.js
const mongoose = require("mongoose");

const claimedReportSchema = mongoose.Schema(
    {
        foundReport: {
            _id: { type: String, required: true },
            itemName: { type: String, required: true },
            itemImage: [
                {
                    public_id: {
                        type: String,
                        required: true,
                    },
                    url: {
                        type: String,
                        required: true,
                    },
                },
            ],
            date: { type: Date, required: true },
            createdAt: { type: Date, required: true },
            location: { type: String, required: true },
            itemDescription: { type: String, required: true },
            creator: {
                name: { type: String, required: true },
                uid: { type: String, required: true },
                email: { type: String, required: true },
                pic: {
                    public_id: {
                        type: String,
                        default: null,
                    },
                    url: {
                        type: String,
                        required: true,
                        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
                    },
                },
                phoneNumber: { type: String, default: null },
                facebookLink: { type: String, default: null },
                twitterLink: { type: String, default: null },
                membership: { type: String, enum: ["Student", "Professor", "Staff"], default: null },
                specification: { type: String, default: null },
            },
            reportStatus: {
                type: String,
                enum: ["Missing", "Claimable", "Processing", "Claimed"],
                default: "Processing",
                required: true,
            },
            reportType: {
                type: String,
                enum: ["MissingReport", "FoundReport"],
                required: true,
            },
        },
        missingReport: {
            _id: { type: String, required: true },
            itemName: { type: String, required: true },
            itemImage: [
                {
                    public_id: {
                        type: String,
                        required: true,
                    },
                    url: {
                        type: String,
                        required: true,
                    },
                },
            ],
            date: { type: Date, required: true },
            createdAt: { type: Date, required: true },
            location: { type: String, required: true },
            itemDescription: { type: String, required: true },
            creator: {
                name: { type: String, required: true },
                uid: { type: String, required: true },
                email: { type: String, required: true },
                pic: {
                    public_id: {
                        type: String,
                        default: null,
                    },
                    url: {
                        type: String,
                        required: true,
                        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
                    },
                },
                phoneNumber: { type: String, default: null },
                facebookLink: { type: String, default: null },
                twitterLink: { type: String, default: null },
                membership: { type: String, enum: ["Student", "Professor", "Staff"], default: null },
                specification: { type: String, default: null },
            },
            reportStatus: {
                type: String,
                enum: ["Missing", "Claimable", "Processing", "Claimed"],
                default: "Processing",
                required: true,
            },
            reportType: {
                type: String,
                enum: ["MissingReport", "FoundReport"],
                required: true,
            },
        },
    },
    { timestamps: true }
);

export default mongoose.model("ClaimedReport", claimedReportSchema);

