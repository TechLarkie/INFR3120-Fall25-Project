//User Model for authentication


import mongoose from "mongoose";


const   userSchema = new mongoose.Schema({
        username: {type: String, required: true}, //require a username
        email: {type: String, required: true, lowercase: true, trim: true, unique: true}, //requires an email address, the email will automatically be turned all lowercase and if a user adds like an extra space in the submission it is automatically removed once submitted
        passwordHash: {type: String, required: true}, //require a password for the accout
    },
    {timestamps: true}
);

export default mongoose.model("User",userSchema);
