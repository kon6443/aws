let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = require('../server'); 

chai.use(chaiHttp);

describe('API Endpoint Test', () => {
  describe('GET request on /test', () => {
    it('should return test.html file', (done) => {
      chai.request(server)
      .get('/test')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
  });

//   describe('POST request on /user with data', () => {
//     it('should return 201', (done) => {
//       let params = {
//         userId: '123'
//       };

//       chai.request(server)
//       .post('/user')
//       .send(params)
//       .end((err, res) => {
//         res.should.have.status(201);
//         res.body.status.should.equal('success');
//         res.body.userId.should.equal(params.userId);
//         done();
//       });
//     });
//   });

//   describe('PUT request on /user with data', () => {
//     it('should return update data', (done) => {
//       let params = {
//         data: 'abc'
//       };

//       chai.request(server)
//       .put('/user/123')
//       .send(params)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.status.should.equal('updated');
//         res.body.data.should.equal('abc');
//         done();
//       });
//     });
//   });

//   describe('DELETE request on /user', () => {
//     it('should return deleted userId', (done) => {
//       chai.request(server)
//       .delete('/user/123')
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.status.should.equal('deleted');
//         res.body.userId.should.equal('123');
//         done();
//       });
//     });
//   });

//   describe('request on unknown uri', () => {
//     it('should return 404', (done) => {
//       chai.request(server)
//       .get('/nowhere')
//       .end((err, res) => {
//         res.should.have.status(404);
//         done();
//       });
//     });
//   });

});