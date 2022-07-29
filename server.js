const express = require('express');
const app = express();

app.use(express.static(__dirname + ''));

// allows you to ejs view engine.
app.set('view engine', 'ejs');  

//  To use python script
var PythonShell = require('python-shell');

// importing body-parser to create bodyParser object
const bodyParser = require('body-parser');
// allows you to use req.body var when you use http post method.
app.use(bodyParser.urlencoded({ extended: true }));

const port = 80;
const server = app.listen(port, function() {
    console.log('Listening on '+port+'!');
});

app.get('/', function(req, res) {
    return res.sendFile(__dirname + '/home.html');
});

app.get('/login', function(req, res) {
    return res.sendFile(__dirname + '/login/login.html');
});

app.post('/login/:signUpid/:signUpaddress/:signUppw/:signUppwc', function(req, res) {
    console.log('body: ', req.body);
    return res.sendFile(__dirname + '/login/login.html');
});

app.get('/2048', function(req, res, next) {
    var options = {
        mode: 'json',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: [null]
    };
    PythonShell.PythonShell.run('./pythonScript/dbDisplay.py', options, function(err, results) {
        if(err) throw err;
        return res.render(__dirname + '/2048/2048', {rank:results[0]});
    });
});

app.get('/2048/:score', function(req, res) {
    //req.query.country
    //req.params.country
    var options = {
        mode: 'text',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: [req.query.score]
    };
    PythonShell.PythonShell.run('./pythonScript/dbCompare.py', options, function(err, results) {
        if(err) throw err;
        return res.status(200).send(results);
    });
});

app.post('/2048/:name/:score/:maxtile', function(req, res) {
    var options = {
        mode: 'text',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: [req.body.name, req.body.score, req.body.maxtile]
    };
    PythonShell.PythonShell.run('./pythonScript/dbPost.py', options, function(err, results) {
        if(err) throw err;
        return res.status(200).send(results);
    });
});

app.get('/tetris', function(req, res) {
    return res.sendFile(__dirname + '/Tetris/tetris.html');
});

