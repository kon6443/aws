const express = require("express");
const router = express.Router();

const testMiddleWare = require('../../models/test/testService');

// Test page.
router.get('/', testMiddleWare.showTest);

module.exports = router;