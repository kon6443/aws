// userDAO.js

// importing user schema.
const User = require('../DTO/user');

exports.findById = async (id) => {
    return await User.findOne({id: id});
}
