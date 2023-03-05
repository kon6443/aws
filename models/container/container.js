/**
 * container.js
 */

const container = require('typedi').Container;
const mongoose = require('mongoose'); 
const userSchema = require('../DTO/user');
const User = mongoose.model('User', userSchema);  

const config = require('../../config/config');
const userRepository = require('../user/userRepository');
const kakaoService = require('../kakao/kakaoService');
const userService = require('../user/userService');

container.set('User', User);
container.set('config', config);
container.set('userRepository', new userRepository(container));
container.set('kakaoService', new kakaoService(container.get('config')));
container.set('userService', new userService(container));

module.exports = container;

