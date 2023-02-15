// userRepository.js

// exports.findById = async (id) => {
//     return await User.findOne({id: id});
// }

// // importing user schema.
const container = require('typedi').Container;
const User = require('../DTO/user');

class userRepository {
    constructor() {
        this.User = User;
    }
    async findById(id) {
        return await User.findOne({id: id});
    }
}

container.set('userRepository', new userRepository());

module.exports = userRepository;