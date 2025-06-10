


import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { loginVoter, registerVoter } from './controller/Voter.js';
import { addele, deletelection, getele } from './controller/Election.js';
import { adminLogin, adminpost } from './controller/Admin.js';
import { addStudentApplication, getStudentElections, upload } from './controller/Application.js';
import { addvoting, deleteVoting, getvotings, voteForNominee } from './controller/Voting.js';
import { submitContactForm } from './controller/Contact.js';

// Setup environment variables
dotenv.config();

const app = express();

// Get __dirname in ES module style
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Proper CORS setup
const allowedOrigins = ['https://vi-product.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Handle preflight requests
app.options('*', cors({
  origin: 'https://vi-product.onrender.com',
  credentials: true
}));

// Middleware
app.use(express.json());

// ✅ MongoDB connection
const MongoDBConn = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connected');
  } catch (e) {
    console.error('MongoDB connection error:', e.message);
  }
};
MongoDBConn();

// === Routes ===

// Voter
app.post('/api/voters/register', registerVoter);
app.post("/api/voter/login", loginVoter);

// Election
app.post("/api/addelection", addele);
app.get("/elections", getele);
app.delete("/elections/:id", deletelection);

// Admin
app.post('/api/adminregistaer', adminpost);
app.post('/api/adminlogin', adminLogin);

// Applications
app.post('/api/add-application', upload.single('document'), addStudentApplication);
app.get('/api/get-application', getStudentElections);

// Voting
app.post('/api/add-voting', addvoting);
app.get('/api/get-voting', getvotings);
app.post('/api/now-voting', voteForNominee);
app.delete('/delete-voting/:id', deleteVoting);

// Contact Form
app.post('/api/contact', submitContactForm);

// === Production build serving ===
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

// === Start server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
