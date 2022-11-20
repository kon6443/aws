// 2048Service.js

const express = require("express");
const app = express();

const path = require('path');

//  To use python script
var PythonShell = require('python-shell');

// allows you to ejs view engine.
app.set('view engine', 'ejs');  

exports.displayGame = (req, res) => {
    var options = {
        mode: 'json',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: [null]
    };
    PythonShell.PythonShell.run(path.join(__dirname, '../../pythonScript/dbDisplay.py'), options, function(err, results) {
        if(err) throw err;
        return res.render(path.join(__dirname, '../../views/2048/2048.ejs'), {rank:results[0]});
    });
}

exports.checkNewRecord = (req, res) => {
    //req.query.country
    //req.params.country
    var options = {
        mode: 'text',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: [req.query.score]
    };
    PythonShell.PythonShell.run(path.join(__dirname, '../../pythonScript/dbCompare.py'), options, function(err, results) {
        if(err) throw err;
        return res.status(200).send(results);
    });
}

exports.saveRecord = (req, res) => {
    var options = {
        mode: 'text',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: [req.body.name, req.body.score, req.body.maxtile]
    };
    PythonShell.PythonShell.run(path.join(__dirname, '../../pythonScript/dbPost.py'), options, function(err, results) {
        if(err) throw err;
        return res.status(200).send(results);
    });
}