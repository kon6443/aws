// chat.controller.js

const path = require('path');

exports.showMain = (req, res) => {
    const user = req.decoded;
    if(user) {
        return res.render(path.join(__dirname, '../../views/chat/chat'), {header:user.id + "'s message"});
    } else {
        return res.sendFile(path.join(__dirname, '../../views/user/loginPage.html'));
    }
};
