// userRouter.js

const express = require("express");
const router = express.Router();

// importing body-parser to create bodyParser object
const bodyParser = require('body-parser');
// allows you to use req.body var when you use http post method.
router.use(bodyParser.urlencoded({ extended: true }));

const auth = require("../../models/authentication/authMiddleware");
const userServiceInstance = require('../../models/user/userService');

const path = require('path');
path.join(__dirname, 'public');

router.use('/', auth);

router.get('/', async (req, res) => {
    const jwtDecodedUserInfo = req.decoded;
    const user = await userServiceInstance.getLoggedInUser(jwtDecodedUserInfo, req.session.access_token);
    if(user) {
        return res.render(path.join(__dirname, '../../views/user/user'), {user:user});
    }
    return res.render(path.join(__dirname, '../../views/user/loginPage'));
});

router.post('/:id/:address/:pw/:pwc', async (req, res, next) => {
    const { id, address, pw, pwc } = req.body;
    const errorFlag = await userServiceInstance.checkValidation(id, address, pw, pwc);

    // user typed something wrong.
    if(errorFlag) return res.status(200).send(errorFlag);

    userServiceInstance.mongoDBSignUp(id, address, pw);
    return res.status(200).send('Your account has been created successfully, you can now log in.');
});

router.post('/:id/:pw', userServiceInstance.signIn);
router.delete('/logout', userServiceInstance.signOut);
router.get('/kakao-disconnection', userServiceInstance.disconnectKakao);

router.use(userServiceInstance.errorHandler);

module.exports = router;
