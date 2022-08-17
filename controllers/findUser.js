// importing user schema.
const User = require('../models/user');

module.exports = async function(id) {
    const userExists = await User.findOne({id:id});
    return userExists;
}