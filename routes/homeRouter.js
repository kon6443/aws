const express = require("express");
const router = express.Router();
const path = require('path');

const auth = require("../controllers/authMiddleware");

router.use('/', auth);

// Home page.
router.get('/', function(req, res) {
    const user = req.decoded;
    if(user) {
        return res.render(path.join(__dirname, '../views/home/home'), {user:user});
    } else {
        return res.sendFile(path.join(__dirname, '../views/home/home.html'));
    }
    
});

module.exports = router;