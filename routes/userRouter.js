// loginRouter.js

const express = require("express");
const router = express.Router();

// Importing controller
const loginMiddleWare = require('../controllers/user/user.controller');

const auth = require("../controllers/authMiddleware");
router.use('/', auth);

router.get('/', loginMiddleWare.showMain);
router.post('/:id/:address/:pw/:pwc', loginMiddleWare.signUp);
router.post('/:id/:pw', loginMiddleWare.signIn);
router.delete('/logout', loginMiddleWare.signOut);

module.exports = router;
