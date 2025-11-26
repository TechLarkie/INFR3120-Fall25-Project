const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

//IF U WANT A STORE... U NEED A CITY. YK??
router.get('/', (req, res) => {
  const cities = ['toronto', 'vaughan', 'oshawa'];
  res.render('pickcity', { cities });
});

//this will load the city file u chose
router.get('/:city', (req, res) => {
  const city = req.params.city.toLowerCase();
  const filePath = path.join(__dirname, '..', 'data', `${city}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Error 404: City Not Found :(");
  }

  const stores = JSON.parse(fs.readFileSync(filePath));
  res.render('citystores', { city, stores });
});

module.exports = router;
