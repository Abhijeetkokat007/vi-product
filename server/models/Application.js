import mongoose from 'mongoose';

const StudentElectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  studentId: { type: String, required: true },
  email: { type: String, required: true },
  yearLevel: { type: String, required: true },
  document: { type: String, required: true },
  electionName: { type: String, required: true },
}, { timestamps: true });

const Application = mongoose.model('Application', StudentElectionSchema);

export default Application;
