import jwt from 'jsonwebtoken'
import catchAsyncErrors from "./catchAsyncErrors.js"
import { User } from '../models/User.js'

export const verifyJWT = catchAsyncErrors(async(req, res, next) => {
    
    // console.log(req)
    // console.log("refresh-token req.jid",req.cookies.jid)
    const {jid} = req.cookies
    // console.log("jid",jid)

    const authHeader = req.headers["authorization"]
    // console.log("req.headers", req.headers)
    // console.log("authHeader", authHeader)
    if(authHeader == null) {
        return res.status(401).json({ error : "Not authenticated" })
    }

    try {
        const token = authHeader && authHeader.split(' ')[1]
        // console.log("token verify",token)
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) 
        // console.log("decoded verify",decoded)
        // req.user = await User.findById(decoded.id);
        req.user = decoded.userId;
        next()

        // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        //     if(err) {
        //         return res.status(403).json({ error: "Access token is invalid" })
        //     }
    
        //     console.log(user.id)

        //     req.user = user.id
        //     next()
        // })

    } catch (error) {
        // console.log(error)
        return res.status(403).json({ error })
    }
    
})

// create token and saving that in cookies
export const sendToken = (user, statusCode, res) => {

    

    // const token = user.getJwtToken();

    // // Options for cookies
    // const options = {
    //     expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    //     httpOnly: true,
    //     sameSite: "none",
    //     secure: true,
    // };

    // res.status(statusCode).cookie("token", token, options).json({
    //     success: true,
    //     user,
    //     token,
    // });
};