// testService.js

const path = require('path');

const sayHello = require('../../tests/app.spec').sayHello;

exports.showTest = (req, res) => {    
    // describe('App test!', function () {
    //     it('sayHello should return hello', function (done) {
    //         if(sayHello() === 'hello') {
    //             done();
    //         }
    //     });
    // });

    return res.sendFile(path.join(__dirname, '../../views/test/test.html'));
}
