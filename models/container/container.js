/**
 * container.js
 */

const container = require('typedi').Container;

const User = require('../DTO/user');
const config = require('../../config/config');
const userRepository = require('../user/userRepository');
const kakaoService = require('../kakao/kakaoService');
const userService = require('../user/userService');

container.set('User', new User());
container.set('config', config);
container.set('userRepository', new userRepository(container));
container.set('kakaoService', new kakaoService());
container.set('userService', new userService(container));

module.exports = container;

