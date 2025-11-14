// Deck data

import mongoose from "mongoose";

const deckSchema = mongoose.Schema(
    {
        playerId: {type: mongoose.Schema.Types.ObjectId, ref:"Player"},
        cards: [String],
    },
    {timestamps: true},
);

export default mongoose.model("Deck", deckSchema);