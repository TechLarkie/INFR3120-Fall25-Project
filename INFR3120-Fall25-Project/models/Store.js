//Store Data

import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
    {
        name: String,
        city: String,
        address: String,
        hostId: String, //this is used by api/verify-host
    },
    {timetamps: true}

);

export default mongoose.model("Store", storeSchema);