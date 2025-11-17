//server side implementations yes yes :D
import mongoose from "mongoose";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; //allows the frontend to talk with the backend
import {stores, tournaments, players, decks } from './public/data.js'

import dotenv from 'dotenv';
dotenv.config(); //load host ID which is imported from .env


//MongoDB implementation
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:",err));

const app = express(); //creates express server object and start webpage

app.use(cors()); //Enables CORS for all routes :3
app.use(bodyParser.json()); //Middleware which parses JSON
app.use(express.urlencoded({extended: true})) //Middleware which allows express to read data from forms which are sent from HTML
app.use(express.static('public')); //serves static files

//for verifying the tourny hosyt id :3
app.post('/api/verify-host', (req, res) => {
    const { hostId } = req.body;   
    if (hostId === process.env.HOST_ID) {
        return res.json({ valid: true });
    } else {
        return res.json({ valid: false, error: "Host ID Not Found :( Please try again!" });
    }   
});

//next comes the tournament joining things >:3
app.post('/api/join-tournament', (req, res) => {
    const { playerName, tournamentId } = req.body;
 
// database stuff will go in here once it is complete

    return res.json({ message: "You're in! Prepare to play! :)", playerId: newPlayer.id });
});

//starting the actual tourney
app.post('/api/start-tournament', (req, res) => {
    let { participants } = req.body; //an array of all the participating players

    if (!participants || participants.length < 4 || participants.length > 32) {
        return res.json({
            valid: false,
            error: "Invalid number of participants! Must be between 4 and 32!"
        });
    }
    
    participants = participants.sort(() => Math.random() - 0.5); //shuffle the ppl 
    let pairings = [];

    if (pairings.length % 2 !== 0) {
        //access to database of player scores here 
        const playerBye = participants[participants.length - 1];
        pairings.push({ player1: playerBye, player2: null, bye: true });

        participants.pop(); //say bye bye to the bye :)
    }

    //this handles the pairings yknow... after the bye has been removed
    for (let x = 0; x < participants.length; x += 2) {
        pairings.push({
            player1: participants[x],
            player2: participants[x + 1],
            result: null
        });
    }

    //save pairings and tourney state to DB (to be done later)

    return res.json({ success: true, message: "Successfully Started!", pairings});
});

//this is for deck manipulation. yk saving and updating decks n stuff
app.post('/api/save-deck', (req, res) => {
    const { playerId, deckData } = req.body;

    //database stuff to save or update the deck in the DB shoutout mongo

    return res.json({ success: true, message: "Deck saved successfully!" });
});

//grabbing a player's deck
app.get('/api/get-deck/:playerId', (req, res) => {
    const { playerId } = req.params;

    //grab deck from database

    return res.json({ success: true, deckData: [] });
});

//locating stores within cities 
app.get('/api/stores/:city', (req, res) => {
    const { city } = req.query.city;

    //mongo stuff for stores in cities goes here

    return res.json({ success: true, stores: [] });
});

//just in case anything happens that we don't account for. better to be safe than sorry yk
app.use((req, res) => {
    res.status(404).json({ error: "Unknown Route.. Where are you going???" });
});

const PORT = process.env.PORT || 3000; //Start the server and post a message to the console log which states which port is being listened to
app.listen(PORT, () => {console.log(`server listening on port ${PORT}`)});


