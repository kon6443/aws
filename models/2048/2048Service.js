// 2048Service.js

const path = require('path');

//  To use python script
var PythonShell = require('python-shell');

class game2048Service {
    constructor(container) {
        this.scriptPath = path.join(__dirname, '..', '..', 'pythonScript');
        this.game2048Repository = container.get('game2048Repository');
    }
    getPythonFilePath(file_name) {
        return path.join(this.scriptPath, file_name);
    }
    async getRank(options, fileLocation) {
        const res = await new Promise((resolve, reject) => {
            PythonShell.PythonShell.run(fileLocation, options, function(err, res) {
                if(err) {
                    reject(err);
                } else { 
                    resolve(res);
                }
            });
        }); 
        return res;
    }
    async displayGame() {
        var options = {
            mode: 'json',
            pythonPath: '',  
            pythonOptions:['-u'],
            scriptPath: '',
            args: [null]
        };
        return await this.game2048Repository.callPythonScript(options, this.getPythonFilePath('dbDisplay.py'));
        // return this.getRank(options, this.getPythonFilePath('dbDisplay.py'));
    }
    
    async checkNewRecord(score) {
        var options = {
            mode: 'text',
            pythonPath:'',  
            pythonOptions:['-u'],
            scriptPath:'',
            args: [score]
        };
        return await this.game2048Repository.callPythonScript(options, this.getPythonFilePath('dbCompare.py')); 
    }
    
    async saveRecord(name, score, maxtile) {
        var options = {
            mode: 'text',
            pythonPath:'',  
            pythonOptions:['-u'],
            scriptPath:'',
            args: [name, score, maxtile]
        };
        return await this.game2048Repository.callPythonScript(options, this.getPythonFilePath('dbPost.py')); 
    }
}

module.exports = game2048Service;
