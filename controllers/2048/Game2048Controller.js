/**
 * Game2048Controller.js
 */

const path = require('path');

class Game2048Controller {
    constructor(serviceInstance) {
        this.serviceInstance = serviceInstance;
    }

    handleGetMain = async (req, res) => {
        const rank = await this.serviceInstance.displayGame(); 
        return res.render(path.join(__dirname, '../../views/2048/2048.ejs'), {rank:rank[0]});
    }

    handleGetCheckNewRecord = async (req, res) => {
        const results = await this.serviceInstance.checkNewRecord(req.query.score);
        return res.status(200).send(results);
    }

    handlePostSaveNewRecord = async (req, res) => {
        const { name, score, maxtile } = req.body;
        const results = await this.serviceInstance.saveRecord(name, score, maxtile);
        return res.status(200).send(results);
    }
}

module.exports = Game2048Controller;
