import mongoose, { Model, Schema } from "mongoose";

const voterSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    studentId: { type: String, unique: true, required: true },
    department: { type: String, required: true },
    yearLevel: { type: Number, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Voter = mongoose.model('Voter', voterSchema);

export default Voter;
