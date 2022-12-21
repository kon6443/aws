const express = require("express");
const router = express.Router();

const auth = require("../../models/authentication/authMiddleware");
const homeMiddleWare = require('../../models/home/homeService');

router.use('/', auth);

// Home page.
router.get('/', homeMiddleWare.showHome);
router.use(homeMiddleWare.errorHandler);

module.exports = router;