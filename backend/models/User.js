import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'

const userSchema = mongoose.Schema(
    {
        personal_info: {
            name: { type: String, required: true, minlength: [2, 'fullname must be 2 letters long'], },
            uid: { type: String, required: true },
            email: { type: String, unique: true, required: true, lowercase: true, },
            password: { type: String, required: true },
            pic: {
                type: String,
                required: true,
                default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            },
            access: {
                type: String, enum: ["User", "Admin", "SuperAdmin"],
                default: "",
            },
            membership:  { type: String, enum: ["Student", "Professor", "Staff"], default: "" },
            specification: { type: String, default: "" },
            office_location: { type: String, default: ""}, // Include location in personal_info for Admin
            active: { type: Boolean, default: true },
        },
        social_info: {
            phone_number: { type: String, default: "" },
            facebook_link: { type: String, default: "" },
            twitter_link: { type: String, default: "" },
        },
        reports: {
            type: [ Schema.Types.ObjectId ],
            ref: 'Report',
            default: [],
        },
        token_version: { type: Number, default: 0, },
        lastChatSeen: { type: Schema.Types.ObjectId, ref: "Chat" },
    },
    { timestamps: true }
);

const adminSchema = new mongoose.Schema(
    {
        admin_info: {
            office_location: { type: String, required: true },
            active: { type: Boolean, default: true },
        }
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
export const Admin = User.discriminator('Admin',adminSchema);