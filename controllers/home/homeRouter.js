const express = require("express");
const router = express.Router();

const container = require('../../models/container/container');
const HomeControllerInstance = container.get('HomeController');

// Home page.
router.get('/', HomeControllerInstance.handleGetMainPage);
router.get('/auth/kakao', HomeControllerInstance.handleGetAuthenticateURLAndRedirect);
router.get('/auth/kakao/callback', HomeControllerInstance.handleGetAuthCodeAndRedirect);
router.use(HomeControllerInstance.handleErrorHandling);

module.exports = router;