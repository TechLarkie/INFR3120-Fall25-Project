//server side implementations yes yes :D
import mongoose from "mongoose";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; //allows the frontend to talk with the backend
import {stores, tournaments, players, decks } from './public/data.js'

import dotenv from 'dotenv';
dotenv.config(); //load host ID which is imported from .env

import Tournament from "./models/Tournament.js";
import Store from "./models/Store.js";
import Player from "./models/Player.js";


//MongoDB implementation
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:",err));

const app = express(); //creates express server object and start webpage

app.use(cors()); //Enables CORS for all routes :3
app.use(bodyParser.json()); //Middleware which parses JSON
app.use(express.urlencoded({extended: true})) //Middleware which allows express to read data from forms which are sent from HTML
app.use(express.static('public')); //serves static files

//group comment for all the stuff. we use async here for await which helps with error catching. if promise is returned, all is well. if not, 
//then we catch it and post error msg

//for verifying the tourny hosyt id :3
app.post('/api/verify-host', async (req, res) => {
    const { hostId } = req.body; 
    
    try {
        const store = await Store.findOne({ hostId });
        if (!store)
          return res.json({ valid: false, message: "No such host ID exits! >:(" });
        else{
            res.json({ valid: true, strName: store.name });
        }
  } 
        
    catch {
    res.status(500).json({ valid: false, message: "The server has run into an error :( pls try again" });
  }
});

//creating tournaments 
app.post("/api/host/setup", async (req, res) => {
  const { hostId, players } = req.body;

  if (players.length < 4 || players.length > 32)
    return res.json({ valid: false, message: "wrong number of players!! pls change" });

  try {
    const newTournament = new Tournament({hostId, participants: players, standings: players.map((p) => ({ playerId: p, points: 0 })), active: true,});
    const saved = await newTournament.save();

    res.json({ success: true, tournamentId: saved._id });
  } 
      
  catch (error) {
    res.status(500).json({ valid: false, message: "The server has run into an error :( pls try again" });
  }
});

//next comes the tournament joining things >:3
app.post('/api/join-tournament', async (req, res) => {
    const { playerId, tournamentId } = req.body;
    try {
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament)
          return res.json({ valid: false, message: "Couldn't find tournament. Please try again." });
        
        //if player id is not in the tournament at point of registration
        if (!tournament.registeredPlayers.includes(playerId)) {
          tournament.registeredPlayers.push(playerId);
          await tournament.save();
        }
        return res.json({ valid: true });
  } 
        
    catch {
    res.status(500).json({ success: false, message: "The server has run into an error :( pls try again" });
  }

});



//starting the actual tourney
app.post('/api/start-tournament', async (req, res) => {
    try {
        let { tournamentId } = req.body;

        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).json({
                valid: false,
                error: "Tournament not found! Pls Try Again"
            });
        }

        let participants = [...tournament.participants];

        if (participants.length < 4 || participants.length > 32) {
            return res.json({valid: false, error: "Invalid number of participants! Must be between 4 and 32!"});
        }

        participants.sort(() => Math.random() - 0.5);

        let pairings = [];

        if (participants.length % 2 !== 0) {
            const standings = tournament.standings || {};
            const scores = Object.values(standings);
            const minScore = scores.length ? Math.min(...scores) : 0;
            const lowestPlayers = participants.filter(p => (standings[p] || 0) === minScore);
            const byePlayer = lowestPlayers[Math.floor(Math.random() * lowestPlayers.length)];
        
            pairings.push({ player1: byePlayer, player2: null, bye: true });
            standings[byePlayer] = (standings[byePlayer] || 0) + 1;
            participants = participants.filter(p => p !== byePlayer);
            tournament.standings = standings;
}
        for (let x = 0; x < participants.length; x += 2) {
            pairings.push({ player1: participants[x], player2: participants[x + 1], bye: false });
        }

        tournament.pairings = pairings;
        await tournament.save();

        res.json({ valid: true, pairings });

    } 
        
    catch (err) {
        console.error(err);
        res.status(500).json({valid: false, error: "The server has run into an error :( pls try again"});
    }
});

//grab actives
    app.get("/api/tournaments/active", async (req, res) => {
  const active = await Tournament.find({ active: true });
  res.json(active);
});


//locating stores within cities 
app.get('/api/stores/:city', async (req, res) => {
    const city = req.params.city;
    
      try {
        const storeList = await Store.find({ city });
        res.json(storeList);
      } 
      
      catch {
        res.status(500).json({ success: false, message: "The server has run into an error :( pls try again" });
      }
});

//just in case anything happens that we don't account for. better to be safe than sorry yk
app.use((req, res) => {
    res.status(404).json({ error: "Unknown Route.. Where are you going???" });
});

const PORT = process.env.PORT || 3000; //Start the server and post a message to the console log which states which port is being listened to
app.listen(PORT, () => {console.log(`server listening on port ${PORT}`)});


