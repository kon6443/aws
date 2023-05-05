/**
 * TetrisController.js
 */

class TetrisController {
    constructor() {
        console.log('controller');
    }

    handleGetMain = (req, res) => {
        try {
            return res.status(200).sendFile(path.join(__dirname, '../../views/Tetris/tetris.html'));
        } catch(err) {
            console.error(err);
            return res.status(500).json({err: err.message});
        }
    }

    handleErrorHandler = (err, req, res, next) => {
        console.error(err);
        return res.status(500).json({err: err.message});
    }

}

module.exports = TetrisController;
