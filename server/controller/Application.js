import Application from '../models/Application.js';
import { v2 as Cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure Cloudinary
Cloudinary.config({
  cloud_name: "djjocd550",
  api_key: "811242697192453",
  api_secret: "SJrVowif1T34juzxwYPpC5xuThI",
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOC/DOCX files are allowed.'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export const addStudentApplication = async (req, res) => {
  try {
    const { name, department, studentId, email, yearLevel, electionName } = req.body;

    // Check if all required fields are present
    if (!name || !department || !studentId || !email || !yearLevel || !electionName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if document was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Document is required' });
    }

    // Upload file to Cloudinary
    const uploadResponse = await Cloudinary.uploader.upload(req.file.path, {
      folder: 'election-documents',
      resource_type: 'raw'
    });

    // Create new application entry
    const newEntry = new Application({
      name,
      department,
      studentId,
      email,
      yearLevel,
      electionName,
      document: uploadResponse.secure_url,
    });

    await newEntry.save();

    // Clean up: Delete file from local storage after upload
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting local file:', err);
    });

    res.status(201).json({
      message: 'Student election data added successfully',
      data: newEntry
    });

  } catch (error) {
    // Clean up: Delete file from local storage if exists
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting local file:', err);
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
};


export const getStudentElections = async (req, res) => {
  try {
    // Retrieves all entries from Application collection
    const studentElections = await Application.find();

    // Checks if any entries exist
    if (studentElections.length === 0) {
      return res.status(404).json({ message: 'No student election data found' });
    }

    res.status(200).json({ 
      message: 'Student election data retrieved successfully', 
      data: studentElections 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error.message 
    });
  }
};