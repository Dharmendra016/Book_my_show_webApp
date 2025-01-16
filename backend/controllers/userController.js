
// --> testing not implement 

import "dotenv/config"
import User from "../models/userSchema"
import otpGenerator from "otp-generator"
import { Otp } from "../models/otp";
import { createHmac } from "node:crypto"
import { getJwtToken } from "../utility/jwt";

const secret = process.env.HASH_SECRET

export const sendOtp = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please Enter you email"
            })
            
        }

        var otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        })

        var isOtpUnique = await Otp.findOne({ otp });

        while (isOtpUnique) {
            otp = otpGenerator.generate(5, {
                digits: true,
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false
            });
            isOtpUnique = await Otp.findOne({ otp });
        }

        await Otp.create({
            email,
            otp,
        })

        return res.status(200).json({
            success: true,
            message: "Successively created otp",
        })


    } catch (error) {
        console.log(error);
    }
}

export const verifyOtp = async (req, res) => {

    try {

        const { otp, email } = req.body;

        if (!otp || !email) {
            return res.status(400).json({
                success: false,
                message: "Please provide otp."
            })
        }

        const updatedOtp = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);

        if (updatedOtp[0].otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "OTP not matched"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Correct OTP",
            user: {
                email,
            }
        })



    } catch (error) {
        console.log(error);
    }

}


export const registerUser = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (!email || !username || !password || !confirmPassword) {
            res.status(400).json({
                success: false,
                message: "All field are required."
            })
            return
        }

        const user = await User.findOne({ email });
        if (user) {
            res.status(400).json({
                success: false,
                message: "User already registered."
            })
            return
        }

        if (password !== confirmPassword) {
            res.status(400).json({
                success: false,
                message: "Passowrd doesn't match."
            })
            return
        }
        const hashedPassword = createHmac('sha256', secret)
            .update(password)
            .digest('hex');

        const userCreated = await User.create({ username, email, password: hashedPassword, confirmPassword: hashedPassword });

        if (!userCreated) {
            return res.status(200).json({
                success: false,
                message: "user not created",
            })
        }

        return res.status(200).json({
            success: true,
            message: "successfully created user",
            user: userCreated
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required to be filled",
            })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            });
        }

        const hashedPassword = createHmac('sha256', secret)
            .update(password)
            .digest('hex');

        if (hashedPassword !== user?.password) {
            return res.status(403).json({
                success: false,
                message: "password not matched",
            })
        }

        const userData = {
            _id:user?._id,
            username: user?.username,
            email: user?.email,
            profilePic: user?.profilePic
        }
        const token = getJwtToken(userData);
        console.log("token: ", token);

        return res.cookie('token', token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
        }).json({
            success: true,
            message: `Welcome back ${user?.username}`
        });



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        })
    }
}

export const logout = async (req, res)=> {
    try {            

        return res.cookie("token", "", { maxAge: 0 })
        .cookie("connect.sid","",{maxAge:0}).json({
            message: "Logged out successfully",
            success: true,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}
