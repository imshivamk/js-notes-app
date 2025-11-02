import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// local imports


export const verifyToken = (req, res, next) =>{
    const token = req.cookies.token;
    if(!token) return res.status(401).json({
        message: "Unauthorized: No token provided"
    })
    
    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token"
        });
        
        req.userId = decoded.userId;
        next();

    }
    catch(error){
        console.error("Error in token verification:", error);
        return res.status(500).json({
            success:false,
            message: "Failed to authenticate token | Internal Server Error", 
        })
    }
}