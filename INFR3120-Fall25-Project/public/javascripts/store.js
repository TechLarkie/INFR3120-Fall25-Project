//Store API

import express from "express"; //import express



const router = express.Router();

//router.get is used to retireve a list of authorized stores from a specified city parameter
router.get("/:city", async (req,res) => {
    try{
        const city = req.params.city; //getting the city ID
        const stores = await Store.find({city: new RegExp(`^${city}$`, 'i')});
        res.json(stores);
    } catch (err) {
        res.status(407).json({error: "Server error while retireving store information"});
    }
});


//router.post is used to create a new store entry into the database
router.post('/', async (req,res) => {

    try{


    const newStore = new Store(req.body);
    await newStore.save(); //saves the new store to the mongoDB database
    res.status(201).json({message: "New store successfully added", store: newStore});

    } catch (err){
        res.status(400).json({error: "Unable to add new store!"});
    }
});




//updating and deleting stores can be added in later












export default router;