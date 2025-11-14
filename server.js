//server side implementations
import mongoose from "mongoose";

import dotenv from 'dotenv';
dotenv.config(); //load host ID which is imported from .env


//MongoDB implementation
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:",err));

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; //allows the frontend to talk with the backend
import {stores, tournaments, players, decks } from './public/data.js'



const app = express(); //creates express server object and start webpage

app.use(bodyParser.json()); //Middleware which parses JSON
app.use(express.urlencoded({extended: true})) //Middleware which allows express to read data from forms which are sent from HTML

app.use(express.static('public')); //serves static files



const PORT = process.env.PORT || 3000; //Start the server and post a message to the console log which states which port is being listened to
app.listen(PORT, () => {console.log(`server listening on port ${PORT}`)});


