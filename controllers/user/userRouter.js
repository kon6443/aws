/**
 * userRouter.js
 */

const express = require("express");
const router = express.Router();

const container = require('../../models/container/container');
const UserControllerInstance = container.get('UserController');
const FilterInstance = container.get('Filter');

router.get('/', UserControllerInstance.handleGetMain);
router.post('/sign-up', UserControllerInstance.handlePostSignUp);
router.post('/sign-in', UserControllerInstance.handlePostLogIn);
router.delete('/logout', FilterInstance.authenticationMethodDistinguisher, UserControllerInstance.handleDeleteLogOut);

router.delete('/kakao-disconnection', UserControllerInstance.handleDeleteDisconnectKakao);

router.use((err, req, res, next) => {
    res.json(err);
});

module.exports = router;
