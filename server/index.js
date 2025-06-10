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

dotenv.config();

const app = express();

// Enable __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS Setup
app.use(cors({
  origin: 'https://vi-product.onrender.com',  // ✅ your frontend URL
  credentials: true, // ✅ allows cookies/auth
}));

// CORS headers (optional fallback)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://vi-product.onrender.com');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Handle preflight (OPTIONS)
app.options('*', cors({
  origin: 'https://vi-product.onrender.com',
  credentials: true
}));

// Body parser
app.use(express.json());

// Connect MongoDB
const MongoDBConn = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ MongoDB connected');
  } catch (e) {
    console.log('❌ MongoDB error:', e.message);
  }
};
MongoDBConn();

// Routes
app.post('/api/voters/register', registerVoter);
app.post('/api/voter/login', loginVoter);

app.post('/api/addelection', addele);
app.get('/elections', getele);
app.delete('/elections/:id', deletelection);

app.post('/api/adminregistaer', adminpost);
app.post('/api/adminlogin', adminLogin);

app.post('/api/add-application', upload.single('document'), addStudentApplication);
app.get('/api/get-application', getStudentElections);

app.post('/api/add-voting', addvoting);
app.get('/api/get-voting', getvotings);
app.post('/api/now-voting', voteForNominee);
app.delete('/delete-voting/:id', deleteVoting);

app.post('/api/contact', submitContactForm);

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

