const express = require("express");
const app = express();
const router = express.Router();
const path = require('path');

const container = require('../../models/container/container');
const game2048Service = container.get('game2048Service');
// const game2048MiddleWare = require('../../models/2048/2048Service');

// importing body-parser to create bodyParser object
const bodyParser = require('body-parser');
// allows you to use req.body var when you use http post method.
app.use(bodyParser.urlencoded({ extended: true }));

// allows you to ejs view engine.
app.set('view engine', 'ejs');  

// displayGame
router.get('/', async (req, res) => {
   const rank = await game2048Service.displayGame(); 
   return res.render(path.join(__dirname, '../../views/2048/2048.ejs'), {rank:rank[0]});
});
router.get('/:score', async (req, res) => {
    //req.query.country
    //req.params.country
    const results = await game2048Service.checkNewRecord(req.query.score);
    return res.status(200).send(results);
});
router.post('/:name/:score/:maxtile', async (req, res) => {
    const { name, score, maxtile } = req.body;
    const results = await game2048Service.saveRecord(name, score, maxtile);
    return res.status(200).send(results);
});

module.exports = router;
