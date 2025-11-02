import bcrypt from "bcryptjs";
import crypto from "crypto"
import User from "../models/User.js";
import { generateTokenAndSetCookie, generateVerificationCode } from "../utils/utils.js";
import { resetPasswordEmailTemplate, sendEmail, verificationEmailTemplate } from "../config/nodemailer.js";

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user) return res.status(400).json({
            success:false,
            message: "User not found!"
        });

        res.status(200).json({
            success:true,
            user
        })

    } catch (error) {
        console.error("Error while checking authentication!")
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

export const signup = async (req, res) => {
    const {email, password, name} = req.body;

    try {
        // validation logic
        if (!email || !password || !name) {
            throw new Error("All fields are required!")
        }

        const userAlreadyExists = await User.findOne({email});
        console.log("UserAlreadyExists:", userAlreadyExists);
        if (userAlreadyExists){
            return res.status(400).json({success:false, message:"User already exists!"});
        } 

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = generateVerificationCode();

        const user = new User({
            email,
            name,
            password: hashedPassword,
            verificationCode,
            verificationCodeExpiry: (Date.now() + 24 * 60 * 60 * 1000)
        })

        await user.save();

        generateTokenAndSetCookie(res, user._id.toString(), email);

        await sendEmail(
                user.email,
                "Verify your email",
                verificationEmailTemplate(verificationCode)
        );

        res.status(201).json({
            success:true,
            message:"User created successfully",
            user:{
                ...user,
                password: undefined
            }
        })
        
        
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

export const login = async (req, res) =>{
    const {email, password} = req.body;
    try {
        const user = await User.findOne({
            email:email
        }).select('+password');

        console.log(user);

        if(!user){
            return res.status(400).json({
                message:"User not found!!!"
            })
        }

        if(!user.isVerified){
            return res.status(400).json({
                message:"email not verified!!!"
            })
        }

        // check password
        console.log("Checking password....");
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            console.log("Password Invalid!!");
            return res.status(400).json({
                success:false,
                message: "Invalid email or password!!!"
            })
        }
        console.log("Password valid!!");
        
        generateTokenAndSetCookie(res, user._id.toString(), user.email);
        user.lastLogin = new Date();
        
        console.log("Saving user...");
        
        await user.save();

        console.log("User saved successuflly");
        

        res.status(200).json({
            success:true,
            message:"Logged in successfully",
            user: {
                ...user,
                password: undefined
            }
        })

    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error})
    }
}

export const logout = async (req, res) =>{
    res.clearCookie('token');
    res.status(200).json({
        sucess:true, 
        message:"Logged out successfully"
    })
}

export const verifyEmail = async (req, res) =>{
    const {verificationCode, email} = req.body;
    console.log(verificationCode);
    console.log(email);
    
    
    if(!verificationCode || !email) {
        return res.status(400).json({
            message:"Email and verification code are required!!!"
        })
    }

    try {
        const user = await User.findOne({email});
        console.log(user);
        
        // user doesnt exist
        if(!user){
            return res.status(400).json({
                message:"User not found!!!"
            })
        }
        // user is already verified
        if(user.isVerified){
            return res.status(400).json({
                message:"ALready verified!!!"
            })
        }
        // verification code doesn't match
        if(verificationCode !== user.verificationCode){
            return res.status(400).json({
                message:"Invalid verification code!"
            })
        }
        // verification code expired
        if(user.verificationCode && (user.verificationCodeExpiry) < new Date()){
            return res.status(400).json({
                success:false,
                message:"Verification code expired"
            })
        }
        console.log("User found!");
        

        user.isVerified = true;
        user.verificationCode = "";
        user.verificationCodeExpiry = undefined;

        console.log("saving user...");
        
        await user.save();

        console.log(" user saved");


        return res.status(200).json({
            success:true,
            message:"Email verified successfully"
        })
        
    } catch (error) {
        console.error("Error verifying email")
        res.status(500).json({
            sucess:false,
            message:"Internal server error"
        })
    }
}






export const forgotPassword = async (req, res) =>{
    const {email} = req.body;
    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({ success: false, message: "User not found" })
    }

    const resetPasswordCode = crypto.randomBytes(20).toString("hex");
    const resetPasswordCodeExpiry = new Date(Date.now()+60*60*1000);

    user.resetPasswordCode = resetPasswordCode;
    user.resetPasswordCodeExpiry = resetPasswordCodeExpiry;

    await user.save();

    await sendEmail(
        user.email,
        "Reset Your password",
        resetPasswordEmailTemplate(`${process.env.CLIENT_URL}/reset-password/${resetPasswordCode}`)
    )

    res.status(200).json({ success: true, message: "Password reset link sent to your email" });

}

export const resetPassword = async (req, res) =>{
    
    const {resetPasswordCode} = req.params;
    const {password} = req.body;

    try {
        const user = await User.findOne({
            resetPasswordCode: resetPasswordCode,
            resetPasswordCodeExpiry: {
                $gt: Date.now()
            }
        });
        
        // user doesnt exist
        if(!user){
            return res.status(400).json({
                message:"User not found!!!"
            })
        }
    } catch (error) {
        console.error("Error while resetting the password")
    }   
}

