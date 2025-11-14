// Store Data

import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
    {
        name: String,
        city: String,
        address: String,
    },
    {timestamp: true}

);

export default mongoose.model("Store", storeSchema);