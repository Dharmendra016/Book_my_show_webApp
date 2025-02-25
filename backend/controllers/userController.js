import "dotenv/config";
import { initializeUserTable, insertUser } from "../models/userSchema.js";
import { createHmac, hash } from "node:crypto"
import { getJwtToken } from "../utility/jwt.js";
import { client } from "../utility/dbConnect.js";

const secret = process.env.HASH_SECRET
const searchQuery = `SELECT * FROM "User" WHERE email LIKE $1`;

export const registerUser = async (req, res) => {
    try {
        await initializeUserTable();
        const { name, email, password, phoneno, role } = req.body;
        console.log(req.body);
        console.log(name , email , password , phoneno , role);

        if (!email || !name || !password || !phoneno || !role) {
            res.status(400).json({
                success: false,
                message: "All field are required."
            })
            return
        }
        
        const user = await client.query(searchQuery, [email]);

        if (user.rows.length > 0) {
            res.status(400).json({
                success: false,
                message: "User already registered."
            });
            return;
        }

        const hashedPassword = createHmac('sha256', secret)
            .update(password)
            .digest('hex');

        const userCreated = await insertUser({ Name:name, Email:email, Password: hashedPassword, PhoneNo:phoneno, Role:role });

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

        const { email, password } = req.body;

        console.log(email, password);
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required to be filled",
            })
        }
        console.log("before query");
        const result = await client.query(searchQuery, [email]);
        console.log("after query");
        if (result.rows.length === 0) {
            res.status(400).json({
                success: false,
                message: "User Not found"
            });
            return;
        }
        const user = result.rows[0];

        const hashedPassword = createHmac('sha256', secret)
            .update(password)
            .digest('hex');


        if (hashedPassword !== user.password) {
            return res.status(403).json({
                success: false,
                message: "password not matched",
            })
        }

        const userData = {
            userid:user.userid,
            name: user.name,
            email: user.email,
            role:user.role
        }

        const token = getJwtToken(userData);
        
        return res.cookie('token', token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
        }).json({
            success: true,
            message: `Welcome back ${user?.name}`,
            user: userData
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


export const getUser = async (req, res) => {
    try {
        const userid = req.user.userid;
        const user = await client.query(`SELECT * FROM "User" WHERE userid = $1`, [userid]);
        return res.status(200).json({
            success: true,
            message: "successfully fetched user",
            user: user.rows[0]
        })
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            success:false,
            message:"Internal error"
        })
    }
}