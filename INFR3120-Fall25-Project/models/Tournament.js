//Tournament Data

import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
    {
        hostId: String,
        active: {type: Boolean, default: true},
        players: [{type: mongoose.Schema.Types.ObjectId, ref: "Player"}],
        standings: Object,
    },
    {timestamps: true}
);

export default mongoose.default("Tournaments", tournamentSchema);