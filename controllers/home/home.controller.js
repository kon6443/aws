// home.controller.js

const path = require('path');

exports.showHome = (req, res) => {
    const user = req.decoded;
    if(user) {
        return res.render(path.join(__dirname, '../../views/home/home'), {user:user});
    } else {
        return res.sendFile(path.join(__dirname, '../../views/home/home.html'));
    }
}
