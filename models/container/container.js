/**
 * container.js
 */

const container = require('typedi').Container;

const mongoose = require('mongoose'); 
const userSchema = require('../DTO/user');
const User = mongoose.model('User', userSchema);  

const config = require('../../config/config');
const MySQLRepository = require('../MySQLRepository');
const userRepository = require('../user/userRepository');
const game2048Repository = require('../2048/2048Repository');
const game2048Service = require('../2048/2048Service');
const kakaoService = require('../kakao/kakaoService');
const userService = require('../user/userService');
const boredAPI = require('../APIs/boredAPI');
const homeService = require('../home/homeService');
const boardService = require('../board/boardService');

container.set('User', User);
container.set('config', config);
container.set('MySQLRepository', new MySQLRepository(container));
container.set('userRepository', new userRepository(container));
container.set('game2048Repository', new game2048Repository());
container.set('game2048Service', new game2048Service(container));
container.set('kakaoService', new kakaoService(container));
container.set('userService', new userService(container));
container.set('boredAPI', new boredAPI());
container.set('homeService', new homeService(container));
container.set('boardService', new boardService(container));

module.exports = container;

