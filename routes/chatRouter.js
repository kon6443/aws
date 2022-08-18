// chatRouter.js

const express = require("express");
const router = express.Router();
const path = require('path');

const auth = require("../controllers/authMiddleware");

// importing user schema.
const User = require('../models/user');

router.use('/', auth);

// Main login page.
router.get('/', function(req, res) {
    const user = req.decoded;
    if(user) {
        return res.render(path.join(__dirname, '../views/chat/chat'), {header:user.id + "'s message"});
    } else {
        return res.sendFile(path.join(__dirname, '../views/chat/chat.html'));
    }
});


module.exports = router;
