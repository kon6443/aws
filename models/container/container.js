/**
 * container.js
 */

const container = require('typedi').Container;

const config = require('../../config/config');
const mongoose = require('mongoose'); 
const userSchema = require('../DTO/user');
const User = mongoose.model('User', userSchema);  

const MySQLRepository = require('../MySQLRepository');
const userRepository = require('../user/userRepository');
const ChatServer = require('../chat/ChatServer');

const filter = require('../../filter/filter');

const userService = require('../user/userService');
const UserController = require('../../controllers/user/UserController');

const game2048Repository = require('../2048/2048Repository');
const game2048Service = require('../2048/2048Service');
const Game2048Controller = require('../../controllers/2048/Game2048Controller');

const kakaoService = require('../kakao/kakaoService');

const boredAPI = require('../APIs/boredAPI');

const ChatService = require('../chat/chatService');
const ChatController = require('../../controllers/chat/ChatController');

// const TetrisService = require('../tetris/tetrisService');
const TetrisController = require('../../controllers/tetris/TetrisController');

const homeService = require('../home/homeService');
const HomeController = require('../../controllers/home/homeController');

const ArticleService = require('../articles/articleService');
const ArticleController = require('../../controllers/articles/articleController');

container.set('User', User);
container.set('config', config);
container.set('MySQLRepository', new MySQLRepository(container));
container.set('userRepository', new userRepository(container));
container.set('ChatServer', ChatServer);

container.set('game2048Repository', new game2048Repository());
container.set('game2048Service', new game2048Service(container));
container.set('Game2048Controller', new Game2048Controller(container.get('game2048Service')));

container.set('kakaoService', new kakaoService(container));

container.set('userService', new userService(container));
container.set('UserController', new UserController(container));

container.set('Filter', new filter(container));

container.set('boredAPI', new boredAPI());

container.set('ChatService', new ChatService(container.get('userService')));
container.set('ChatController', new ChatController(container.get('ChatService')));

// container.set('TetrisService', new TetrisService());
container.set('TetrisController', new TetrisController());

container.set('homeService', new homeService(container));
container.set('HomeController', new HomeController(container.get('homeService')));
container.set('ArticleService', new ArticleService(container));
container.set('ArticleController', new ArticleController(container));

module.exports = container;

