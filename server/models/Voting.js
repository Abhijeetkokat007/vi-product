import mongoose from "mongoose";

const Votings = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  candidates: [{
    name: { type: String, required: true, trim: true },
    votes: { type: Number, default: 0 },
  }],
  votedBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  status: {
    type: String,
    enum: ['Upcoming', 'In Progress', 'Completed'],
    default: 'Upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Voting = mongoose.model('Voting', Votings);