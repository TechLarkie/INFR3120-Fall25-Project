//Tournament Data

import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
    {
        hostId: String,
         //store:  {type: mongoose.Schema.Types.ObjectId,  ref: "Store"},
        active: {type: Boolean, default: true},
        participants: [String],
        registeredPlayers: [String],
        players: [{type: mongoose.Schema.Types.ObjectId, ref: "Player"}],
        standings: Object,
        pairings: [{player1: String, player2: String, bye: Boolean,},],
    },
    {timestamps: true}
);

export default mongoose.model("Tournament", tournamentSchema);