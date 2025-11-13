//server side implementations
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import {stores, tournaments, players, decks } from './public/data.js'

dotenv.config(); //load host ID which is imported from .env

const app = express(); //creates express server object and start webpage

app.use(bodyParser.json()); //Middleware which parses JSON

app.use(express.static('public')); //serves static files


const PORT = process.env.PORT || 3000; //Start the server and post a message to the console log which states which port is being listened to
app.listen(PORT, () => {console.log(`server listening on port ${PORT}`)});


