import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

export const adminpost = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin with this email already exists.' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully.' });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

  
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.status(200).json({ message: 'Login successful.' });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};