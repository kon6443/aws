// importing user schema.
const User = require('../models/user');

module.exports = async function(id) {
    const user = await User.findOne({id:id});
    return user;
}