const express = require("express");
const app = express();

const router = express.Router();
const path = require('path');

//  To use python script
var PythonShell = require('python-shell');

// importing body-parser to create bodyParser object
const bodyParser = require('body-parser');
// allows you to use req.body var when you use http post method.
app.use(bodyParser.urlencoded({ extended: true }));

// allows you to ejs view engine.
app.set('view engine', 'ejs');  

// router.route('/2048') //, function(req, res) {
//     .get('/2048', function(req, res, next) {
//         var options = {
//             mode: 'json',
//             pythonPath:'',  
//             pythonOptions:['-u'],
//             scriptPath:'',
//             args: [null]
//         };
//         PythonShell.PythonShell.run('./pythonScript/dbDisplay.py', options, function(err, results) {
//             if(err) throw err;
//             return res.render(__dirname + '/2048/2048', {rank:results[0]});
//             // return res.sendFile(path.join(__dirname, '../home.html'));
//         });
//     })
//     .get('/2048/:score', function(req, res) {
//         //req.query.country
//         //req.params.country
//         var options = {
//             mode: 'text',
//             pythonPath:'',  
//             pythonOptions:['-u'],
//             scriptPath:'',
//             args: [req.query.score]
//         };
//         PythonShell.PythonShell.run('./pythonScript/dbCompare.py', options, function(err, results) {
//             if(err) throw err;
//             return res.status(200).send(results);
//         });
//     })
//     .post('/2048/:name/:score/:maxtile', function(req, res) {
//         var options = {
//             mode: 'text',
//             pythonPath:'',  
//             pythonOptions:['-u'],
//             scriptPath:'',
//             args: [req.body.name, req.body.score, req.body.maxtile]
//         };
//         PythonShell.PythonShell.run('./pythonScript/dbPost.py', options, function(err, results) {
//             if(err) throw err;
//             return res.status(200).send(results);
//         });
//     });
// // });



router.get('/', function(req, res, next) {
    var options = {
        mode: 'json',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: [null]
    };
    PythonShell.PythonShell.run(path.join(__dirname, '../pythonScript/dbDisplay.py'), options, function(err, results) {
    // PythonShell.PythonShell.run('./pythonScript/dbDisplay.py', options, function(err, results) {
        if(err) throw err;
        return res.render(path.join(__dirname, '../2048/2048.ejs'), {rank:results[0]});
    });
});

router.get('/:score', function(req, res) {
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
        console.log(results);
        return res.status(200).send(results);
    });
});

router.post('/:name/:score/:maxtile', function(req, res) {
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

module.exports = router;



// Below code is original code.

// app.get('/2048', function(req, res, next) {
//     var options = {
//         mode: 'json',
//         pythonPath:'',  
//         pythonOptions:['-u'],
//         scriptPath:'',
//         args: [null]
//     };
//     PythonShell.PythonShell.run('./pythonScript/dbDisplay.py', options, function(err, results) {
//         if(err) throw err;
//         return res.render(__dirname + '/2048/2048', {rank:results[0]});
//     });
// });

// app.get('/2048/:score', function(req, res) {
//     //req.query.country
//     //req.params.country
//     var options = {
//         mode: 'text',
//         pythonPath:'',  
//         pythonOptions:['-u'],
//         scriptPath:'',
//         args: [req.query.score]
//     };
//     PythonShell.PythonShell.run('./pythonScript/dbCompare.py', options, function(err, results) {
//         if(err) throw err;
//         return res.status(200).send(results);
//     });
// });

// app.post('/2048/:name/:score/:maxtile', function(req, res) {
//     var options = {
//         mode: 'text',
//         pythonPath:'',  
//         pythonOptions:['-u'],
//         scriptPath:'',
//         args: [req.body.name, req.body.score, req.body.maxtile]
//     };
//     PythonShell.PythonShell.run('./pythonScript/dbPost.py', options, function(err, results) {
//         if(err) throw err;
//         return res.status(200).send(results);
//     });
// });
