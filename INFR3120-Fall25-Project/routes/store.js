//page dedicated to store API

const express = require("express");
const router = express.Router();

const Store = require("../models/Store"); // require the model which was created in the store model file


// using router.get to obtain a specific store
router.get('/', async (req, res, next) => {
  try {
    const city = req.query.city || '';

    // if the name of the specific city is provided, match that 
    const filter = city ? { city } : {};

    const stores = await Store.find(filter).sort({ city: 1, name: 1 });

    res.render('store', {
      title: 'DrawThree | Find a Store',
      stores,
      city,
    });
  } catch (err) {
    next(err);
  }
});


// code which will allow for the addition of a new store

router.post('/', async (req, res, next) => {
  try {
    const { name, city, address } = req.body;

    if (!name || !city || !address) {
   
      return res.status(400).send('All fields are required.');
    }

    await Store.create({ name, city, address });

    // After adding, go back to the list
    res.redirect('/store');
  } catch (err) {
    next(err);
  }
});

module.exports = router;