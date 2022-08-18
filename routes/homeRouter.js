const express = require("express");
const router = express.Router();

const auth = require("../controllers/authMiddleware");
const homeMiddleWare = require('../controllers/home/home.controller');

router.use('/', auth);

// Home page.
router.get('/', homeMiddleWare.showHome);

module.exports = router;