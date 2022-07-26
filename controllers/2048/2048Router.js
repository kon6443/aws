const express = require("express");
const app = express();

const router = express.Router();
// const path = require('path');

const game2048MiddleWare = require('../../models/2048/2048Service');

// importing body-parser to create bodyParser object
const bodyParser = require('body-parser');
// allows you to use req.body var when you use http post method.
app.use(bodyParser.urlencoded({ extended: true }));

// allows you to ejs view engine.
app.set('view engine', 'ejs');  

router.get('/', game2048MiddleWare.displayGame);
router.get('/:score', game2048MiddleWare.checkNewRecord);
router.post('/:name/:score/:maxtile', game2048MiddleWare.saveRecord);

module.exports = router;
