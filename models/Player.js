//Player Data

import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(

    {
        name: {type: String, required: true},
        rating: {type: Number, default:1000},
        country: String,
    },
    {timestamps: true}

);

export default mongoose.model("Player", playerSchema);