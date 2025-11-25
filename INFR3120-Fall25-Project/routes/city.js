const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// pick-a-city page
router.get('/find', (req, res) => {
  const cities = ['toronto', 'vaughan', 'oshawa'];
  res.render('pick-city', { cities });
});

// dynamic route to load city file
router.get('/:city', (req, res) => {
  const city = req.params.city.toLowerCase();
  const filePath = path.join(__dirname, '..', 'data', `${city}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("City not found.");
  }

  const stores = JSON.parse(fs.readFileSync(filePath));
  res.render('city-stores', { city, stores });
});

module.exports = router;