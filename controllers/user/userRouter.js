// userRouter.js

const express = require("express");
const router = express.Router();

// importing body-parser to create bodyParser object
const bodyParser = require('body-parser');
// allows you to use req.body var when you use http post method.
router.use(bodyParser.urlencoded({ extended: true }));

const auth = require("../../models/authentication/authMiddleware");
const container = require('../../models/container/container');
// const kakaoAPI = require('../../models/kakao/kakaoService');
// const userService = require('../../models/user/userService');
// const userServiceInstance = new userService(new kakaoAPI());

const userServiceInstance = container.get('userService');

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

    // User typed something wrong.
    if(errorFlag) return res.status(200).send(errorFlag);

    await userServiceInstance.mongoDBSaveUser(id, address, pw);
    return res.status(200).send('Your account has been created successfully, you can now log in.');
});

router.post('/:id/:pw', async (req, res) => {
    const {id, pw} = req.body;
    const userConfirmed = await userServiceInstance.loginCheck(id, pw);
    if(userConfirmed) {
        const token = await userServiceInstance.issueToken(id);
        return res
            .cookie('user', token,{maxAge: 30 * 60 * 1000}) // 1000 is a sec
            .end();
    } else {
        return res.status(200).send('Your password is not correct.');
    }
});

router.delete('/logout', async (req, res, next) => {
    // Sign out for Kakao.
    if(req.session.access_token) {
        const body = userServiceInstance.kakaoLogout(req.session.access_token);
        /**
         * Deleting junk tokens in the session DB.
         */
        req.session.destroy();
        return res.status(200).end();
    }

    // Sign out for local account that uses JWT.
    return res.clearCookie('user').end();
});

router.get('/kakao-disconnection', async (req, res, next) => {
    const body = await userServiceInstance.disconnectKakao(req.session.access_token);
    req.session.destroy();
    return res.status(302).redirect('/user');
});

router.use((err, req, res, next) => {
    res.json(err);
});

module.exports = router;
