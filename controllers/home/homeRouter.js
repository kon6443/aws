const express = require("express");
const router = express.Router();

const auth = require("../../models/authentication/authMiddleware");
const homeServiceInstacnce = require('../../models/home/homeService');

const path = require('path');

router.use('/', auth);

// Home page.
router.get('/', async (req, res, next) => {
    const activity = await homeServiceInstacnce.getActivity();
    const jwtDecodedUserInfo = req.decoded;
    const user = await homeServiceInstacnce.getLoggedInUser(jwtDecodedUserInfo, req.session.access_token);
    if(user) {
        return res.render(path.join(__dirname, '../../views/home/home'), {user:user, activity: activity});
    }
    return res.render(path.join(__dirname, '../../views/home/home_no_user'), {activity: activity});
});

router.get('/auth/kakao', async (req, res, next) => {
    try {
        const kakaoAuthURL = homeServiceInstacnce.getAuthenticateURL();
        return res.status(302).redirect(kakaoAuthURL);
    } catch(err) {
        return next(err);
    }
});

router.get('/auth/kakao/callback', async (req, res, next) => {
    const AUTHORIZE_CODE = req.query['code'];
    try {
        const {
            access_token,
            id_token,
            refresh_token
        } = await homeServiceInstacnce.getTokens(AUTHORIZE_CODE);
        req.session.access_token = access_token;
        req.session.id_token = id_token;
        req.session.refresh_token = refresh_token;
        return res.status(200).redirect('/user');
    } catch(err) {
        next(err);
    }
});

router.use((err, req, res, next) => {
    if(err.message==='Invalid user') {
        res.sendFile(path.join(__dirname, '../../views/home/home.html'));
    } else {
        console.log(err);
    }
});

module.exports = router;