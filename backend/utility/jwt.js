import jwt from "jsonwebtoken"
import "dotenv/config"

const secret = process.env.JWT_SECRET; 


export const getJwtToken = (data) => {
    try {
        console.log("data",data);
        return jwt.sign(data, secret , { expiresIn: 60 * 60 });

    } catch (error) {
        console.log(error);
    }
}

export const getJwtVerified = (token)=> {
    try {
        
        return jwt.verify(token, secret);

    } catch (error) {
        console.log(error);
    }
}