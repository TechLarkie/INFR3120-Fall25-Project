//Tournamenrt API

const express = require('express');
const router = express.Router();

//require the MongDB models which were created in the models folder
const Tournament = require('../models/Tournament');
const Store = require('../models/Store');
const Player = require('../models/Player');




//using router.get to get active tournamnets 
router.get('/', async (req,res,next) =>{
    try{
        const tournaments = await Tournament.find({active: true}) //querying the database for active tournaments and for the related player, store and date data
        .populate('players')
        .populate('store')
        .sort({date: 1});


        const stores = await Store.find().sort({city: 1, name: 1}); //obtain all the store data and sort the stores by their names and city

        res.render('tournament',{title: 'DrawThree | Tournaments', tournaments, stores,}); //just saying to render the tournamnent view with the given variables tournaments and stores

    } catch(err){
        next(err);
    }

});



//using router.post to create a new tournamnet
router.post('/create', async (req,res,next) => {
    try{
        const {name, storeId, date} = req.body;

        if (!name || !storeId || !date) { //responds with an error if the requested fields are not provided
            return res.status(400).send('the Name, Store ID and date fields are required!');
        }

        await Tournament.create({name, store: storeId, date: new Date(date,)}); //this line adds a new 'document' into the mongoose databate

        res.redirect('/tournament'); //page redirect once the creation of the tournament is completed
        
    } catch(err) {
        next(err);
    }
});



//using router.post to create a new player and add them to an ongoing tournament
router.post('/join', async (req,res,next) => {
    try{
        const{tournamentId, playerName, country} = req.body; //variables which will be part of the required field for the player which we are adding

        if (!tournamentId || !playerName) {
            return res.status(400).send('The Tournament and Player Name fields are required!');
        }

        const player = await Player.create({name: playerName, country: country || undefined,}); //add a new document to the mongoDB collection, the reason that country has both 'country' and 'undefined' is incase it is not mentioned by the user since it was not required 

        await Tournament.findByIdAndUpdate(tournamentId, {$addtoSet: {players: player._id}}, {new: true}); //finds the tournament and adds players without duplicates

        res.redirect('/tournament');
    } catch (err) {
        next(err);
    }
});


module.exports = router;