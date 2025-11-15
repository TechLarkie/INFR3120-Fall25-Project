//Deck API

import express from "express"; //import express

const router = express.Router(); //this router is used to attach route handlers, this is also later imported into the server.js which connects the API path


import Deck from "../models/Deck.js"; //imports the data from Deck.js 
import { json } from "body-parser";


router.post("/", async (req,res) => {
    try{
        const createdDeck = await Deck.create(req.body); // req.body will contain the json file from the frontend (aka the user) and this is passed onto Deck.create which saved it to the mongoDB database
        res.status(201).json(createdDeck);
    } catch (err) {
        res.status(400).json({error: "Failed to add Deck to Database!"})
    }
 });




//router.get is used to retireve all decks from the mongoDB database

router.get("/", async (req,res) => {
    try{
        const decks = await Deck.find(); //this will return every deck which is saved in the deck collection on mongoDB
        res.json(decks);
    } catch (err) {
        res.status(401).json({error: "Failed to fetch all decks!"})
    }
});

//router.get being used to retireve just one specific deck instead of the whole collection of decks
router.get("/id:", async (req,res) =>{
    try{
        const deck = await Deck.findById(req.params.id); //pulls up the id for the specific deck 

        if (!deck){
            return res.status(404).json({error: "Deck was not found!"}); //this is incase the deck which is being searched for cannot be found in the database
        }
    } catch (err) {
        res.status(400).json({error: "Request failed!"});
    }
});



//router.put which is used to update or even replace exsisting decks in the database
router.put("/:id", async (req,res) => {
    try{
        const updateDeck = await Deck.findByIdAndUpdate(
            req.params.id, //new ID
            req.body, //new Data for the deck
            {new: true} //replaces the old data with the new data
        );
        
        if (!updateDeck){
            return res.status(404).json({error: "Deck not found!"});
        }

        res.json({message: "Deck has been updated!"});
    } catch (err) {
        res.status(400).json({error: "Unable to update deck!"})
    }
    
});



//router.delete being used to delete a specific deck from the database entirely
router.delete("/:id", async (req,res) => {
    try{
        const deletedDeck = await Deck.findByIdAndDelete(req.params.id); //deletes the deck after its ID has been requested 

        if (!deletedDeck){
            return res.status(404).json({error: "Specified deck could not be found!"});
        }

        res.json({message: "Specified deck has been successfully deleted!"});
    } catch (err){
        res.status(400),json({error: err.message})
    }
});


export default router; //allows server.js to use the code above to perform the specified actions on the user created decks