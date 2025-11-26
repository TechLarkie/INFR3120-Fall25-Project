import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//IF U WANT A STORE... U NEED A CITY. YK??
router.get('/', (req, res) => {
  const cities = ['toronto', 'vaughan', 'oshawa'];
  res.render('pickcity', { cities });
});

//this will load the city file u chose
router.get('/:city', (req, res) => {
  const city = req.params.city.toLowerCase();
  const filePath = path.join(__dirname, "..", "data", `${city}.json`);

  console.log("Resolved Path:", filePath);
  console.log("Exists:", fs.existsSync(filePath));


  if (!fs.existsSync(filePath)) 
  {
    return res.status(404).send("Error 404: City Not Found :(");
  }

  const stores = JSON.parse(fs.readFileSync(filePath));
  res.render('citystores', { city, stores });
});

export default router;
