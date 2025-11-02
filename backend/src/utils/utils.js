import jwt from 'jsonwebtoken';

export const generateVerificationCode = () =>{
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max-min)+min).toString();
}

export const generateResetCode = () =>{
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max-min)+min).toString();
}

export const generateToken = (userId, email)  => {
    
    const token = jwt.sign(
        {userId, email},
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
    console.log("Generating token...");
    
    return token;
}

export const generateTokenAndSetCookie =  (res, userId, email)  =>{
    
    
    const token = generateToken(userId, email);
    
    console.log("Saving cookie...");
    
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    console.log("Cookie saved...");
    

    return token;
}


