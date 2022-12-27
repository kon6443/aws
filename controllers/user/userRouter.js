// userRouter.js

const express = require("express");
const router = express.Router();

// importing body-parser to create bodyParser object
const bodyParser = require('body-parser');
// allows you to use req.body var when you use http post method.
router.use(bodyParser.urlencoded({ extended: true }));

// Importing userService
const userMiddleWare = require('../../models/user/userService');

const auth = require("../../models/authentication/authMiddleware");
router.use('/', auth);

router.get('/', userMiddleWare.showMain);
router.post('/:id/:address/:pw/:pwc', userMiddleWare.signUp);
router.post('/:id/:pw', userMiddleWare.signIn);
router.delete('/logout', userMiddleWare.signOut);

module.exports = router;
