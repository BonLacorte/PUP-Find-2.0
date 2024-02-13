import mongoose, { Schema } from "mongoose";

const reportSchema = mongoose.Schema(
    {
        report_info: {
            report_id: { type: String, required: true, unique: true },
            item_name: { type: String, required: true },
            images: [{ type: String }],
            date: { type: Date, required: true },
            location: { type: String, required: true },
            description: { type: String, required: true },
            creatorId: { 
                type: Schema.Types.ObjectId,
                ref: 'User', 
                require: true 
            },
            status: {
                type: String,
                enum: ["Missing", "Claimable", "Processing", "Claimed"],
                default: "Processing",
                required: true,
            },
            type: {
                type: String,
                enum: ["MissingReport", "FoundReport", "ClaimedReport"],
                required: true,
            },
            office_location_surrendered: { type: String, default: ""},
        },
        is_claimed: {
            type: Boolean,
            required: true,
            default: false,
        },
        partner_report: {
            type: Schema.Types.ObjectId,
            ref: 'Report',
        },
    },
    { timestamps: true }
);

export default mongoose.model("Report", reportSchema);