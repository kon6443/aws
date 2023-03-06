/**
 * 2048Repository.js
 */

//  To use python script
var PythonShell = require('python-shell');

class game2048Repository {
    async callPythonScript(options, pythonFilePath) {
        const res = await new Promise((resolve, reject) => {
            PythonShell.PythonShell.run(pythonFilePath, options, function(err, res) {
                if(err) {
                    reject(err);
                } else { 
                    resolve(res);
                }
            });
        }); 
        return res;
    } 
}

module.exports = game2048Repository;
