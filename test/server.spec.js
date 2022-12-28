const request = require('supertest');
const expect = require('chai').expect;
const path = require('path');
const mongoose = require('mongoose');

// calling enviroment variable from .env file
// require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('../app'); 

// Cookies.
const cookieParser = require('cookie-parser');
app.use(cookieParser());

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGO_URI,
    {
      // useNewUrlPaser: true,
      // useUnifiedTofology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    }
  )
  .then(() => console.log('MongoDB conected...'))
  .catch((err) => {
    console.log(err);
  });
});

describe('Basic Get method test', () => {
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
    var cookies;

    it('Issuing a token', async function() {
      // this.timeout(50000);
      var payload = {id:"one",pw:"one"};
      payload = JSON.stringify(payload);
      try {
        var res = await request(app)
        .post('/user/:id/:pw/')
        .send(payload)
        // .expect('set-cookie', 'Expires=Wed');
        .expect(200);
      } catch(e) {
        console.log(e);
      }
      cookies = res.headers['set-cookie'][0];
    });

    it('Verifying a token', async () => {
      console.log('Cookies: ', cookies,);
      const test = await request(app)
        .get('/user/')
        .set('Cookie', cookies)
        .expect(200);
      // console.log(test);
      // expect(test.body.user.id).toBe('one');
    });
    
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});