import express from 'express'
import bcrypt from 'bcrypt'
import { User, Admin } from './../models/User.js'
import jwt from 'jsonwebtoken'
import catchAsyncErrors from "./../middleware/catchAsyncErrors.js"
import { sendToken, verifyJWT } from '../middleware/verifyJWT.js'
import { sendRefreshToken } from '../middleware/sendRefreshToken.js'
import { createAccessToken, createRefreshToken } from '../middleware/auth.js'

const router = express.Router();

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
let phoneNumberRegex = /^(09|\+639)\d{9}$/; // re // regex for phone number
let uidRegex = /^\d{4}-\d{5}-[A-Z]{2}-\d$/
let twitterRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/
let facebookRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9_]+)/

const formatDatatoSend = (user) => {

    // console.log("value of user: ",user)

    const access_token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })

    return {
        access_token,
        pic: user.personal_info.pic,
        name: user.personal_info.name,
        uid: user.personal_info.uid
    }

}

// User - Admin Register
router.post("/admin-register", catchAsyncErrors( async (req, res) => {

    let { name, uid, email, password, confirm_password, access, membership, specification, phone_number, twitter_link, facebook_link, pic, office_location } = req.body

    if (name && name.length < 2) {
        return res.status(403).json({ error: "Fullname must be at least 2 letters long" });
    } else if (!name.length){
        return res.status(403).json({ error: "Enter name" });
    }

    if (uid && uidRegex.test(uid)) {
        return res.status(403).json({ error: "Invalid ID number" });
    } else if (!uid.length) {
        return res.status(403).json({ error: "Enter ID number" });
    } else {
        try {
            const existingUser = await User.findOne({ "personal_info.uid": uid });
            if (existingUser) {
                return res.status(403).json({ error: "User already exists" });
            }
            // Continue with the registration process
            // ...
        } catch (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    
    if (email && !emailRegex.test(email)) {

        return res.status(403).json({ error: "Email is invalid" });
    } else if (!email.length) {
        return res.status(403).json({ error: "Enter email" });
    } else {
        try {
            const existingUser = await User.findOne({ "personal_info.email": email });
            if (existingUser) {
                return res.status(403).json({ error: "User already exists" });
            }
            // Continue with the registration process
            // ...
        } catch (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    

    if (phone_number && !phoneNumberRegex.test(phone_number)) {
        return res.status(403).json({ error: "Phone number is invalid" });
    }
    
    if (!specification.length) {
        return res.status(403).json({ error: "Enter " + (membership == "Student" ? "Course & Section" : membership == "Professor" ? "Department" : "Role") });
    }

    if (twitter_link && !twitterRegex.test(twitter_link)) {
        return res.status(403).json({ error: "Twitter link is invalid" });
    }

    if (facebook_link && !facebookRegex.test(facebook_link)) {
        return res.status(403).json({ error: "Facebook link is invalid" });
    }

    if (password && !passwordRegex.test(password)) {
        return res.status(403).json({ error: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" });
    }

    if (confirm_password && !passwordRegex.test(password)) {
        return res.status(403).json({ error: "Confirm password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" });
    }

    if (confirm_password && password !== confirm_password) {
        return res.status(403).json({ error: "Passwords do not match" });
    }

    bcrypt.hash(password, 10, async (err, hashed_password) => {
        let admin = new Admin({
            personal_info: {
                name,
                uid,
                email,
                password: hashed_password,
                is_admin: true,
                access,
                membership,
                specification,
                pic,
                office_location
            },
            social_info: {
                phone_number,
                twitter_link,
                facebook_link
            },
            admin_info: {
                office_location
            }
        })

        admin.save()
            .then((a) => {
                return res.status(200).json(formatDatatoSend(a));
            })
            .catch((err) => {
                if (err.code === 11000) {
                    return res.status(403).json({ error: "Email already exists" });
                }
                // console.log(err)
                return res.status(500).json({ error: err.message });
            });
        // console.log(hashed_password)
    })
    return res.status(200)
}))

// User - Register
router.post("/register", catchAsyncErrors( async (req, res) => {

    let { name, uid, email, password, confirm_password, access, membership, specification, phone_number, twitter_link, facebook_link, pic } = req.body

    if(
        pic
        && pic !== "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    )

    
    if (name && name.length < 2) {
        return res.status(403).json({ error: "Fullname must be at least 2 letters long" });
    } else if (!name.length){
        return res.status(403).json({ error: "Enter name" });
    }

    if (uid && uidRegex.test(uid)) {
        return res.status(403).json({ error: "Invalid ID number" });
    } else if (!uid.length) {
        return res.status(403).json({ error: "Enter ID number" });
    } else {
        try {
            const existingUser = await User.findOne({ "personal_info.uid": uid });
            if (existingUser) {
                return res.status(403).json({ error: "User already exists" });
            }
            // Continue with the registration process
            // ...
        } catch (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    if (email && !emailRegex.test(email)) {
        return res.status(403).json({ error: "Email is invalid" });
    } else if (!email.length) {
        return res.status(403).json({ error: "Enter email" });
    } else {
        try {
            const existingUser = await User.findOne({ "personal_info.email": email });
            if (existingUser) {
                return res.status(403).json({ error: "User already exists" });
            }
            // Continue with the registration process
            // ...
        } catch (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    if (phone_number && !phoneNumberRegex.test(phone_number)) {
        return res.status(403).json({ error: "Phone number is invalid" });
    } else if (!phone_number.length) {
        return res.status(403).json({ error: "Enter phone number" });
    }

    if (!specification.length) {
        return res.status(403).json({ error: "Enter " + (membership == "Student" ? "Course & Section" : membership == "Professor" ? "Department" : "Role") });
    }

    if (twitter_link && !twitterRegex.test(twitter_link)) {
        return res.status(403).json({ error: "Twitter link is invalid" });
    }

    if (facebook_link && !facebookRegex.test(facebook_link)) {
        return res.status(403).json({ error: "Facebook link is invalid" });
    }

    if (password && !passwordRegex.test(password)) {
        return res.status(403).json({ error: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" });
    } else if (!password.length) {
        return res.status(403).json({ error: "Enter password" });
    }

    if (confirm_password && !passwordRegex.test(password)) {
        return res.status(403).json({ error: "Confirm password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" });
    } else if (confirm_password && password !== confirm_password) {
        return res.status(403).json({ error: "Passwords do not match" });
    } else if (!confirm_password.length) {
        return res.status(403).json({ error: "Confirm your password" });
    }

    bcrypt.hash(password, 10, async (err, hashed_password) => {
        // let username = await generateUsername(email)

        let user = new User({
            personal_info: {
                name,
                uid,
                email,
                password: hashed_password,
                is_admin: false,
                access,
                membership,
                specification,
                pic
            },
            social_info: {
                phone_number,
                twitter_link,
                facebook_link
            }
        })

        user.save()
            .then((u) => {
                return res.status(200).json(formatDatatoSend(u));
            })
            .catch((err) => {
                if (err.code === 11000) {
                    return res.status(403).json({ error: "Email already exists" });
                }
                // console.log(err)
                return res.status(500).json({ error: err.message });
            });
        // console.log(hashed_password)
    })
    return res.status(200)
}))

// User - Login
router.post("/login", catchAsyncErrors((req, res) => {

    let { email, password, access } = req.body

    User.findOne({ "personal_info.email": email, "personal_info.access": access  })
        .then((user) => {
            if (!user) {
                return res.status(403).json({ "error": "Email not found" })
            }

            bcrypt.compare(password, user.personal_info.password, (err, result) => {
                if (err) {
                    return res.status(403).json({ error: "Error occured while login please try again" })
                }

                if (result) {
                    sendRefreshToken(res, createRefreshToken(user));
                    let access_token = createAccessToken(user)
                    return res.status(200).json({ access_token})
                } else {
                    return res.status(403).json({ error: "Incorrect password" })
                }
            })
        })
        .catch(err => {
            // console.log(err.message)
            return res.status(500).json({ "error": err.message })
        })
}))


// User - Revoke Refresh Token
// router.post("/revoke-refresh-token", verifyJWT, catchAsyncErrors(async (req, res) => {
router.post("/revoke-refresh-token", catchAsyncErrors(async (req, res) => {

    // // console.log("req.user", req.user)

    let { userId } = req.body

    // console.log("revoke-refresh-token: userId", userId)

    await User.findByIdAndUpdate(userId, { $inc: { token_version: 1 } })
        .then(() => {
            return res.status(200).json({ "success": true })
        })
        .catch(err => {
            // console.log(err.message)
            return res.status(500).json({ "error1": err.message })
        })
}))


// User - Get all active admin's
router.get("/get-all-active-admin", catchAsyncErrors((req, res) => {
    User.find({ "personal_info.access": "Admin", "personal_info.active": true })
        .then((admins) => {
            // console.log("admins",admins)
            return res.status(200).json({ admins })
        })
        .catch(err => {
            // console.log(err.message)
            return res.status(500).json({ "error": err.message })
        })
}))


// User - Get all admin's location
router.get("/get-all-admin", catchAsyncErrors((req, res) => {
    User.find({ "personal_info.access": "Admin" })
        .then((admins) => {
            // console.log(admins)
            return res.status(200).json({ admins })
        })
        .catch(err => {
            // console.log(err.message)
            return res.status(500).json({ "error": err.message })
        })
}))


// User - Get user information by id
router.get("/get-user-info/:user_id", verifyJWT, catchAsyncErrors((req, res) => {
    
    let { user_id } = req.params

    User.findById(user_id)
        .then((user) => {
            // console.log("user",user)
            return res.status(200).json({ user })
        })
        .catch(err => {
            // console.log(err.message)
            return res.status(500).json({ "error": err.message })
        })
}))


// // User - Get all users
router.get("/get-all-users", catchAsyncErrors( async (req, res) => {

    const { search, category } = req.query;

    // console.log("search",search)
    // console.log("category",category)

    const keywordFilter = search
        ? {
            $or: [
                { "personal_info.name" : { $regex: search, $options: "i" } },
                { "personal_info.email" : { $regex: search, $options: "i" } },
            ],
        }
        : {};

    const categoryFilter = category ? { "personal_info.membership": category } : {};

    const filters = { ...keywordFilter, ...categoryFilter };

    await User.find({ ...filters, "personal_info.access": { $ne: "Admin" } })
    .then((users) => {
        // console.log("users",users)
        res.status(200).json({users});
    });
}))



// User - Get user information by creator id
router.get("/get-user-by-creator-id/:creator_id", catchAsyncErrors((req, res) => {
    let { creator_id } = req.params
    // console.log("creator_id",creator_id)

    User.findOne({ "personal_info.uid": creator_id })
        .then((user) => {
            // console.log("get-user-info-by-creator-id - user",user)
            return res.status(200).json({ user })
        })
        .catch(err => {
            // console.log(err.message)
            return res.status(500).json({ "error": err.message })
        })

}))


// User - Get user information by user id
router.get("/get-user-by-user-id/:user_id", catchAsyncErrors((req, res) => {
    let { user_id } = req.params
    // console.log("user_id",user_id)

    User.findById(user_id)
        .then((user) => {
            // console.log("get-user-info-by-user-id - user",user)
            return res.status(200).json({ user })
        })
        .catch(err => {
            // console.log(err.message)
            return res.status(500).json({ "error": err.message })
        })

}))


// User - Update user information
router.put("/update-user-info/:user_id", catchAsyncErrors(async(req, res) => {
    let { user_id } = req.params

    // console.log("update-user user_id:", user_id)

    let { name, uid, email, access, membership, specification, phone_number, twitter_link, facebook_link, pic, password, new_password } = req.body

    if (name && name.length < 2) {
        return res.status(403).json({ error: "Fullname must be at least 2 letters long" });
    } else if (!name.length){
        return res.status(403).json({ error: "Enter name" });
    }

    if (uid && uidRegex.test(uid)) {
        return res.status(403).json({ error: "Invalid ID number" });
    } else if (!uid.length) {
        return res.status(403).json({ error: "Enter ID number" });
    }

    if (email && !emailRegex.test(email)) {
        return res.status(403).json({ error: "Email is invalid" });
    } else if (!email.length) {
        return res.status(403).json({ error: "Enter email" });
    }

    if (phone_number && !phoneNumberRegex.test(phone_number)) {
        return res.status(403).json({ error: "Phone number is invalid" });
    }

    if (!specification.length) {
        return res.status(403).json({ error: "Enter " + (membership == "Student" ? "Course & Section" : membership == "Professor" ? "Department" : "Role") });
    }

    if (twitter_link && !twitterRegex.test(twitter_link)) {
        return res.status(403).json({ error: "Twitter link is invalid" });
    }

    if (facebook_link && !facebookRegex.test(facebook_link)) {
        return res.status(403).json({ error: "Facebook link is invalid" });
    }

    let save_new_password

    
    // if ((new_password && password) && (passwordRegex.test(new_password)) && (passwordRegex.test(password))) {
    //     const user = await User.findById(user_id);
    //     if (!user) {
    //         return res.status(403).json({ error: "User not found" });
    //     }
    //     const isMatch = await bcrypt.compare(password, user.personal_info.password);
    //     if (!isMatch) {
    //         return res.status(403).json({ error: "Incorrect password" });
    //     }
    //     // save_new_password = new_password;

    //     // console.log("new_password:",new_password)

    //     bcrypt.hash(new_password, 10, async (err, hashed_password) => {
    //         save_new_password = hashed_password
    //     })
    // }


    await User.findByIdAndUpdate(user_id, {
        "personal_info.name": name,
        "personal_info.uid": uid,
        "personal_info.email": email,
        "personal_info.access": access,
        "personal_info.membership": membership,
        "personal_info.specification": specification,
        "personal_info.pic": pic,
        // "personal_info.password": save_new_password,
        "social_info.phone_number": phone_number,
        "social_info.twitter_link": twitter_link,
        "social_info.facebook_link": facebook_link
    })
    .then((user) => {
        // console.log("user",user)
        return res.status(200).json({ user })
    })
    .catch(err => {
        // console.log(err.message)
        return res.status(500).json({ "error": err.message })
    })
}))


// User - Delete user
router.delete("/delete-user/:user_id", catchAsyncErrors(async (req, res, next) => {

    let { user_id } = req.params

    // console.log("user_id", user_id)

    await Report.findByIdAndDelete(user_id)
        .then((user) => {
            return res.status(200).json({ user })
        })
        .catch(err => {
            // console.log(err.message)
            return res.status(500).json({ error: err.message });
        })
}))


// log out user
router.post("/logout", verifyJWT, catchAsyncErrors((req, res, next) => {
    sendRefreshToken(res, "")

    return res.status(200).json({ "success": true })
}));

export default router
