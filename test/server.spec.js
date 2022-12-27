const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app'); 

describe('API Endpoint Test', () => {
  describe('GET /test', () => {
    it('response with html', (done) => {
      request(app)
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
    it('User confirming', async function() {
      this.timeout(50000);
      var payload = {id:"one",pw:"one"};
      payload = JSON.stringify(payload);
      try {
        const res = await request(app)
        .post('/user/:id/:pw/')
        // .set('Content-Type', 'application/json')
        // .set('Content-Type', 'string')
        .send(payload)
        // .expect('Content-Type', '/json/')
        .expect(200);
      } catch(e) {
        console.log(e);
      }
      
      // console.log('1');
      // console.log('body: ', res.body);
      // const cookie = res.headers('user');
      // console.log(cookie);
      
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