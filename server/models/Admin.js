import mongoose from "mongoose";

const { Schema, model } = mongoose;

const voterSchema = new Schema({
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true }
});

const Admin = model('Admin', voterSchema);

export default Admin;
