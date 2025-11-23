//Store Data

const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
    {
        name: String,
        city: String,
        address: String,
    },
    {timestamp: true}

);

module.exports = mongoose.model("Store",storeSchema);