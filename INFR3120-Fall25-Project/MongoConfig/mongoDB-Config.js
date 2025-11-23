//code for directly connecting to mongoDB

const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(() => {
        console.log("Established Connection to MongoDB");
    })
    .catch((err) => {
        console.error("Unable to Establish Connection to MongoDB");
    });