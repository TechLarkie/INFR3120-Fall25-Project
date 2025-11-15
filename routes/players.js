//Player API

import express from "express"; //import express

import Player from "../models/Player.js"; //import the data from Player.js



const router = express.Router(); //this router is used to attach route handlers, this is also later imported into the server.js which connects the API path


//creating a player; 'post' is used to send data to the server to create a new object, in this case creating a new player
router.post("/", async (req,res) => {
    try{
        const player = await Player.create(req.body); //creates a new player in mongodb
        res.status(201).json({message: "Player created successfully!"}); //the code '201' = 'created'
    } catch (err) {
        res.status(400).json({error: "Failed to create player"}); //throws up an error message if 
    }
});

//router.get is used retreive player data without modifying it, it gets the data from the database (in this case the mongodb database)
router.get("/", async (req,res) => {
    try{
        const players = await Player.find(); //this retireves all players
        res.json(players);
    } catch (error) {
        res.status(401).json({error: "Failed to fetch players!"});
    }
});


//router.get to retreive specific player data instead of all player data
router.get("/id:", async (req,res) => {
    try{
        const player = await Player.findById(req.params.id);

        if (!player) {
            return res.status(404).json({error: "Player not found!"});
        }
        res.json(player);
    }catch (error) {
        res.status(401).json({error: "Failed to fetch player!"}) //error 401 is resued here at it would be the same error regardless of whether or not its for one player or the database of players
    }
});


//router.put which is used to update an exsisting player in the database
router.put("/:id", async (req,res) => {
    try{
        const updatedPlayer = await Player.findByIdAndUpdate(
            req.params.id, //new ID
            req.body, //new Data 
            {new: true} //return the new updated information instead of the old information
        );
        
        if (!updatedPlayer) {
            return res.status(404).json({error: "Player not found!"});
        }

        res.json({message: "Player Updated successfully!"});
    } catch (error){
        res.status(405).json({error: "Failed to update player!"});
    }
});

//router.delete is used to delete a player from the database
router.delete("/:id", async (req,res) => {
    try{
        const deletedPlayer = await Player.findByIdAndDelete(req.params.id);

        if (!deletedPlayer){
            return res.status(404).json({error: "Player not found!"});
        }
        res.json({message: "Player deleted successfully!"});
    } catch (error){
        res.status(406),json({error: "Failed to delete player!"})
    }
});


export default router; //this allows server.js to mount all of the above editing functions onto a path


