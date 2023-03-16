// userRouter.js

const express = require("express");
const router = express.Router();

// importing body-parser to create bodyParser object
const bodyParser = require('body-parser');
// allows you to use req.body var when you use http post method.
router.use(bodyParser.urlencoded({ extended: true }));

const auth = require("../../models/authentication/authMiddleware");

const container = require('../../models/container/container');
const UserControllerInstance = container.get('UserController');
// const userServiceInstance = container.get('userService');
const FilterInstance = container.get('Filter');

const path = require('path');
path.join(__dirname, 'public');

router.use('/', auth);

router.get('/', UserControllerInstance.getMainPage);

// signup, address should be changed to /signup
router.post('/sign-up', UserControllerInstance.postResource);

// login
router.post('/:id/:pw', UserControllerInstance.postLogIn);

// logout
router.delete('/logout', FilterInstance.authenticationMethodDistinguisher, UserControllerInstance.deleteLogOut);

router.get('/kakao-disconnection', UserControllerInstance.disconnetKakao);

router.use((err, req, res, next) => {
    res.json(err);
});

module.exports = router;
