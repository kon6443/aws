/**
 * TetrisService.js
 */

const path = require('path');

class TetrisService {

    startTetris = async () => {
        console.log('Tetris has been started.');
    }

}

module.exports = TetrisService;

/*
exports.showTest = (req, res, next) => {    
    res.status(200).sendFile(path.join(__dirname, '../../views/test/test.html'));

    // try {
    //     let param = req.param.var;
    //     if(!param) {
    //         throw new Error('Parameter error');
    //     }
    // } catch(e) {
    //     next(e);
    // } finally {
    //     return res.status(200).sendFile(path.join(__dirname, '../../views/test/test.html'));
    // }
}

exports.errorHandler = (err, req, res, next) => {
    console.log(err);
    if(err.message==='Parameter error') {
        console.log(err);
        res.status(400).json({ message: "Parameter error" });
    }
}
*/