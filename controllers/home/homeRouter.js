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

router.get('/auth/kakao/callback', HomeControllerInstance.handleGetAuthCodeAndRedirect);

router.use((err, req, res, next) => {
    if(err.message==='Invalid user') {
        res.sendFile(path.join(__dirname, '../../views/home/home.html'));
    } else {
        console.error(err);
    }
});

module.exports = router;