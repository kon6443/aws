/**
 * container.js
 */

const container = require('typedi').Container;

const User = require('../DTO/user');
const userRepository = require('../user/userRepository');
const userService = require('../user/userService');

container.set('User', new User());
container.set('userRepository', new userRepository(container));
container.set('userService', new userService(container));

module.exports = container;
