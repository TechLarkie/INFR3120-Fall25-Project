//Player Data

const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(

    {
        name: {type: String, required: true},
        rating: {type: Number, default:1000},
        country: {type: String},
    },
    {timestamps: true}

);

module.exports = mongoose.model("Player",playerSchema);