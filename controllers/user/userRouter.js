// userRouter.js

const express = require("express");
const router = express.Router();

// Importing userService
const userMiddleWare = require('../../models/user/userService');

const auth = require("../../models/authentication/authMiddleware");
router.use('/', auth);

router.get('/', userMiddleWare.showMain);
router.post('/:id/:address/:pw/:pwc', userMiddleWare.signUp);
router.post('/:id/:pw', userMiddleWare.signIn);
router.delete('/logout', userMiddleWare.signOut);

module.exports = router;
