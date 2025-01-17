import "dotenv/config";
import { initializeUserTable, insertUser } from "../models/userSchema.js";
import { createHmac, hash } from "node:crypto"
import { getJwtToken } from "../utility/jwt.js";
import { client } from "../utility/dbConnect.js";

const secret = process.env.HASH_SECRET
const searchQuery = `SELECT * FROM "User" WHERE Email LIKE $1`;

export const registerUser = async (req, res) => {
    try {
        await initializeUserTable();
        const { Name, Email, Password, PhoneNo, Role } = req.body;
        console.log(Name , Email , Password , PhoneNo , Role);

        if (!Email || !Name || !Password || !PhoneNo || !Role) {
            res.status(400).json({
                success: false,
                message: "All field are required."
            })
            return
        }
        
        const user = await client.query(searchQuery, [Email]);

        if (user.rows.length > 0) {
            res.status(400).json({
                success: false,
                message: "User already registered."
            });
            return;
        }

        const hashedPassword = createHmac('sha256', secret)
            .update(Password)
            .digest('hex');

        const userCreated = await insertUser({ Name, Email, Password: hashedPassword, PhoneNo, Role });

        if (!userCreated) {
            return res.status(500).json({
                success: false,
                message: "User not created due to a server issue.",
            });
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

        const { Email, Password } = req.body;

        if (!Email || !Password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required to be filled",
            })
        }

        const result = await client.query(searchQuery, [Email]);

        if (result.rows.length === 0) {
            res.status(400).json({
                success: false,
                message: "User Not found"
            });
            return;
        }
        const user = result.rows[0];

        const hashedPassword = createHmac('sha256', secret)
            .update(Password)
            .digest('hex');


        if (hashedPassword !== user.password) {
            return res.status(403).json({
                success: false,
                message: "password not matched",
            })
        }

        const userData = {
            UserId:user.UserId,
            Name: user.Name,
            Email: user.Email,
            Role:user.Role
        }

        const token = getJwtToken(userData);

        return res.cookie('token', token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
        }).json({
            success: true,
            message: `Welcome back ${user?.name}`
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
