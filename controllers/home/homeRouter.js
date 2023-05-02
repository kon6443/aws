const express = require("express");
const router = express.Router();
const path = require('path');

const container = require('../../models/container/container');
const homeServiceInstacnce = container.get('homeService');
const HomeControllerInstance = container.get('HomeController');

// router.use('/', auth);

// Home page.
router.get('/', HomeControllerInstance.handleGetMainPage);
router.get('/auth/kakao', HomeControllerInstance.handleGetAuthenticateURLAndRedirect);

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
        return res.status(300).redirect('/user');
    } catch(err) {
        next(err);
    }
});

router.use((err, req, res, next) => {
    if(err.message==='Invalid user') {
        res.sendFile(path.join(__dirname, '../../views/home/home.html'));
    } else {
        console.error(err);
    }
});

module.exports = router;