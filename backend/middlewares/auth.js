import { getJwtVerified } from "../utility/jwt.js";

export const authentication = async (req, res , next) => {

    try {
        const token = req.cookies?.token 
        if( !token ){
            return res.status(401).json({
                success:false,
                message:"User not authenticated",
            })
        }
       
        const user = getJwtVerified(token);

        if( !user ){
            return res.status(401).json({
                success:false,
                message:"Invalid user",
            })
        }
        req.user = user
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        })
        return;
    }   

}