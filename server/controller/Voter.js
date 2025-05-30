import Voter from "../models/Voter.js";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

function generateRandomPassword(length = 8) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // This may help if there's a self-signed certificate issue
    }
});


transporter.verify((error, success) => {
    if (error) {
        console.error("Email setup error:", error);
    } else {
        console.log("Email server is ready to send messages");
    }
});


export const registerVoter = async (req, res) => {
    try {
        const { firstName, lastName, email, studentId, department, yearLevel } = req.body;

        const existingVoter = await Voter.findOne({ $or: [{ email }, { studentId }] });
        if (existingVoter) {
            return res.status(400).json({ message: 'Email or Student ID already registered' });
        }


        const password = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        const newVoter = new Voter({
            firstName,
            lastName,
            email,
            studentId,
            department,
            yearLevel,
            password: hashedPassword
        });

        await newVoter.save();


        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Voter Registration Password for VoteSecure',
            text: `Hello ${firstName} ${lastName},\n\nYour registration has been succefull. For voting login with your register email, Here is your password: ${password}\n\nPlease keep it secure.\n\nBest regards,\nVotesecure Team`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: 'Voter registered successfully. Password has been sent to your email.'
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginVoter = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const voter = await Voter.findOne({ email });
      if (!voter) {
        return res.status(400).json({ message: 'Email not found. Please register first.' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, voter.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      res.status(200).json({
        message: 'Login successful',
        voter: {
          id: voter._id,
          firstName: voter.firstName,
          lastName: voter.lastName,
          email: voter.email,
          studentId: voter.studentId
        }
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };