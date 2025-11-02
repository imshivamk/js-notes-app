import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


console.log(process.env.EMAIL_ADDRESS);
console.log(process.env.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,      // your email
    pass: process.env.EMAIL_PASSWORD       // your email password or app password
  }
});



export const sendEmail = async (to, subject,html) =>{
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to,
        subject,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

//  templates

export const verificationEmailTemplate = (code) =>{
    return `
    <h2>Verify your email</h2>
    <p>Your verification code is <b>${code}</b></p>
    <p>Enter this code to verify your email address.</p>
  `;
}

export const welcomeEmailTemplate = (username) =>{
    return `
    <h2>Welcome, ${username}!</h2>
    <p>Thank you for registering with us. We’re excited to have you onboard.</p>
  `;
}

export const resetPasswordEmailTemplate = (resetLink) =>{
    return `
    <h2>Reset your password</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>If you did not request a password reset, please ignore this email.</p>
  `;
}


