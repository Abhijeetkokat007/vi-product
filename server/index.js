import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { loginVoter, registerVoter } from './controller/Voter.js';
import { addele, deletelection, getele } from './controller/Election.js';
import { adminLogin, adminpost } from './controller/Admin.js';
import { addStudentApplication, getStudentElections, upload } from './controller/Application.js';
import { addvoting, deleteVoting, getvotings, voteForNominee } from './controller/Voting.js';
import { submitContactForm } from './controller/Contact.js';

dotenv.config();
const __dirname = path.resolve();
const app = express();
app.use(cors());
app.use(express.json());

const MongoDBConn = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    if (conn) {
      console.log('MongoDB connected');
    }
  } catch (e) {
    console.log(e.message);
  }
};
MongoDBConn();

app.post('/api/voters/register', registerVoter);
app.post("/api/voter/login", loginVoter)

app.post("/api/addelection", addele)
app.get("/elections", getele);
app.delete("/elections/:id", deletelection);

app.post('/api/adminregistaer', adminpost);
app.post('/api/adminlogin', adminLogin);

app.post('/api/add-application', upload.single('document'), addStudentApplication);
app.get('/api/get-application', getStudentElections);

app.post('/api/add-voting', addvoting);
app.get('/api/get-voting', getvotings)
app.post('/api/now-voting', voteForNominee)
app.delete('/delete-voting/:id', deleteVoting);

app.post('/api/contact', submitContactForm);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
  });
}

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
