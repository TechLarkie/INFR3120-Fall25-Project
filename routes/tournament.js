//Tournament API


import express from 'express'; //import express

import Tournament from "../models/Tournament.js"; //import data from Tournament.js


const router = express.Router(); //used to attach route handlers which will be used in this section





//router.get to retireve data in active tournamnets 

router.get("/active", async(req,res) => {
    try {
        const activeTournaments = await Tournament.find({active: true}); //finds a tournament in the data which is given the flag of 'active'
        res.json(activeTournaments);

    } catch (err){
        res.status(407).json({error: "Error while retreving active tournamnets"});
    }
});


//router.post will be used to display a tournamnet which a player can join

router.post("/join", async (req,res) => {
    try{
        const {playerId,tournamentId} = req.body; //requests that the player ID and the specific tournament ID be inputted in order to join
        const tournament = await Tournament.findById(tournamentId);

        if (!tournament){ //this is incase the tournament which the user is looking for is not found
            return res.status(404).json({error: "Tournament was not found !"})
        }


        if (tournament.registeredPlayers.includes(playerId)){
            return res.status(400).json({error: "Player ID is already registered in a tournament"})
        }

        tournament.registeredPlayers.push(playerId); //this adds the player ID
        await tournament.save();

        res.json({message: {playerId} + "has been successfully added"}) //displays a statement which includes the given playerID and that they have been successfully added to the collection
    } catch (err) {
        res.status(400).json({error: "Error, unable to join tournament !"})
    }
});

//router.post used to create new tournaments

router.post("/", async (req,res) =>{
    try{
        const newTournament = new Tournament(req.body);
        await newTournament.save();
        res.status(201).json({message: "New tournament created!", tournament: newTournament});
    } catch (err){
        res.status(400).json({error: "Error during tournament creation!"});
    }
});


export default router;