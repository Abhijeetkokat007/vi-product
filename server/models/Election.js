import { Schema, model } from "mongoose";


const electionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    nominationPeriod: { type: String, required: true },
    campaignPeriod: { type: String, required: true },
    votingPeriod: { type: String, required: true },
    resultDeclaration: { type: String, required: true },
});

const Election = model("Election", electionSchema);
export default Election;
