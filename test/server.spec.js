const request = require('supertest');
const expect = require('chai').expect;
const server = require('../server'); 

describe('API Endpoint Test', () => {
  describe('GET /test', () => {
    it('response with html', (done) => {
      request(server)
        .get('/test/')
        .expect('Content-Type','text/html; charset=UTF-8')
        .expect(200)
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
    });
  });

  describe('POST /user/:id/:pw', () => {
    it('User confirming', (done) => {
      console.log();
      console.log('User confirming...');
      request(server)
        .post('/user/:id/:pw')
        .send({id:'one', pw:'one'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end((err, req, res) => {
          console.log('body: ', req.body);
          if(err) {
            done(err);
          } else {
            done();
          }
        });

      // const userConfirmed = await this.loginCheck(id, pw);
      // expect(userConfirmed).to.be.equal(1);
    });

    // it('Issuing a token.', async (done) => {
    //   const token = await this.issueToken(id);
    //   res
    //     .cookie('user', token,{maxAge: 30 * 60 * 1000}) // 1000 is a sec
    //     .end();

    //   expect(typeof(token)).to.be.equal(typeof(String));
    // });


    // it('Sending a user token.', async (done) => {
    //   request(server)
    //     .post('/user/:id/:pw')
    //     .expect()
    //     .end((err, res) => {
    //       if(err) {
    //         done(err);
    //       } else {
    //         done();
    //       }
    //     });
    // });
    
  });

});