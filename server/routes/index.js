const express = require('express');
const db = require('../index');
const router = express.Router();

router.get('/', async (req, res, next) => {
   try{
    let results = await db.all(req.params.all);
        res.json(results);
   } catch(e){
       console.log(e);
       res.sendStatus(500);
   }
});
router.get('/allships', async (req, res, next) => {
    try{
     let results = await db.shipinfo(req.params.shipinfo);
         res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
 });
router.get('/allitems', async (req, res, next) => {
    try{
     let results = await db.iteminfo(req.params.iteminfo);
         res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
 });
router.get('/i/:id', async (req, res, next) => {
    try{
     let results = await db.id(req.params.id);
     res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
 });
 router.get('/s/:ships', async (req, res, next) => {
    try{
     let results = await db.ships(req.params.ships);
     res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
 });
 router.get('/b/:builds', async (req, res, next) => {
    try{
     let results = await db.builds(req.params.builds + ` blueprint`);
     res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
 });
module.exports = router;
