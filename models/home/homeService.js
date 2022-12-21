// homeService.js

const path = require('path');

exports.showHome = (req, res, next) => {
    try {
        const user = req.decoded;
        if(!user) {
            throw new Error('Invalid user');
        } else {
            return res.render(path.join(__dirname, '../../views/home/home'), {user:user});
        }
    } catch(e) {
        return next(e);
    }
}

exports.errorHandler = (err, req, res, next) => {
    if(err.message==='Invalid user') {
        res.sendFile(path.join(__dirname, '../../views/home/home.html'));
    }
}