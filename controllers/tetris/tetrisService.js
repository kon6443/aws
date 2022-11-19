// tetrisService.js

const path = require('path');

exports.startGame = (req, res) => {
    return res.sendFile(path.join(__dirname, '../../views/Tetris/tetris.html'));
}
