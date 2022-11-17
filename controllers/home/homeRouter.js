const express = require("express");
const router = express.Router();

const auth = require("../../models/authentication/authMiddleware");
const homeMiddleWare = require('./home.controller');

router.use('/', auth);

// Home page.
router.get('/', homeMiddleWare.showHome);

module.exports = router;