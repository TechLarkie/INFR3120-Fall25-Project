//server side implementations yes yes :D
import mongoose from "mongoose";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; //allows the frontend to talk with the backend

//imports for authentication
import session from "express-session";
import MongoStore from "connect-mongo";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; //new user model

import dotenv from 'dotenv';
dotenv.config(); //load host ID which is imported from .env

import Tournament from "./models/Tournament.js";
import Store from "./models/Store.js";
import Player from "./models/Player.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import cityRouter from "./routes/city.js";

//MongoDB implementation
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:",err));

const app = express(); //creates express server object and start webpage

//telling express how to render EJS pages
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(cors()); //Enables CORS for all routes :3
app.use(bodyParser.json()); //Middleware which parses JSON
app.use(express.urlencoded({extended: true})) //Middleware which allows express to read data from forms which are sent from HTML
app.use(express.static('public')); //serves static files

app.use('/findastore', cityRouter);

//login sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 days
  })
);


//the flash message for when something wrong is inputted
function setFlash(req, type, message) {
  req.session.flash = { type, message };
}


//keeps the login information available across all the pages that the user will access
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.isLoggedIn = Boolean(req.session.user);

  //flash
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;

  next();
});

//the user should only be able to access these pages once they are logged in
const protectedRules = [
  { method: "GET", path: "/tournament" },
  { method: "POST", path: "/api/host/setup" },
  { method: "POST", path: "/api/join-tournament" },
  { method: "POST", path: "/api/start-tournament" },
];

//Middleware that checks each request against the protected list and forces a login if needed
app.use((req, res, next) => {
  const needsLogin = protectedRules.some(
    (r) => r.method === req.method && r.path === req.path
  ); //Checks if the current request matches one of the protected routes.

  if (!needsLogin) return next();      // If the route isn’t protected then its fine
  if (req.session.user) return next(); // If a valid session user exists then its fine


  //if it’s a fetch/API request, return JSON so the frontend can react
  if (req.path.startsWith("/api/")) {
    return res.status(401).json({
      valid: false,
      success: false,
      message: "Login required.",
      redirectTo: "/login",
    });
  }


    //If it’s a normal page request, redirect to the login page and remember where the user wanted to go
  return res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`);
});


//Server.js page routes which take precedent over the previous app.js routes
app.get("/", (req, res) => {
  res.render("index", { title: "DrawThree" });
});

app.get("/store", (req, res) => {
  res.render("store", { title: "DrawThree | Find a Store" });
});

app.get("/tournament", (req, res) => {
  res.render("tournament", { title: "DrawThree | Tournaments" });
});




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
        return res.json(storeList);
      } 
      
      catch {
        res.status(500).json({ success: false, message: "The server has run into an error :( pls try again" });
      }
});





//just going to group comment everything here but this is basically all of the authentication dude 
app.get("/login", (req, res) => {
  
  if (req.session.user) return res.redirect(req.query.next || "/");
  res.render("login", { title: "DrawThree | Login", next: req.query.next || "/" });
});

app.get("/register", (req, res) => {

  if (req.session.user) return res.redirect(req.query.next || "/");
  res.render("register", { title: "DrawThree | Register", next: req.query.next || "/" });
});


app.post("/login", async (req, res) => {
  try {
    const { email, password, next } = req.body;

    const user = await User.findOne({ email: (email || "").trim().toLowerCase() });
    if (!user) {
      setFlash(req, "danger", "Invalid email or password.");
      return res.redirect(`/login?next=${encodeURIComponent(next || "/")}`);
    }

    const ok = await bcrypt.compare(password || "", user.passwordHash);
    if (!ok) {
      setFlash(req, "danger", "Invalid email or password.");
      return res.redirect(`/login?next=${encodeURIComponent(next || "/")}`);
    }

    req.session.user = { id: user._id.toString(), username: user.username, email: user.email };
    return res.redirect(next || "/");
  } catch (err) {
    console.error(err);
    setFlash(req, "danger", "Login failed. Please try again.");
    return res.redirect(`/login?next=${encodeURIComponent(req.body.next || "/")}`);
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword, next } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      setFlash(req, "danger", "All fields are required.");
      return res.redirect(`/register?next=${encodeURIComponent(next || "/")}`);
    }
    if (password !== confirmPassword) {
      setFlash(req, "danger", "Passwords do not match.");
      return res.redirect(`/register?next=${encodeURIComponent(next || "/")}`);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
    });

    req.session.user = { id: user._id.toString(), username: user.username, email: user.email };
    return res.redirect(next || "/");
  } catch (err) {
    if (err?.code === 11000) {
      setFlash(req, "danger", "Username or email already exists.");
      return res.redirect(`/register?next=${encodeURIComponent(req.body.next || "/")}`);
    }
    console.error(err);
    setFlash(req, "danger", "Registration failed. Please try again.");
    return res.redirect(`/register?next=${encodeURIComponent(req.body.next || "/")}`);
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});












//just in case anything happens that we don't account for. better to be safe than sorry yk
app.use((req, res) => {
    res.status(404).json({ error: "Unknown Route.. Where are you going???" });
});

const PORT = process.env.PORT || 3000; //Start the server and post a message to the console log which states which port is being listened to
app.listen(PORT, () => {console.log(`server listening on port ${PORT}`)});


