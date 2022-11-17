// loginRouter.js

const express = require("express");
const router = express.Router();

// Importing controller
const userMiddleWare = require('./user.controller');

const auth = require("../../models/authentication/authMiddleware");
router.use('/', auth);

router.get('/', userMiddleWare.showMain);
router.post('/:id/:address/:pw/:pwc', userMiddleWare.signUp);
router.post('/:id/:pw', userMiddleWare.signIn);
router.delete('/logout', userMiddleWare.signOut);

module.exports = router;
